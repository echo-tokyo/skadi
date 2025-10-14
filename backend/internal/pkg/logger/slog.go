// Package logger provides init function to setup global slog logger.
package logger

import (
	"io"
	"log/slog"
	"os"
	"time"
)

const (
	_debugLevel = 1 // debug log level
	_infoLevel  = 2 // info log level
	_errorLevel = 4 // error log level
)

// slogParams represents params for default slog logger.
type slogParams struct {
	// JSON logs format if true else text (by default)
	jsonFormat bool
	// Logs level (1 - debug, 2 - info, 3 - warn, 4 - error)
	level int
	// Output writer
	out io.Writer
}

// SlogOption represents a param for slog logger.
type SlogOption func(*slogParams)

// InitSlog sets up default slog logger for application with given options.
// Also it sets default log logger (standart lib).
// Default logger uses text format and info log level.
// Options can be set with "With..." funcs.
func InitSlog(options ...SlogOption) {
	// default options
	params := &slogParams{
		jsonFormat: false,
		level:      _infoLevel,
		out:        os.Stderr,
	}
	// apply custom options
	for _, option := range options {
		option(params)
	}

	// options for slog with log level
	handlerOpts := &slog.HandlerOptions{
		Level: slog.Level(translateSlogLogLevel(params.level)),
		ReplaceAttr: func(_ []string, attr slog.Attr) slog.Attr {
			// set time to UTC
			if attr.Key == "time" {
				attr.Value = slog.AnyValue(time.Now().UTC())
			}
			return attr
		},
	}

	// create new slog instance with specified format
	var newLog *slog.Logger
	if params.jsonFormat {
		newLog = slog.New(slog.NewJSONHandler(params.out, handlerOpts))
	} else {
		newLog = slog.New(slog.NewTextHandler(params.out, handlerOpts))
	}
	slog.SetDefault(newLog)
}

// Set JSON format for slog logger.
func WithJSONFormat() SlogOption {
	return func(s *slogParams) {
		s.jsonFormat = true
	}
}

// Set log level for slog logger.
// Appplies default level (2 - info) if invalid value was given.
// Accepts values: 1 - debug, 2 - info, 3 - warn, 4 - error.
func WithLogLevel(level int) SlogOption {
	if level < _debugLevel || level > _errorLevel {
		level = _infoLevel
	}
	return func(s *slogParams) {
		s.level = level
	}
}

// translateSlogLogLevel translates sequently
// log level (1..2..3..4) to slog level (-4..0..4..8).
func translateSlogLogLevel(logLevel int) int {
	return logLevel*4 - 8 // nolint:mnd // sequence formula
}
