// Package repository contains auth.RepositoryDB and auth.RepositoryCache implementations.
package repository

import (
	"errors"
	"fmt"

	"gorm.io/gorm"

	"skadi/backend/internal/app/auth"
	"skadi/backend/internal/app/entity"
)

// Ensure RepoDB implements interface.
var _ auth.RepositoryDB = (*RepoDB)(nil)

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

// CreateUser gets user by username and returns it.
func (r *RepoDB) GetUserByUsername(username string) (*entity.User, error) {
	user := &entity.User{}
	err := r.dbStorage.Where("username = ?", username).First(user).Error
	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		// user was not found
		return nil, fmt.Errorf("user with username: %w: %s", auth.ErrNotFound, err.Error())
	}
	return user, err // err OR nil
}
