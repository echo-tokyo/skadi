// Package usecase contains user.UsecaseAdmin and user.UsecaseManager implementations.
package usecase

import (
	"errors"
	"fmt"

	"skadi/backend/config"
	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/user"
	"skadi/backend/internal/pkg/password"
)

const _adminRole = "admin"     // admin role for user
const _studentRole = "student" // student role for user

// Ensure UCAdmin implements interface.
var _ user.UsecaseAdmin = (*UCAdmin)(nil)

// UCAdmin represents an auth usecase for client.
// It implements the auth.UsecaseAdmin interface.
type UCAdmin struct {
	cfg        *config.Config
	userRepoDB user.RepositoryDB
}

// NewUCAdmin returns a new instance of UCAdmin.
func NewUCAdmin(cfg *config.Config, userRepoDB user.RepositoryDB) *UCAdmin {
	return &UCAdmin{
		cfg:        cfg,
		userRepoDB: userRepoDB,
	}
}

// CreateWithProfile creates a new user with profile in the DB and returns them.
// Password is a raw (not hashed) password.
func (u *UCAdmin) CreateWithProfile(userObj *entity.User) error {
	if userObj.Profile == nil {
		return errors.New("profile missing")
	}
	// set nil parent contact for non-student users
	if userObj.Role != _studentRole {
		userObj.Profile.ParentContact = nil
	}

	// hash password
	hashPasswd, err := password.Encode(userObj.Password)
	if err != nil {
		return fmt.Errorf("encode password: %w", err)
	}
	userObj.Password = hashPasswd

	// create user with profile
	err = u.userRepoDB.CreateUserWithProfile(userObj)
	if err != nil {
		return fmt.Errorf("create user: %w", err)
	}
	return nil
}

// GetByID returns user object with profile by given id.
func (u *UCAdmin) GetByID(id int) (*entity.User, error) {
	userObj, err := u.userRepoDB.GetByIDWithProfile(id)
	if err != nil {
		return nil, fmt.Errorf("get by id: %w", err)
	}
	return userObj, nil
}

// UpdateProfile updates user profile by given ID with given data.
// It returns user object with updated profile data.
func (u *UCAdmin) UpdateProfile(id int, newProfile *entity.Profile) (*entity.User, error) {
	// get user with old profile data
	userObj, err := u.userRepoDB.GetByIDWithProfile(id)
	if err != nil {
		return nil, fmt.Errorf("get by id: %w", err)
	}
	newProfile.ID = userObj.ID

	// set nil parent contact for non-student users
	if userObj.Role != _studentRole {
		userObj.Profile.ParentContact = nil
	}
	// update profile
	if err := u.userRepoDB.UpdateProfile(userObj.Profile, newProfile); err != nil {
		return nil, fmt.Errorf("update: %w", err)
	}
	// return user object with the new profile
	userObj.Profile = newProfile
	return userObj, nil
}

// DeleteByID deletes user object and user profile with given id.
func (u *UCAdmin) DeleteByID(id int) error {
	userObj, err := u.userRepoDB.GetByIDWithProfile(id)
	if err != nil {
		return fmt.Errorf("get by id: %w", err)
	}
	// deny deletion of admins
	if userObj.Role == _adminRole {
		return fmt.Errorf("cannot delete admin: %w", user.ErrNotFound)
	}
	if err := u.userRepoDB.DeleteByID(userObj); err != nil {
		return fmt.Errorf("delete by id: %w", err)
	}
	return nil
}

// GetByRoles returns user list with given roles.
func (u *UCAdmin) GetByRoles(roles []string) ([]entity.User, error) {
	userList, err := u.userRepoDB.GetByRoles(roles)
	if err != nil {
		return nil, fmt.Errorf("get many: %w", err)
	}
	return userList, nil
}

// ChangePassword changes user password.
// New password is a raw (not hashed) password.
func (u *UCAdmin) ChangePassword(id int, newPasswd []byte) error {
	userObj, err := u.userRepoDB.GetByID(id)
	if err != nil {
		return fmt.Errorf("get by id: %w", err)
	}
	// deny changing password for admins
	if userObj.Role == _adminRole {
		return fmt.Errorf("cannot change admin password: %w", user.ErrNotFound)
	}

	// hash password
	hashPasswd, err := password.Encode(newPasswd)
	if err != nil {
		return fmt.Errorf("encode password: %w", err)
	}
	userObj.Password = hashPasswd

	// update user's password
	if err := u.userRepoDB.UpdateUser(userObj); err != nil {
		return fmt.Errorf("change password: %w", err)
	}
	return nil
}
