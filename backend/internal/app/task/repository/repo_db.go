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

	_defaultStatusID  = 1 // ID of default solution status "backlog"
	_archivedStatusID = 4 // ID of archived solution status "checked"
)

// Ensure RepoDB implements interface.
var _ task.RepositoryDB = (*RepoDB)(nil)

// RepoDB is a task DB repo.
// It implements the task.RepositoryDB interface.
type RepoDB struct {
	dbStorage *gorm.DB
}

// NewRepoDB returns a new instance of RepoDB.
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

// GetSolutionByID returns solution info (with task only) by the given ID.
func (r *RepoDB) GetSolutionByID(id int) (*entity.Solution, error) {
	var solObj entity.Solution
	err := r.dbStorage.
		Preload(_preloadTask).
		Where(id).First(&solObj).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// solution object with such id not found
		return nil, fmt.Errorf("solution with id: %w", task.ErrNotFound)
	}
	return &solObj, err // err OR nil
}

// GetSolutionByIDFull returns a full solution info by the given ID.
func (r *RepoDB) GetSolutionByIDFull(id int) (*entity.Solution, error) {
	var solObj entity.Solution
	err := r.dbStorage.
		Preload(_preloadTask).
		Preload(_preloadTeacher).
		Preload(_preloadTeacherProfile, func(db *gorm.DB) *gorm.DB {
			return db.Select(_fieldID, _fieldFullname) // preload only ID and fullname
		}).
		Preload(_preloadStudent).
		Preload(_preloadStudentProfile, func(db *gorm.DB) *gorm.DB {
			return db.Select(_fieldID, _fieldFullname) // preload only ID and fullname
		}).
		Preload(_preloadStatus).
		Where(id).First(&solObj).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// solution object with such id not found
		return nil, fmt.Errorf("solution with id: %w: %s", task.ErrNotFound, err.Error())
	}
	return &solObj, err // err OR nil
}

// UpdateTask updates the given task.
func (r *RepoDB) UpdateTask(taskObj *entity.Task) error {
	panic("unimplemented")
}

// UpdateSolution updates the given solution.
func (r *RepoDB) UpdateSolution(solution *entity.Solution) error {
	panic("unimplemented")
}

// DeleteTaskByID deletes task by given id.
func (r *RepoDB) DeleteTaskByID(id int) error {
	return r.dbStorage.Delete(&entity.Task{}, id).Error
}

// DeleteSolutionByID deletes solution by given id.
func (r *RepoDB) DeleteSolutionByID(id int) error {
	return r.dbStorage.Delete(&entity.Solution{}, id).Error
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
	query = query.Order("id DESC")
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

// GetTeacherSolutions returns all solutions for the teacher tasks.
// Search param appends condition to filter solutions by task title (substring).
// It returns checked solutions if archived is true.
func (r *RepoDB) GetTeacherSolutions(teacherID int, search string, archived bool,
	page *entity.Pagination) ([]entity.Solution, error) {

	solList := make([]entity.Solution, 0)
	query := r.dbStorage.Model(entity.Solution{}).
		Omit("grade", "answer", "updated_at").
		Preload(_preloadTask, func(db *gorm.DB) *gorm.DB {
			return db.Select(_fieldID, _fieldTitle) // preload only ID and title
		}).
		Preload(_preloadStudent).
		Preload(_preloadStudentProfile, func(db *gorm.DB) *gorm.DB {
			return db.Select(_fieldID, _fieldFullname) // preload only ID and fullname
		}).
		Preload(_preloadStatus).
		Joins("INNER JOIN task ON task.id = solution.task_id").
		Where("task.teacher_id = ?", teacherID)
	// select only checked solutions or all solutions apart of checked ones
	if archived {
		query = query.Where("status_id = ?", _archivedStatusID)
	} else {
		query = query.Where("status_id <> ?", _archivedStatusID)
	}
	if search != "" {
		query = query.Where("title REGEXP ?", search)
	}
	query = query.Order("id DESC")
	// apply pagination if it's not nil
	if page != nil {
		page.CountTotal(query)
		query = page.Query(query)
	}
	// exec query
	if err := query.Find(&solList).Error; err != nil {
		return nil, err
	}
	return solList, nil
}

// GetStudentSolutions returns all student solutions.
// It returns checked solutions if archived is true.
func (r *RepoDB) GetStudentSolutions(studID int, archived bool,
	page *entity.Pagination) ([]entity.Solution, error) {

	solList := make([]entity.Solution, 0)
	query := r.dbStorage.Model(entity.Solution{}).
		Omit("grade", "answer", "student_id").
		Preload(_preloadTask, func(db *gorm.DB) *gorm.DB {
			return db.Select(_fieldID, _fieldTitle, _fieldDesc) // preload only ID, title and desc
		}).
		Preload(_preloadStatus).
		Where("student_id = ?", studID)
	// select only checked solutions or all solutions apart of checked ones
	if archived {
		query = query.Where("status_id = ?", _archivedStatusID)
	} else {
		query = query.Where("status_id <> ?", _archivedStatusID)
	}
	query = query.Order("id DESC")
	// apply pagination if it's not nil
	if page != nil {
		page.CountTotal(query)
		query = page.Query(query)
	}
	// exec query
	if err := query.Find(&solList).Error; err != nil {
		return nil, err
	}
	return solList, nil
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
