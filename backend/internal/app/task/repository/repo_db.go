// Package repository contains task.RepositoryDB implementation.
package repository

import (
	"errors"
	"fmt"

	"gorm.io/gorm"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/task"
)

const (
	_preloadTask           = "Task"                     // object field name
	_preloadTeacher        = "Task.TeacherUser"         // object field name
	_preloadTeacherProfile = "Task.TeacherUser.Profile" // object field name
	_preloadStudent        = "StudentUser"              // object field name
	_preloadStudentProfile = "StudentUser.Profile"      // object field name
	_preloadStatus         = "Status"                   // object field name

	_fieldID        = "id"          // table field name
	_fieldFullname  = "fullname"    // table field name
	_fieldTitle     = "title"       // table field name
	_fieldDesc      = "description" // table field name
	_fieldUpdatedAt = "updated_at"  // table field name

	_orderByIDDESC = "id DESC" // condition to order data by id DESC

	_defaultStatusID  = 1 // ID of default solution status "backlog"
	_archivedStatusID = 4 // ID of archived solution status "checked"
)

// Ensure RepoDB implements interface.
var _ task.RepositoryDB = (*RepoDB)(nil)

// RepoDB is a task DB repo.
// It implements the [task.RepositoryDB] interface.
type RepoDB struct {
	dbStorage *gorm.DB
}

// NewRepoDB returns a new instance of [RepoDB].
func NewRepoDB(dbStorage *gorm.DB) *RepoDB {
	return &RepoDB{
		dbStorage: dbStorage,
	}
}

// CreateTaskForStudents create a new task and empty solutions for every student.
func (r *RepoDB) CreateTaskForStudents(taskObj *entity.Task,
	students []entity.Profile) ([]entity.Solution, error) {

	var (
		solutions = make([]entity.Solution, len(students))
	)

	// transaction to create the task and solutions
	err := r.dbStorage.Transaction(func(tx *gorm.DB) error {
		// create task
		err := tx.Create(taskObj).Error
		if errors.Is(err, gorm.ErrForeignKeyViolated) {
			// teacher with given ID is not found
			return fmt.Errorf("task: teacher: %w", task.ErrNotFoundUser)
		}
		if err != nil {
			return err
		}

		// get status object
		var statusObj *entity.Status
		err = tx.Where(_defaultStatusID).First(&statusObj).Error
		if err != nil {
			return fmt.Errorf("get default solution status: %w", err)
		}

		// finish transaction if no one student was given
		if len(students) == 0 {
			return nil
		}

		for idx := range students {
			solutions[idx] = entity.Solution{
				TaskID:    taskObj.ID,
				StudentID: *students[idx].ID,
				StatusID:  _defaultStatusID,
				Student:   &students[idx],
				Status:    statusObj,
			}
		}
		if err = tx.Omit(_preloadStudent, _preloadStatus).Create(solutions).Error; err != nil {
			return fmt.Errorf("solution for students: %w", err)
		}
		return nil
	})
	return solutions, err // err OR nil
}

// GetTaskByID returns task info by the given ID.
func (r *RepoDB) GetTaskByID(id int) (*entity.Task, error) {
	var taskObj entity.Task
	err := r.dbStorage.
		Where(id).First(&taskObj).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// task object with such id not found
		return nil, fmt.Errorf("task with id: %w", task.ErrNotFound)
	}
	return &taskObj, err // err OR nil
}

// UpdateTask updates the given task by given ID with the new data.
// It returns the updated task object.
func (r *RepoDB) UpdateTask(taskID int, newData *entity.TaskUpdate) error {
	updates := make(map[string]any)
	// set new title
	if newData.Title != nil {
		updates["title"] = *newData.Title
	}
	// set new desctiption
	if newData.Desc != nil {
		updates["description"] = newData.Desc
	}
	// update task
	err := r.dbStorage.Model(&entity.Task{}).
		Where(_fieldID+" = ?", taskID).
		Updates(updates).Error
	return err // err OR nil
}

// DeleteTaskByID deletes task by given id.
func (r *RepoDB) DeleteTaskByID(id int) error {
	return r.dbStorage.Delete(&entity.Task{}, id).Error
}

// GetTasks returns all teacher tasks.
// Search param appends condition to filter tasks by title (substring).
func (r *RepoDB) GetTasks(teacherID int, search string,
	page *entity.Pagination) ([]entity.Task, error) {

	var taskList []entity.Task
	query := r.dbStorage.Model(&entity.Task{}).
		Where("teacher_id = ?", teacherID)
	if search != "" {
		query = query.Where("title REGEXP ?", search)
	}
	query = query.Order(_orderByIDDESC)
	// apply pagination if it's not nil
	if page != nil {
		page.CountTotal(query)
		query = page.Query(query)
	}
	// exec query
	if err := query.Find(&taskList).Error; err != nil {
		return nil, err
	}
	return taskList, nil
}

// GetTaskStudents returns all students linked to the given task.
func (r *RepoDB) GetTaskStudents(taskID int) ([]entity.Profile, error) {
	profiles := make([]entity.Profile, 0)
	err := r.dbStorage.Model(entity.Profile{}).
		Select("profile.id", "profile.fullname").
		Joins("INNER JOIN user ON user.id = profile.id").
		Joins("INNER JOIN solution ON solution.student_id = profile.id").
		Joins("INNER JOIN task ON task.id = solution.task_id").
		Where("task.id = ?", taskID).Find(&profiles).Error
	return profiles, err // err OR nil
}
