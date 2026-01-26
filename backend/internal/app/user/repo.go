package user

import "skadi/backend/internal/app/entity"

// RepositoryDB describes all DB methods for user.
type RepositoryDB interface {
	// CreateUser creates a new user and fills given struct.
	CreateUser(user *entity.User) error
	// CreateUserWithProfile creates a new user and profile for them and fills given structs.
	CreateUserWithProfile(user *entity.User) error
	// GetByID returns user object with profile by given id.
	GetByID(id string) (*entity.User, error)
	// GetMany returns list with users.
	GetMany() ([]entity.User, error)
}
