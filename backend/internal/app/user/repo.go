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
	// UpdateUser updates old user data to new one (by data ID).
	UpdateUser(data *entity.User) error
	// UpdateProfile updates old user profile to new one (by profile ID).
	// Old user profile contacts (contact and parent contact) will be deleted
	// if they are changed and not used in other profiles.
	UpdateProfile(oldData, newData *entity.Profile) error
	// DeleteByID deletes user object and user profile with given id.
	// Also user profile contacts (contact and parent contact) will be deleted
	// if they are not used in other profiles.
	DeleteByID(data *entity.User) error
	// GetByRoles returns user list with given roles.
	GetByRoles(roles []string) ([]entity.User, error)
	// IsRole returns true if user with given ID has the given role.
	// IsRole(id int, role string) (bool, error)
}
