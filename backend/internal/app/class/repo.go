package class

import "skadi/backend/internal/app/entity"

// RepositoryDB describes all DB methods for class.
type RepositoryDB interface {
	// CreateClass creates a new class and fills given struct.
	CreateClass(classObj *entity.Class, studentIDs []int) error
	// GetByIDShort returns class (ID and name only) by given id.
	GetByIDShort(id int) (*entity.Class, error)
	// GetByID returns class by given id.
	GetByID(id int) (*entity.Class, error)
	// Update updates class by given ID with the new data.
	// It returns the updated class object.
	Update(id int, newData *entity.ClassUpdate) error
	// DeleteByID deletes class object by given id.
	DeleteByID(id int) error

	// ListShort returns slice of class objects (IDs and names only).
	ListShort() ([]entity.Class, error)
	// ListFull returns slice of class objects with full data.
	ListFull(page *entity.Pagination) ([]entity.Class, error)
}
