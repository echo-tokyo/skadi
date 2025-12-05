// Package repository contains auth.RepositoryDB implementation.
package repository

import (
	"errors"
	"fmt"

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
	if err != nil && errors.Is(err, gorm.ErrDuplicatedKey) {
		// user with such username already exists
		return fmt.Errorf("user with username: %w: %s", user.ErrAlreadyExists, err.Error())
	}
	return err // err OR nil
}
