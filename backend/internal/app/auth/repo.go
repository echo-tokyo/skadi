package auth

import (
	"time"

	"skadi/backend/internal/app/entity"
)

// RepositoryDB describes all DB methods for auth.
type RepositoryDB interface {
	// CreateUser gets user by username and returns it.
	GetUserByUsername(username string) (*entity.User, error)
}

// RepositoryCache describes all cache methods for auth.
type RepositoryCache interface {
	// Set token to blacklist expiring after exp duration.
	SetTokenToBlacklist(token string, exp time.Duration) error
	// TokenIsBlacklisted returns true, if given token is blacklisted.
	TokenIsBlacklisted(token string) (bool, error)
}
