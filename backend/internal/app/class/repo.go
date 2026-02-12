package class

import "skadi/backend/internal/app/entity"

// RepositoryDB describes all DB methods for class.
type RepositoryDB interface {
	// CreateClass creates a new class and fills given struct.
	CreateClass(classObj *entity.Class) error
	// GetByIDShort returns class (ID and name only) by given id.
	GetByIDShort(id int) (*entity.Class, error)
	// Update updates old class data to new one (by data ID).
	Update(data *entity.Class) error
	// DeleteByID deletes class object by given id.
	DeleteByID(id int) error

	// ListFull returns slice of class objects with full data.
	ListFull() ([]entity.Class, error)
	// ListShort returns slice of class objects (IDs and names only).
	ListShort() ([]entity.Class, error)
}
