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
	// Delete deletes solution and solution files.
	Delete(solObj *entity.Solution) error

	// GetManyForTeacher returns all solutions for the teacher tasks.
	// Search param appends condition to filter solutions
	// by task title or student fullname (substring).
	// StatusID param appends condition to filter solutions by status.
	GetManyForTeacher(teacherID int, search string, statusID int,
		page *entity.Pagination) ([]entity.Solution, error)
	// GetManyForStudent returns all student solutions.
	// StatusID param appends condition to filter solutions by status.
	GetManyForStudent(studID int, statusID int,
		page *entity.Pagination) ([]entity.Solution, error)
}
