package solution

import "skadi/backend/internal/app/entity"

// RepositoryDB describes all DB methods for task and solution objects.
type RepositoryDB interface {
	// GetByID returns solution info (with task only) by the given ID.
	GetByID(id int) (*entity.Solution, error)
	// GetByIDFull returns a full solution info by the given ID.
	GetByIDFull(id int) (*entity.Solution, error)
	// Update updates the given solution by given ID with the new data.
	// It returns the updated solution object.
	Update(solutionID int, newData *entity.SolutionUpdate) error
	// DeleteByID deletes solution by given id.
	DeleteByID(id int) error

	// GetManyForTeacher returns all solutions for the teacher tasks.
	// Search param appends condition to filter solutions by task title (substring).
	// It returns checked solutions if archived is true.
	GetManyForTeacher(teacherID int, search string, archived bool,
		page *entity.Pagination) ([]entity.Solution, error)
	// GetManyForStudent returns all student solutions.
	// It returns checked solutions if archived is true.
	GetManyForStudent(studID int, archived bool,
		page *entity.Pagination) ([]entity.Solution, error)
}
