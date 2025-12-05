package user

import "skadi/backend/internal/app/entity"

// RepositoryDB describes all DB methods for user.
type RepositoryDB interface {
	// CreateUser creates a new user and fills given struct.
	CreateUser(user *entity.User) error
}
