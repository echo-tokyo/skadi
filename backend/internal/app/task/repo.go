package task

import "skadi/backend/internal/app/entity"

// RepositoryDB describes all DB methods for task and solution objects.
type RepositoryDB interface {
	// CreateTaskForStudents create a new task and empty solutions for every student.
	CreateTaskForStudents(taskObj *entity.Task, students []entity.Profile) ([]entity.Solution, error)
	// GetTaskByID returns task info by the given ID.
	GetTaskByID(id int) (*entity.Task, error)
	// UpdateTask updates the given task by given ID with the new data.
	UpdateTask(taskID int, newData *entity.TaskUpdate) error
	// DeleteTaskByID deletes task by given id.
	DeleteTaskByID(id int) error

	// GetTasks returns all teacher tasks.
	// Search param appends condition to filter tasks by title (substring).
	GetTasks(teacherID int, search string, page *entity.Pagination) ([]entity.Task, error)
	// GetTaskStudents returns all students linked to the given task.
	GetTaskStudents(taskID int) ([]entity.Profile, error)
}
