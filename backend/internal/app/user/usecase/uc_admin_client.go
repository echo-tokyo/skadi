// Package usecase contains user.UsecaseAdmin, user.UsecaseClient
// and user.UsecaseManager implementations.
package usecase

import (
	"errors"
	"fmt"

	"skadi/backend/config"
	"skadi/backend/internal/app/class"
	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/user"
	"skadi/backend/internal/pkg/password"
)

const _adminRole = "admin"     // admin role for user
const _studentRole = "student" // student role for user

// Ensure UCAdmin implements interfaces.
var _ user.UsecaseAdmin = (*UCAdminClient)(nil)
var _ user.UsecaseClient = (*UCAdminClient)(nil)

// UCAdminClient represents a user usecase for admin and client.
// It implements the user.UsecaseAdmin and the user.UsecaseClient interfaces.
type UCAdminClient struct {
	cfg         *config.Config
	userRepoDB  user.RepositoryDB
	classRepoDB class.RepositoryDB
}

// NewUCAdminClient returns a new instance of UCAdminClient.
func NewUCAdminClient(cfg *config.Config, userRepoDB user.RepositoryDB,
	classRepoDB class.RepositoryDB) *UCAdminClient {

	return &UCAdminClient{
		cfg:         cfg,
		userRepoDB:  userRepoDB,
		classRepoDB: classRepoDB,
	}
}

// CreateWithProfile creates a new user with profile in the DB and returns them.
// Password is a raw (not hashed) password.
func (u *UCAdminClient) CreateWithProfile(userObj *entity.User) error {
	if userObj.Profile == nil {
		return errors.New("profile missing")
	}
	// set nil class ID and parent contact for non-student users
	if userObj.Role != _studentRole {
		userObj.ClassID = nil
		userObj.Profile.ParentContact = nil
	}

	// hash password
	hashPasswd, err := password.Encode(userObj.Password)
	if err != nil {
		return fmt.Errorf("encode password: %w", err)
	}
	userObj.Password = hashPasswd

	// create user with profile
	err = u.userRepoDB.CreateUserFull(userObj)
	if err != nil {
		return fmt.Errorf("create user: %w", err)
	}
	// schedule is unnecessary data in this usecase
	if userObj.Class != nil {
		userObj.Class.Schedule = nil
	}
	return nil
}

// GetByID returns user object with profile by given id.
func (u *UCAdminClient) GetByID(id int) (*entity.User, error) {
	userObj, err := u.userRepoDB.GetByIDFull(id)
	if err != nil {
		return nil, fmt.Errorf("get by id: %w", err)
	}
	// schedule is unnecessary data in this usecase
	if userObj.Class != nil {
		userObj.Class.Schedule = nil
	}
	return userObj, nil
}

// Update updates user (class and profile) by given ID with given data.
// It returns user object with updated user data.
func (u *UCAdminClient) Update(id int, newUser *entity.User) (*entity.User, error) {
	userObj, err := u.UpdateProfile(id, newUser.Profile)
	if err != nil {
		return nil, fmt.Errorf("profile: %w", err)
	}

	// skip class update for non-student users and not updated data
	if userObj.Role != _studentRole || userObj.ClassID == newUser.ClassID {
		return userObj, nil
	}

	// update user object only
	userObj.ClassID = newUser.ClassID // set new class ID
	userObj.Password = nil            // skip password updates
	if err := u.userRepoDB.UpdateUser(userObj); err != nil {
		return nil, fmt.Errorf("user: %w", err)
	}

	// set NULL group for student
	if newUser.ClassID == nil {
		userObj.Class = nil
		return userObj, nil
	}

	// get class by ID
	userObj.Class, err = u.classRepoDB.GetByIDShort(*newUser.ClassID)
	if err != nil {
		return nil, fmt.Errorf("get class %w", err)
	}
	return userObj, nil
}

// UpdateProfile updates user profile by given ID with given data.
// It returns user object with updated profile data.
func (u *UCAdminClient) UpdateProfile(id int, newProfile *entity.Profile) (*entity.User, error) {
	// get user with old profile data
	userObj, err := u.userRepoDB.GetByIDFull(id)
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
func (u *UCAdminClient) DeleteByID(id int) error {
	userObj, err := u.userRepoDB.GetByIDFull(id)
	if err != nil {
		return fmt.Errorf("get by id: %w", err)
	}
	// deny deletion of admins
	if userObj.Role == _adminRole {
		return fmt.Errorf("cannot delete admin: %w", user.ErrNotFound)
	}
	if err := u.userRepoDB.Delete(userObj); err != nil {
		return fmt.Errorf("delete by id: %w", err)
	}
	return nil
}

// GetByRoles returns user list with given roles.
func (u *UCAdminClient) GetByRoles(roles []string) ([]entity.User, error) {
	userList, err := u.userRepoDB.GetByRoles(roles)
	if err != nil {
		return nil, fmt.Errorf("get many: %w", err)
	}
	return userList, nil
}

// ChangePasswordAsAdmin changes password of any client.
// New password is a raw (not hashed) password.
func (u *UCAdminClient) ChangePasswordAsAdmin(id int, newPasswd []byte) error {
	var noCheck = func(_ *entity.User) error { return nil }
	return u.changePassword(id, newPasswd, noCheck)
}

// ChangePasswordAsClient changes client password.
// Passwords is a raw (not hashed) passwords.
// The new password cannot be the same as the old one.
func (u *UCAdminClient) ChangePasswordAsClient(id int, oldPasswd, newPasswd []byte) error {
	return u.changePassword(id, newPasswd, func(userObj *entity.User) error {
		// check that real user password and the entered old password are equal
		if !password.IsCorrect(oldPasswd, userObj.Password) {
			return fmt.Errorf("invalid old password: %w", user.ErrInvalidData)
		}
		// check that the new password and the old password are different,
		// so if the isCorrect() returns true it means the new password is equal to the old one
		if password.IsCorrect(newPasswd, userObj.Password) {
			return fmt.Errorf("new password equals to the old one: %w", user.ErrConflict)
		}
		return nil
	})
}

// changePassword changes user password.
func (u *UCAdminClient) changePassword(id int, newPasswd []byte,
	checkFunc func(userObj *entity.User) error) error {

	userObj, err := u.userRepoDB.GetByID(id)
	if err != nil {
		return fmt.Errorf("get by id: %w", err)
	}
	// deny changing password for admins
	if userObj.Role == _adminRole {
		return fmt.Errorf("cannot change admin password: %w", user.ErrNotFound)
	}

	// apply additional password checks
	if err := checkFunc(userObj); err != nil {
		return err
	}

	// hash new password
	userObj.Password, err = password.Encode(newPasswd)
	if err != nil {
		return fmt.Errorf("encode new password: %w", err)
	}
	// update user's password
	if err := u.userRepoDB.UpdateUser(userObj); err != nil {
		return fmt.Errorf("change password: %w", err)
	}
	return nil
}
