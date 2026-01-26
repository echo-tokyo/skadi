// Package repository contains auth.RepositoryDB implementation.
package repository

import (
	"errors"
	"fmt"
	"log/slog"

	"gorm.io/gorm"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/user"
)

// Ensure RepoDB implements interface.
var _ user.RepositoryDB = (*RepoDB)(nil)

// RepoDB is an auth RepoDB repo.
// It implements the auth.RepoDB interface.
type RepoDB struct {
	dbStorage *gorm.DB
}

// NewRepoDB returns a new instance of RepoDB.
func NewRepoDB(dbStorage *gorm.DB) *RepoDB {
	return &RepoDB{
		dbStorage: dbStorage,
	}
}

// CreateUser creates new user and fills given struct.
func (r *RepoDB) CreateUser(userObj *entity.User) error {
	err := r.dbStorage.Create(userObj).Error
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		// user with such username already exists
		return fmt.Errorf("user with username: %w: %s", user.ErrAlreadyExists, err.Error())
	}
	return err // err OR nil
}

// CreateUserWithProfile creates a new user and profile for them and fills given structs.
func (r *RepoDB) CreateUserWithProfile(userObj *entity.User) error {
	return r.dbStorage.Transaction(func(tx *gorm.DB) error {
		// create user record
		err := tx.Omit("Profile").Create(userObj).Error
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			// user with such username already exists
			return fmt.Errorf("user with username: %w: %s", user.ErrAlreadyExists, err.Error())
		}
		if err != nil {
			return err
		}
		slog.Debug("user with profile", "user", userObj)
		// set profile id
		userObj.Profile.ID = userObj.ID
		// find or create contact record
		err = tx.Where(entity.Contact{
			Email: userObj.Profile.Contact.Email,
			Phone: userObj.Profile.Contact.Phone,
		}).FirstOrCreate(userObj.Profile.Contact).Error
		if err != nil {
			return fmt.Errorf("profile: contact: %w", err)
		}
		userObj.Profile.ContactID = userObj.Profile.Contact.ID

		// find or create parent contact record
		if userObj.Profile.ParentContact != nil {
			err := tx.Where(entity.Contact{
				Email: userObj.Profile.ParentContact.Email,
				Phone: userObj.Profile.ParentContact.Phone,
			}).FirstOrCreate(userObj.Profile.ParentContact).Error
			if err != nil {
				return fmt.Errorf("profile: parent contact: %w", err)
			}
			userObj.Profile.ParentContactID = &userObj.Profile.ParentContact.ID
		}
		// create user profile record
		err = tx.Create(userObj.Profile).Error
		if err != nil {
			return fmt.Errorf("profile: %w", err)
		}
		return nil
	})
}

// GetByID returns user object with profile by given id.
func (r *RepoDB) GetByID(id string) (*entity.User, error) {
	var userObj entity.User
	err := r.dbStorage.
		Preload("Profile").
		Preload("Profile.Contact").
		Preload("Profile.ParentContact").
		Where(id).First(&userObj).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// user object with such id not found
		return nil, fmt.Errorf("user with id: %w", user.ErrNotFound)
	}
	if err != nil {
		return nil, err
	}
	return &userObj, nil
}
