// Package class contains all repos, usecases and controllers for class.
// Sub-package repo contains RepoDB and RepoCache implementations.
// Sub-package usecase contains UsecaseClient and UsecaseMiddleware implementations.
package class

import "skadi/backend/internal/app/entity"

// UsecaseAdmin describes all class usecases for admin panel.
type UsecaseAdmin interface {
	// CreateClass creates a new class and fills given struct.
	Create(classObj *entity.Class, studentIDs []int) error
	// Update updates old class data to new one (by data ID).
	Update(data *entity.Class) error
	// DeleteByID deletes class object by given ID.
	DeleteByID(id int) error
}

// UsecaseClient describes all class usecases for client.
type UsecaseClient interface {
	// GetByID returns a class object by given ID.
	GetByID(id int) (*entity.Class, error)
	// ListShort returns slice of class objects (IDs and names only).
	ListShort() ([]entity.Class, error)
	// ListFull returns slice of class objects with full data.
	ListFull(page *entity.Pagination) ([]entity.Class, error)
}
