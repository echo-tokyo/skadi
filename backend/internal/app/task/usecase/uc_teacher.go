package usecase

import (
	"errors"
	"fmt"

	"skadi/backend/config"
	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/status"
	"skadi/backend/internal/app/task"
	"skadi/backend/internal/app/user"
	"skadi/backend/internal/pkg/utils/slices"
)

const (
	_defaultStatusID  = 1 // ID of solution status "backlog"
	_inWorkStatusID   = 2 // ID of solution status "in-work"
	_readyStatusID    = 3 // ID of solution status "ready"
	_archivedStatusID = 4 // ID of solution status "checked"
)

// Ensure UCAdmin implements interfaces.
var _ task.UsecaseTeacher = (*UCTeacher)(nil)

// UCTeacher represents a task usecase for teacher.
// It implements the [task.UsecaseTeacher] interface.
type UCTeacher struct {
	cfg          *config.Config
	taskRepoDB   task.RepositoryDB
	statusRepoDB status.RepositoryDB
	userRepoDB   user.RepositoryDB
}

// NewUCTeacher returns a new instance of [UCTeacher].
func NewUCTeacher(cfg *config.Config, taskRepoDB task.RepositoryDB,
	statusRepoDB status.RepositoryDB, userRepoDB user.RepositoryDB) *UCTeacher {

	return &UCTeacher{
		cfg:          cfg,
		taskRepoDB:   taskRepoDB,
		statusRepoDB: statusRepoDB,
		userRepoDB:   userRepoDB,
	}
}

// CreateTaskWithSolutions creates a new task and solutions
// for all given students and for all students linked to the given classes.
func (u *UCTeacher) CreateTaskWithSolutions(taskObj *entity.Task,
	studentIDs []int, classIDs []int) ([]entity.Solution, error) {

	teacher, err := u.userRepoDB.GetByIDWithProfileShort(taskObj.TeacherID)
	if err != nil {
		return nil, fmt.Errorf("get teacher: %w", err)
	}
	if !teacher.IsTeacher() {
		return nil, fmt.Errorf("%w: user %d: not teacher", task.ErrInvalidTeacher, teacher.ID)
	}

	// get all users by student IDs
	studentUsers, err := u.userRepoDB.GetManyWithProfilesShort(studentIDs)
	if err != nil {
		return nil, fmt.Errorf("get students by ids: %w", err)
	}
	studentProfiles := make([]entity.Profile, 0, len(studentUsers))
	// check user roles
	for idx := range studentUsers {
		if !studentUsers[idx].IsStudent() {
			return nil, fmt.Errorf("%w: user %d: not student",
				task.ErrInvalidStudent, studentUsers[idx].ID)
		}
		studentProfiles = append(studentProfiles, *studentUsers[idx].Profile)
	}

	var classStudents []entity.Profile
	// get all students by class IDs
	for _, classID := range classIDs {
		classStudents, err = u.userRepoDB.GetProfilesShortByClass(classID)
		if err != nil {
			return nil, fmt.Errorf("get students: class %d: %w", classID, err)
		}
		studentProfiles = append(studentProfiles, classStudents...)
	}
	// delete duplicated students
	studentProfiles = slices.DelDuplsFunc(studentProfiles, func(p entity.Profile) int {
		return *p.ID
	})

	// set teacher profile
	taskObj.TeacherUser = teacher
	taskObj.Teacher = teacher.Profile
	// create task and solutions for all collected students
	solutions, err := u.taskRepoDB.CreateTaskForStudents(taskObj, studentProfiles)
	if err != nil {
		return nil, fmt.Errorf("create task for students: %w", err)
	}
	return solutions, nil
}

// GetTaskByID returns a task object by the given id and
// a list of students linked to the task solutions.
func (u *UCTeacher) GetTaskByID(teacherID, taskID int) (*entity.Task, []entity.Profile, error) {
	// TODO: implement
	panic("unimplemented")
}

// UpdateTask updates the given task by given ID with the new data.
// It returns the updated task object.
// Allows to update the title, desc and task files.
func (u *UCTeacher) UpdateTask(teacherID, taskID int,
	newData *entity.TaskUpdate) (*entity.Task, error) {

	taskObj, err := u.taskRepoDB.GetTaskByID(taskID)
	if err != nil {
		return nil, fmt.Errorf("get task: %w", err)
	}
	if teacherID != taskObj.TeacherID {
		return nil, fmt.Errorf("%w: user is not a task owner", task.ErrForbidden)
	}

	if err := u.taskRepoDB.UpdateTask(taskID, newData); err != nil {
		return nil, fmt.Errorf("update: %w", err)
	}

	if newData.Title != nil {
		taskObj.Title = *newData.Title
	}
	if newData.Desc != nil {
		taskObj.Desc = *newData.Desc
	}
	return taskObj, nil
}

