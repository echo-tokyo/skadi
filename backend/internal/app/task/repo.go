package task

import "skadi/backend/internal/app/entity"

// RepositoryDB describes all DB methods for task and solution objects.
type RepositoryDB interface {
	// CreateTaskForStudents create a new task and empty solutions for every student.
	CreateTaskForStudents(taskObj *entity.Task, students []entity.Profile) ([]entity.Solution, error)
	// GetTaskByID returns task info by the given ID.
	GetTaskByID(id int) (*entity.Task, error)
	// GetSolutionByID returns solution info (with task only) by the given ID.
	GetSolutionByID(id int) (*entity.Solution, error)
	// GetSolutionByIDFull returns a full solution info by the given ID.
	GetSolutionByIDFull(id int) (*entity.Solution, error)
	// UpdateTask updates the given task.
	UpdateTask(taskObj *entity.Task) error
	// UpdateSolution updates the given solution.
	UpdateSolution(solution *entity.Solution) error
	// DeleteTaskByID deletes task by given id.
	DeleteTaskByID(id int) error
	// DeleteSolutionByID deletes solution by given id.
	DeleteSolutionByID(id int) error

	// GetTeacherSolutions returns all solutions for the teacher tasks.
	// It returns completed solutions if archived is true.
	GetTeacherSolutions(archived bool, page *entity.Pagination) ([]entity.Solution, error)
	// GetStudentSolutions returns all student solutions.
	// It returns completed solutions if archived is true.
	GetStudentSolutions(archived bool, page *entity.Pagination) ([]entity.Solution, error)
	// GetTaskStudents returns all students linked to the given task.
	GetTaskStudents(taskID int) ([]entity.Profile, error)
}
