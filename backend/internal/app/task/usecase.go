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
	// GetTaskByID returns a task object by the given id and
	// a list of students linked to the task solutions.
	GetTaskByID(teacherID, taskID int) (*entity.Task, []entity.Profile, error)
	// UpdateTask updates the given task by given ID with the new data.
	// It returns the updated task object.
	// Allows to update the title, desc and task files.
	UpdateTask(teacherID, taskID int, newData *entity.TaskUpdate) (*entity.Task, error)
	// DeleteTaskByID deletes task object by given ID.
	DeleteTaskByID(userID, taskID int) error

	// GetTasks returns all teacher tasks.
	// Search param appends condition to filter tasks by title (substring).
	GetTasks(teacherID int, search string, page *entity.Pagination) ([]entity.Task, error)
}
