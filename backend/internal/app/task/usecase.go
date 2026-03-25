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
	// DeleteTaskByID deletes task object by given ID.
	DeleteTaskByID(userID, taskID int) error
	// DeleteSolutionByID deletes solution object by given ID.
	DeleteSolutionByID(userID, solutionID int) error
}

type UsecaseStudent interface {
	// CreateSolution()
}

type UsecaseClient interface {
	// GetByIDFull returns a full solution info and all students linked to the solution task.
	GetByIDFull(solutionID int,
		userClaims *entity.UserClaims) (*entity.Solution, []entity.Profile, error)
}
