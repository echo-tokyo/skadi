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

const _tableProfile = "Profile"                     // table name
const _tableContact = "Profile.Contact"             // table name
const _tableParentContact = "Profile.ParentContact" // table name

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
		err := tx.Omit(_tableProfile).Create(userObj).Error
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

		// find or create contact and parent contact
		if err := findOrCreateContacts(tx, userObj.Profile); err != nil {
			return fmt.Errorf("profile: %w", err)
		}
		// create user profile record
		if err = tx.Create(userObj.Profile).Error; err != nil {
			return fmt.Errorf("profile: %w", err)
		}
		return nil
	})
}

// GetByID returns user by given id.
func (r *RepoDB) GetByID(id int) (*entity.User, error) {
	var userObj entity.User
	err := r.dbStorage.Where(id).
		First(&userObj).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// user object with such id not found
		return nil, fmt.Errorf("user with id: %w", user.ErrNotFound)
	}
	if err != nil {
		return nil, err
	}
	return &userObj, nil
}

// GetByIDWithProfile returns user object with profile by given id.
func (r *RepoDB) GetByIDWithProfile(id int) (*entity.User, error) {
	var userObj entity.User
	err := r.dbStorage.
		Preload(_tableProfile).
		Preload(_tableContact).
		Preload(_tableParentContact).
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

// UpdateUser updates old user data to new one (by data ID).
func (r *RepoDB) UpdateUser(data *entity.User) error {
	err := r.dbStorage.Omit(_tableProfile).
		Save(data).Error
	if err != nil {
		return err
	}
	return nil
}

// UpdateProfile updates old user profile to new one (by profile ID).
// Old user profile contacts (contact and parent contact) will be deleted
// if they are changed and not used in other profiles.
func (r *RepoDB) UpdateProfile(oldData, newData *entity.Profile) error {
	return r.dbStorage.Transaction(func(tx *gorm.DB) error {
		// find or create contact and parent contact
		if err := findOrCreateContacts(tx, newData); err != nil {
			return err
		}
		// update user profile record
		if err := tx.Save(newData).Error; err != nil {
			return err
		}

		// delete unused contacts
		if err := deleteUnusedContact(tx, oldData.Contact, newData.Contact); err != nil {
			return fmt.Errorf("delete contact: %w", err)
		}
		err := deleteUnusedContact(tx, oldData.ParentContact, newData.ParentContact)
		if err != nil {
			return fmt.Errorf("delete parent contact: %w", err)
		}
		return nil
	})
}

// DeleteByID deletes user object and user profile with given id.
// Also user profile contacts (contact and parent contact) will be deleted
// if they are not used in other profiles.
func (r *RepoDB) DeleteByID(data *entity.User) error {
	return r.dbStorage.Transaction(func(tx *gorm.DB) error {
		// delete user (cascade with profile)
		if err := tx.Delete(&entity.User{}, data.ID).Error; err != nil {
			return err
		}
		// delete unused contacts (if user has a profile)
		if data.Profile != nil {
			if err := deleteUnusedContact(tx, data.Profile.Contact, nil); err != nil {
				return fmt.Errorf("delete contact: %w", err)
			}
			if err := deleteUnusedContact(tx, data.Profile.ParentContact, nil); err != nil {
				return fmt.Errorf("delete parent contact: %w", err)
			}
		}
		return nil
	})
}

// GetByRoles returns user list with given roles.
func (r *RepoDB) GetByRoles(roles []string) ([]entity.User, error) {
	if len(roles) == 0 {
		return nil, errors.New("no one role specified")
	}
	var userList []entity.User
	err := r.dbStorage.
		Preload(_tableProfile).
		Preload(_tableContact).
		Preload(_tableParentContact).
		Where("role IN ?", roles).
		Find(&userList).Error
	if err != nil {
		return nil, err
	}
	return userList, nil
}

// findOrCreateContacts finds or creates contact and parent contact info
func findOrCreateContacts(tx *gorm.DB, profile *entity.Profile) error {
	// find or create contact record
	err := tx.Where(entity.Contact{
		Email: profile.Contact.Email,
		Phone: profile.Contact.Phone,
	}).FirstOrCreate(profile.Contact).Error
	if err != nil {
		return fmt.Errorf("find contact: %w", err)
	}
	profile.ContactID = profile.Contact.ID

	// find or create parent contact record
	if profile.ParentContact != nil {
		err := tx.Where(entity.Contact{
			Email: profile.ParentContact.Email,
			Phone: profile.ParentContact.Phone,
		}).FirstOrCreate(profile.ParentContact).Error
		if err != nil {
			return fmt.Errorf("find parent contact: %w", err)
		}
		profile.ParentContactID = &profile.ParentContact.ID
	}
	return nil
}

// deleteUnusedContact deletes old contact record if it is not in use.
func deleteUnusedContact(tx *gorm.DB, oldCont, newCont *entity.Contact) error {
	if oldCont == nil || newCont == oldCont {
		return nil
	}

	var usageAmount int64
	// check both contact_id and parent_contact_id fields
	err := tx.Model(&entity.Profile{}).
		Where("contact_id = ?", oldCont.ID).
		Or("parent_contact_id = ?", oldCont.ID).
		Count(&usageAmount).Error
	if err != nil {
		return fmt.Errorf("count usage: id %v: %w", oldCont.ID, err)
	}

	// skip deletion if contact is still in use
	if usageAmount != 0 {
		return nil
	}
	// delete contact record
	err = tx.Delete(&entity.Contact{}, oldCont.ID).Error
	if err != nil {
		return fmt.Errorf("delete: id %v: %w", oldCont.ID, err)
	}
	return nil
}