// UpdateSolution updates the given solution by given ID with the new data.
// It returns the updated solution object.
// Allows to update the grade and status (only ready and archived).
func (u *UCTeacher) UpdateSolution(teacherID, solutionID int,
	newData *entity.SolutionUpdate) (*entity.Solution, error) {

	solObj, err := u.taskRepoDB.GetSolutionByIDFull(solutionID)
	if err != nil {
		return nil, fmt.Errorf("get task: %w", err)
	}
	if teacherID != solObj.Task.TeacherID {
		return nil, fmt.Errorf("%w: user is not a solution task owner", task.ErrForbidden)
	}

	newData.Answer = nil
	if newData.StatusID != nil {
		if err := u.getStatusToUpdate(solObj, *newData.StatusID); err != nil {
			return nil, err
		}
	}
	if newData.Grade != nil {
		solObj.Grade = newData.Grade
	}

	if err := u.taskRepoDB.UpdateSolution(solutionID, newData); err != nil {
		return nil, fmt.Errorf("update: %w", err)
	}
	solObj.UpdatedAt = newData.UpdatedAt
	return solObj, nil
}

// DeleteTaskByID deletes task object by given ID.
func (u *UCTeacher) DeleteTaskByID(userID, taskID int) error {
	// get task info
	taskObj, err := u.taskRepoDB.GetTaskByID(taskID)
	// return nil error if task was not found
	if errors.Is(err, task.ErrNotFound) {
		return nil
	}
	if err != nil {
		return err
	}
	// check that given user (teacher) is a task owner
	if userID != taskObj.TeacherID {
		return fmt.Errorf("%w: user (teacher) is not a task owner", task.ErrForbidden)
	}
	// delete task
	return u.taskRepoDB.DeleteTaskByID(taskID)
}

// DeleteSolutionByID deletes solution object by given ID.
func (u *UCTeacher) DeleteSolutionByID(userID, solutionID int) error {
	// get short solution info
	solObj, err := u.taskRepoDB.GetSolutionByID(solutionID)
	// return nil error if solution was not found
	if errors.Is(err, task.ErrNotFound) {
		return nil
	}
	if err != nil {
		return err
	}
	// check that given user (teacher) is a solution task owner
	if userID != solObj.Task.TeacherID {
		return fmt.Errorf("%w: user (teacher) is not a solution task owner", task.ErrForbidden)
	}
	// delete solution
	return u.taskRepoDB.DeleteSolutionByID(solutionID)
}

// GetTasks returns all teacher tasks.
// Search param appends condition to filter tasks by title (substring).
func (u *UCTeacher) GetTasks(teacherID int, search string,
	page *entity.Pagination) ([]entity.Task, error) {

	return u.taskRepoDB.GetTasks(teacherID, search, page)
}

// GetSolutions returns all solutions for the teacher tasks.
// Search param appends condition to filter solutions by task title (substring).
// It returns checked solutions if archived is true.
func (u *UCTeacher) GetSolutions(teacherID int, search string, archived bool,
	page *entity.Pagination) ([]entity.Solution, error) {

	solList, err := u.taskRepoDB.GetTeacherSolutions(teacherID, search, archived, page)
	if err != nil {
		return nil, err
	}
	// set student field for each solution to serialize it
	for idx := range solList {
		solList[idx].Student = solList[idx].StudentUser.Profile
	}
	return solList, nil
}

// getStatusToUpdate sets the new status object to updated solution.
func (u *UCTeacher) getStatusToUpdate(solObj *entity.Solution, newStatusID int) error {
	solObj.StatusID = newStatusID
	// only ready and archived statuses
	if newStatusID != _readyStatusID && newStatusID != _archivedStatusID {
		return fmt.Errorf("%w: teacher cannot set the given status", task.ErrInvalidData)
	}
	// get status object
	var err error
	solObj.Status, err = u.statusRepoDB.GetByID(newStatusID)
	// if status object with such id not found
	if errors.Is(err, task.ErrNotFound) {
		return fmt.Errorf("%w: status: %s", task.ErrInvalidData, err.Error())
	}
	if err != nil {
		return fmt.Errorf("get status: %w", err)
	}
	return nil
}
