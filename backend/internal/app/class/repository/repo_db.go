// Package repository contains class.RepositoryDB implementation.
package repository

import (
	"errors"
	"fmt"

	"gorm.io/gorm"

	"skadi/backend/internal/app/class"
	"skadi/backend/internal/app/entity"
)

// Ensure RepoDB implements interface.
var _ class.RepositoryDB = (*RepoDB)(nil)

// RepoDB is an class DB repo.
// It implements the class.RepositoryDB interface.
type RepoDB struct {
	dbStorage *gorm.DB
}

// NewRepoDB returns a new instance of RepoDB.
func NewRepoDB(dbStorage *gorm.DB) *RepoDB {
	return &RepoDB{
		dbStorage: dbStorage,
	}
}

// CreateClass creates a new class and fills given struct.
func (r *RepoDB) CreateClass(classObj *entity.Class) error {
	err := r.dbStorage.Create(classObj).Error
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		// class with such name already exists
		return fmt.Errorf("class with name: %w: %s", class.ErrAlreadyExists, err.Error())
	}
	if errors.Is(err, gorm.ErrForeignKeyViolated) {
		// teacher with given ID is not found
		return fmt.Errorf("class: %w: teacher is not found", class.ErrInvalidData)
	}
	return err // err OR nil
}

// GetByIDShort returns class (ID and name only) by given id.
func (r *RepoDB) GetByIDShort(id int) (*entity.Class, error) {
	var classObj entity.Class
	err := r.dbStorage.Select("id", "name").
		Where(id).First(&classObj).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// class object with such id not found
		return nil, fmt.Errorf("class with id: %w: %s", class.ErrNotFound, err.Error())
	}
	return &classObj, err // err OR nil
}

// Update updates old class data to new one (by data ID).
func (r *RepoDB) Update(data *entity.Class) error {
	panic("unimplemented")
}

// DeleteByID deletes class object by given id.
func (r *RepoDB) DeleteByID(id int) error {
	return r.dbStorage.Delete(&entity.Class{}, id).Error
}

// ListFull returns slice of class objects with full data.
func (r *RepoDB) ListFull() ([]entity.Class, error) {
	panic("unimplemented")
}

// ListShort returns slice of class objects (IDs and names only).
func (r *RepoDB) ListShort() ([]entity.Class, error) {
	panic("unimplemented")
}
