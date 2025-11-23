// Package config provides loading config data from external sources
// like env variables, yaml-files etc.
package config

import (
	"fmt"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
)

const (
	// server
	_defServerPort      = "8080"      // default server port
	_defShutdownTimeout = time.Minute // default server shutdown timeout

	// logging
	_defLogLevel   = 2     // default log level (info)
	_defJSONFormat = false // default log JSON-format

	// db
	_defDBUser       = "test_user"         // default db user
	_defDBName       = "test_db"           // default database name
	_defDBHost       = "127.0.0.1"         // default db host
	_defDBPort       = "3306"              // default db port
	_defMigrationSrc = "file://migrations" // default migrations source URL (dir ./migrations)
)

type (
	Config struct {
		Server  `yaml:"server"`
		Logging `yaml:"logging"`
		DB      `yaml:"db"`
	}

	Server struct {
		Port            string        `yaml:"port"`
		ShutdownTimeout time.Duration `yaml:"shutdown_timeout"`
	}

	Logging struct {
		LogLevel int `yaml:"log_level"`
		// use JSON format if true
		JSONFormat bool `yaml:"json_format"`
	}

	DB struct {
		User      string `yaml:"user"`
		Password  string `env-required:"true" env:"DB_PASSWORD"`
		Name      string `yaml:"name"`
		Host      string `yaml:"host"`
		Port      string `yaml:"port"`
		DSN       string
		Migration Migration `yaml:"migration"`
	}

	Migration struct {
		// URL to migrations source
		Src string `yaml:"src"`
		// URL to connect to DB to migrates
		DB string
	}
)

// NewDefault returns a new instance of Config with default data.
func NewDefault() *Config {
	return &Config{
		Server: Server{
			Port:            _defServerPort,
			ShutdownTimeout: _defShutdownTimeout,
		},
		Logging: Logging{
			LogLevel:   _defLogLevel,
			JSONFormat: _defJSONFormat,
		},
		DB: DB{
			User: _defDBUser,
			Name: _defDBName,
			Host: _defDBHost,
			Port: _defDBPort,
			Migration: Migration{
				Src: _defMigrationSrc,
			},
		},
	}
}

// Returns app config loaded from YAML-file.
func New() (*Config, error) {
	// fill with default values (for settings in yaml-file)
	cfg := NewDefault()

	// read YAML config file
	if err := cleanenv.ReadConfig("./config.yml", cfg); err != nil {
		return nil, fmt.Errorf("read yaml config file: %w", err)
	}
	// read ENV variables
	if err := cleanenv.ReadEnv(cfg); err != nil {
		return nil, fmt.Errorf("read env-variables: %w", err)
	}

	dbAddr := fmt.Sprintf("tcp(%s:%s)", cfg.DB.Host, cfg.DB.Port)
	// collect DSN string
	cfg.DB.DSN = fmt.Sprintf(
		"%s:%s@%s/%s?parseTime=true&timeout=5s",
		cfg.DB.User,
		cfg.DB.Password,
		dbAddr,
		cfg.DB.Name,
	)
	// collect DB connection URL string for migrate manager
	cfg.DB.Migration.DB = "mysql://" + cfg.DB.DSN
	return cfg, nil
}
