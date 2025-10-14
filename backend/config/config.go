// Package config provides loading config data from external sources
// like env variables, yaml-files etc.
package config

import (
	"fmt"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
)

const _infoLevel = 2 // info log level (default log level)

type (
	Config struct {
		Server  `yaml:"server"`
		Logging `yaml:"logging"`
		DB
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
		DSN      string
		User     string `env-required:"true" env:"DB_USER"`
		Password string `env-required:"true" env:"DB_PASSWORD"`
		Name     string `env-required:"true" env:"DB_NAME"`
		Host     string `env:"DB_HOST" env-default:"127.0.0.1"`
		Port     string `env:"DB_PORT" env-default:"3306"`
	}
)

// Returns app config loaded from YAML-file.
func New() (*Config, error) {
	// fill with default values (for settings in yaml-file)
	cfg := &Config{
		Server: Server{
			Port:            "8080",
			ShutdownTimeout: time.Minute,
		},
		Logging: Logging{
			LogLevel:   _infoLevel,
			JSONFormat: false,
		},
	}

	// read YAML config file
	if err := cleanenv.ReadConfig("./config.yml", cfg); err != nil {
		return nil, fmt.Errorf("read yaml config file: %w", err)
	}
	// read ENV variables
	if err := cleanenv.ReadEnv(cfg); err != nil {
		return nil, fmt.Errorf("read env-variables: %w", err)
	}

	dbConnParams := fmt.Sprintf("tcp(%s:%s)", cfg.DB.Host, cfg.DB.Port)
	// collect DSN string
	cfg.DB.DSN = fmt.Sprintf(
		"%s:%s@%s/%s?parseTime=true&timeout=10s",
		cfg.DB.User,
		cfg.DB.Password,
		dbConnParams,
		cfg.DB.Name,
	)
	return cfg, nil
}
