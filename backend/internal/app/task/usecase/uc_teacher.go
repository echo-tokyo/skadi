package usecase

import (
	"errors"
	"fmt"

	"skadi/backend/config"
	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/task"
	"skadi/backend/internal/app/user"
	"skadi/backend/internal/pkg/roles"
	"skadi/backend/internal/pkg/utils/slices"
)

// Ensure UCAdmin implements interfaces.
var _ task.UsecaseTeacher = (*UCTeacher)(nil)

// UCTeacher represents a task usecase for teacher.
// It implements the task.UsecaseTeacher interface.
type UCTeacher struct {
	cfg        *config.Config
	taskRepoDB task.RepositoryDB
	userRepoDB user.RepositoryDB
}

// NewUCTeacher returns a new instance of UCTeacher.
func NewUCTeacher(cfg *config.Config, taskRepoDB task.RepositoryDB,
	userRepoDB user.RepositoryDB) *UCTeacher {

	return &UCTeacher{
		cfg:        cfg,
		taskRepoDB: taskRepoDB,
		userRepoDB: userRepoDB,
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
	if !roles.IsTeacher(teacher) {
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
		if !roles.IsStudent(&studentUsers[idx]) {
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
