package user

import "skadi/backend/internal/app/entity"

// RepositoryDB describes all DB methods for user.
type RepositoryDB interface {
	// CreateUser creates a new user and fills given struct.
	CreateUser(user *entity.User) error
	// CreateUserWithProfile creates a new user and profile for them and fills given structs.
	CreateUserWithProfile(user *entity.User) error
	// GetByID returns user by given id.
	GetByID(id int) (*entity.User, error)
	// GetByIDWithProfile returns user object with profile by given id.
	GetByIDWithProfile(id int) (*entity.User, error)
	// DeleteByID deletes user object and user profile with given id.
	DeleteByID(id int) error
	// GetByRoles returns user list with given roles.
	GetByRoles(roles []string) ([]entity.User, error)
}
