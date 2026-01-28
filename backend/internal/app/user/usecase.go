package user

import "skadi/backend/internal/app/entity"

// UsecaseManager describes all user usecases for CLI-manager.
type UsecaseManager interface {
	// CreateAdmin creates a new admin user in the DB and returns them.
	// Password is a raw (not hashed) password.
	CreateAdmin(username string, passwd []byte) (*entity.User, error)
	// DeleteAdminByID deletes admin user with given id.
	DeleteAdminByID(id int) error
	// GetAdmins returns all admins.
	GetAdmins() ([]entity.User, error)
}

// UsecaseAdmin describes all user usecases for admin panel.
type UsecaseAdmin interface {
	// CreateWithProfile creates a new user with profile in the DB and returns them.
	// User.Password is a raw (not hashed) password.
	CreateWithProfile(userObj *entity.User) error
	// GetByID returns user object with profile by given id.
	GetByID(id int) (*entity.User, error)
	// DeleteByID deletes user object and user profile with given id.
	DeleteByID(id int) error
	// GetByRoles returns user list with given roles.
	GetByRoles(roles []string) ([]entity.User, error)
}
