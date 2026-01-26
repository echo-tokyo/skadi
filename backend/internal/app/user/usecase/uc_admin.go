// Package usecase contains auth.UsecaseAdmin implementation.
package usecase

import (
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

// CreateAdmin creates a new admin user in the DB and returns them.
// Password is a raw (not hashed) password.
func (u *UCAdmin) CreateAdmin(username string, passwd []byte) (*entity.User, error) {
	// hash password
	hashPasswd, err := password.Encode(passwd)
	if err != nil {
		return nil, fmt.Errorf("encode password: %w", err)
	}

	userObj := &entity.User{
		Username: username,
		Password: hashPasswd,
		Role:     _adminRole,
	}
	// create user
	err = u.userRepoDB.CreateUser(userObj)
	if err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}
	return userObj, nil
}

// CreateWithProfile creates a new user with profile in the DB and returns them.
// Password is a raw (not hashed) password.
func (u *UCAdmin) CreateWithProfile(userObj *entity.User) error {
	if userObj.Profile == nil {
		return fmt.Errorf("profile missing: %w", user.ErrInvalidData)
	}
	// set nil  parent contact for non-student users
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
func (u *UCAdmin) GetByID(id string) (*entity.User, error) {
	profile, err := u.userRepoDB.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("get by id: %w", err)
	}
	return profile, nil
}
