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
}

type UsecaseStudent interface {
	// CreateSolution()
}

type UsecaseClient interface {
	// GetByID returns a full solution info and all students linked to the solution task.
	GetByID(id int) (*entity.Solution, []entity.Profile, error)
}
