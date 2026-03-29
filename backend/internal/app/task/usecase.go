// Package task contains all repos, usecases and controllers for task.
// Sub-package repo contains RepoDB implementation.
// Sub-package usecase contains UsecaseTeacher, UsecaseStudent and UsecaseClient implementations.
package task

import "skadi/backend/internal/app/entity"

type UsecaseTeacher interface {
	// CreateTaskWithSolutions creates a new task and solutions
	// for all given students and for all students linked to the given classes.
	CreateTaskWithSolutions(taskObj *entity.Task, studentIDs []int,
		classIDs []int) ([]entity.Solution, error)

	// UpdateTask updates the given task by given ID with the new data.
	// It returns the updated task object.
	// Allows to update the title, desc and task files.
	UpdateTask(teacherID, taskID int, newData *entity.TaskUpdate) (*entity.Task, error)
	// UpdateSolution updates the given solution by given ID with the new data.
	// It returns the updated solution object.
	// Allows to update the grade and status (only ready and archived).
	UpdateSolution(teacherID, solutionID int,
		newData *entity.SolutionUpdate) (*entity.Solution, error)

	// DeleteTaskByID deletes task object by given ID.
	DeleteTaskByID(userID, taskID int) error
	// DeleteSolutionByID deletes solution object by given ID.
	DeleteSolutionByID(userID, solutionID int) error

	// GetTasks returns all teacher tasks.
	// Search param appends condition to filter tasks by title (substring).
	GetTasks(teacherID int, search string, page *entity.Pagination) ([]entity.Task, error)
	// GetSolutions returns all solutions for the teacher tasks.
	// Search param appends condition to filter solutions by task title (substring).
	// It returns checked solutions if archived is true.
	GetSolutions(teacherID int, search string, archived bool,
		page *entity.Pagination) ([]entity.Solution, error)
}

type UsecaseStudent interface {
	// GetSolutions returns all student solutions.
	// It returns checked solutions if archived is true.
	GetSolutions(studID int, archived bool, page *entity.Pagination) ([]entity.Solution, error)
	// UpdateSolution updates the given solution by given ID with the new data.
	// It returns the updated solution object.
	// Allows to update the status (apart of archived), answer and solution files.
	UpdateSolution(studID, solutionID int,
		newData *entity.SolutionUpdate) (*entity.Solution, error)
}

type UsecaseClient interface {
	// GetByIDFull returns a full solution info and all students linked to the solution task.
	GetByIDFull(solutionID int,
		userClaims *entity.UserClaims) (*entity.Solution, []entity.Profile, error)
}
