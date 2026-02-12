// Package repository contains auth.RepositoryDB implementation.
package repository

import (
	"errors"
	"fmt"

	"gorm.io/gorm"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/user"
)

const _tableClass = "Class"                         // table name
const _tableProfile = "Profile"                     // table name
const _tableContact = "Profile.Contact"             // table name
const _tableParentContact = "Profile.ParentContact" // table name

// Ensure RepoDB implements interface.
var _ user.RepositoryDB = (*RepoDB)(nil)

// RepoDB is a user DB repo.
// It implements the user.RepositoryDB interface.
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

// CreateUserFull creates a new user with class (if set) and
// profile for them and fills given structs.
func (r *RepoDB) CreateUserFull(userObj *entity.User) error {
	return r.dbStorage.Transaction(func(tx *gorm.DB) error {
		// create user record
		err := tx.Omit(_tableProfile).Create(userObj).Error
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			// user with such username already exists
			return fmt.Errorf("user with username: %w: %s", user.ErrAlreadyExists, err.Error())
		}
		if errors.Is(err, gorm.ErrForeignKeyViolated) {
			// class with given ID is not found
			return fmt.Errorf("user: %w: class is not found", user.ErrInvalidData)
		}
		if err != nil {
			return err
		}
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

		// get class info (without teacher)
		if userObj.ClassID != nil {
			if err = tx.Where(*userObj.ClassID).First(&userObj.Class).Error; err != nil {
				return fmt.Errorf("class: %w", err)
			}
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
		return nil, fmt.Errorf("user with id: %w: %s", user.ErrNotFound, err.Error())
	}
	return &userObj, err // err OR nil
}

// GetByIDFull returns user with class (if set) and profile by given id.
func (r *RepoDB) GetByIDFull(id int) (*entity.User, error) {
	var userObj entity.User
	err := r.dbStorage.
		Preload(_tableClass).
		Preload(_tableProfile).
		Preload(_tableContact).
		Preload(_tableParentContact).
		Where(id).First(&userObj).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// user object with such id not found
		return nil, fmt.Errorf("user with id: %w: %s", user.ErrNotFound, err.Error())
	}
	return &userObj, err // err OR nil
}

// GetByUsernameFull gets user with class (if set) and
// profile by username and returns it.
func (r *RepoDB) GetByUsernameFull(username string) (*entity.User, error) {
	userObj := &entity.User{}
	err := r.dbStorage.
		Preload(_tableClass).
		Preload(_tableProfile).
		Preload(_tableContact).
		Preload(_tableParentContact).
		Where("username = ?", username).First(userObj).Error
	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		// user was not found
		return nil, fmt.Errorf("user with username: %w: %s", user.ErrNotFound, err.Error())
	}
	return userObj, err // err OR nil
}

// UpdateUser updates old user data to new one (by data ID).
func (r *RepoDB) UpdateUser(data *entity.User) error {
	// collect updates to map
	updates := make(map[string]any, 0)
	updates["class_id"] = data.ClassID
	if len(data.Password) > 0 {
		updates["password"] = data.Password
	}

	if len(updates) == 0 {
		return nil
	}
	// update user
	err := r.dbStorage.Model(&entity.User{}).
		Where("id = ?", data.ID).
		Updates(updates).Error
	if errors.Is(err, gorm.ErrForeignKeyViolated) {
		// class with given ID is not found
		return fmt.Errorf("user: %w: class is not found", user.ErrInvalidData)
	}
	return err
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

// Delete deletes user object and user profile (by data ID).
// Also user profile contacts (contact and parent contact) will be deleted
// if they are not used in other profiles.
func (r *RepoDB) Delete(data *entity.User) error {
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

// GetByRoles returns user (with class if set and profile) list with given roles.
func (r *RepoDB) GetByRoles(roles []string) ([]entity.User, error) {
	if len(roles) == 0 {
		return nil, errors.New("no one role specified")
	}
	var userList []entity.User
	err := r.dbStorage.
		Preload(_tableClass, func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name") // preload only ID and name
		}).
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
	profile.ContactID = &profile.Contact.ID

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

// deleteUnusedContact deletes old contact record if it's not in use.
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
