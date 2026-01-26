package user

import "skadi/backend/internal/app/entity"

// UsecaseAdmin describes all user usecases for admin panel.
type UsecaseAdmin interface {
	// CreateAdmin creates a new admin user in the DB and returns them.
	// Password is a raw (not hashed) password.
	CreateAdmin(username string, passwd []byte) (*entity.User, error)
	// CreateWithProfile creates a new user with profile in the DB and returns them.
	// User.Password is a raw (not hashed) password.
	CreateWithProfile(userObj *entity.User) error
	// GetByID returns user object with profile by given id.
	GetByID(id string) (*entity.User, error)
	// GetMany returns list with users.
	GetMany() ([]entity.User, error)
}
