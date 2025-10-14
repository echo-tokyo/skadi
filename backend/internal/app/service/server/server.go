// Package server provides HTTP-server interface.
package server

import (
	"context"
	"fmt"
	"log/slog"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/config"
	"skadi/backend/internal/app/service/server/middleware"
)

// Server represents a HTTP-server.
type Server struct {
	// will be closed if the service was completely started and is ready-to-use now
	ready    chan struct{}
	cfg      *config.Config
	fiberApp *fiber.App
}

// New returns a new instance of server.
func New(cfg *config.Config /*, dbStorage *gorm.DB */) (*Server, error) {
	// fiber init
	server := &Server{
		ready: make(chan struct{}),
		cfg:   cfg,
		fiberApp: fiber.New(fiber.Config{
			ServerHeader:  "MeteoMonitoring",
			StrictRouting: false,
		}),
	}

	// set up base middlewares
	httpLogger := middleware.Logger(cfg.Logging.LogLevel, cfg.Logging.JSONFormat)
	if httpLogger != nil {
		server.fiberApp.Use(httpLogger)
	}
	server.fiberApp.Use(middleware.Recover())
	// register all endpoints
	// server.registerEndpointsV1(cfg, dbStorage) // , valid)

	return server, nil
}

// StartWithShutdown starts server and waits for
// context is done for gracefully shutdown server.
// This method is blocking.
func (s *Server) StartWithShutdown(ctx context.Context) error {
	slog.Info("start server...")
	defer slog.Info("stop server: ok")

	errChan := make(chan error, 1)
	defer close(errChan)
	// start server
	go func() {
		if err := s.fiberApp.Listen(":" + s.cfg.Server.Port); err != nil {
			errChan <- fmt.Errorf("server: listen: %w", err)
		}
	}()

	// notify that service is ready-to-use
	close(s.ready)
	// wait for context or server listen error
	select {
	case <-ctx.Done():
		if err := s.fiberApp.ShutdownWithTimeout(s.cfg.Server.ShutdownTimeout); err != nil {
			return fmt.Errorf("server: shutdown: %w", err)
		}
		return nil
	case err := <-errChan:
		return err
	}
}

// Ready signals that the service is ready-to-use.
func (s *Server) Ready() <-chan struct{} {
	return s.ready
}
