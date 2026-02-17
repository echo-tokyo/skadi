// Package usecase contains class.UsecaseAdmin and class.UsecaseClient implementations.
package usecase

import (
	"fmt"
	"skadi/backend/config"
	"skadi/backend/internal/app/class"
	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/user"
)

const _roleStudent = "student" // student role for user
const _roleTeacher = "teacher" // teacher role for user

// Ensure UCAdmin implements interfaces.
var _ class.UsecaseAdmin = (*UCAdminClient)(nil)
var _ class.UsecaseClient = (*UCAdminClient)(nil)

// UCAdminClient represents a class usecase for admin and client.
// It implements the class.UsecaseAdmin and the class.UsecaseClient interfaces.
type UCAdminClient struct {
	cfg         *config.Config
	classRepoDB class.RepositoryDB
	userRepoDB  user.RepositoryDB
}

// NewUCAdminClient returns a new instance of UCAdminClient.
func NewUCAdminClient(cfg *config.Config, classRepoDB class.RepositoryDB,
	userRepoDB user.RepositoryDB) *UCAdminClient {

	return &UCAdminClient{
		cfg:         cfg,
		classRepoDB: classRepoDB,
		userRepoDB:  userRepoDB,
	}
}

// CreateClass creates a new class and fills given struct.
func (u *UCAdminClient) Create(classObj *entity.Class, studentIDs []int) (err error) {
	// get teacher object by ID
	if classObj.TeacherID != nil {
		teacherUser, err := u.userRepoDB.GetByIDWithProfileShort(*classObj.TeacherID)
		if err != nil {
			return fmt.Errorf("get teacher: %w", err)
		}
		if teacherUser.Role != _roleTeacher {
			return fmt.Errorf("user %d: not teacher", teacherUser.ID)
		}
		classObj.Teacher = teacherUser.Profile
	}

	// get user objects by IDs
	students, err := u.userRepoDB.GetManyWithProfilesShort(studentIDs)
	if err != nil {
		return fmt.Errorf("get students: %w", err)
	}
	// check students
	for idx := range students {
		if students[idx].Role != _roleStudent {
			return fmt.Errorf("user %d: not student", students[idx].ID)
		}
		if students[idx].ClassID != nil {
			return fmt.Errorf("student %d: already linked to class", students[idx].ID)
		}
	}

	// create class with students
	if err = u.classRepoDB.CreateClass(classObj, studentIDs); err != nil {
		return fmt.Errorf("create class: %w", err)
	}
	// collect student profiles
	classObj.Students = make([]entity.Profile, len(students))
	for idx := range students {
		classObj.Students[idx] = *students[idx].Profile
	}
	return nil
}

// GetByID returns a class object by given ID.
func (u *UCAdminClient) GetByID(id int) (*entity.Class, error) {
	// get class
	classObj, err := u.classRepoDB.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("get class: %w", err)
	}
	// get teacher object by ID
	if classObj.TeacherID != nil {
		teacherUser, err := u.userRepoDB.GetByIDWithProfileShort(*classObj.TeacherID)
		if err != nil {
			return nil, fmt.Errorf("get teacher: %w", err)
		}
		classObj.Teacher = teacherUser.Profile
	}
	// get students
	classObj.Students, err = u.userRepoDB.GetProfilesShortByClass(classObj.ID)
	return classObj, err // err OR nil
}

// Update updates old class data to new one (by data ID).
func (u *UCAdminClient) Update(data *entity.Class) error {
	// TODO: impement
	panic("unimplemented")
}

// DeleteByID deletes class object by given id.
func (u *UCAdminClient) DeleteByID(id int) error {
	return u.classRepoDB.DeleteByID(id)
}

// ListShort returns slice of class objects (IDs and names only).
func (u *UCAdminClient) ListShort() ([]entity.Class, error) {
	return u.classRepoDB.ListShort()
}

// ListFull returns slice of class objects with full data.
func (u *UCAdminClient) ListFull(page *entity.Pagination) ([]entity.Class, error) {
	return u.classRepoDB.ListFull(page)
}

// // addFreeStudsToClass adds class-free students
// // from the given students list to the given class.
// func (u *UCAdminClient) addFreeStudsToClass(classID int,
// 	studentIDs []int) (added []entity.Profile, withErrs []entity.User, err error) {

// 	// get user objects by IDs
// 	rawStudents, err := u.userRepoDB.GetManyWithProfilesShort(studentIDs)
// 	if err != nil {
// 		return nil, nil, fmt.Errorf("get students: %w", err)
// 	}

// 	// add to students list only class-free student users
// 	classFreeStuds := make([]entity.User, 0)
// 	for idx := range rawStudents {
// 		if rawStudents[idx].Role != _roleStudent {
// 			withErrs = append(withErrs, rawStudents[idx])
// 			continue
// 		}
// 		if rawStudents[idx].ClassID != nil {
// 			withErrs = append(withErrs, rawStudents[idx])
// 			continue
// 		}
// 		classFreeStuds = append(classFreeStuds, rawStudents[idx])
// 	}

// 	// add students to class
// 	failedStuds, err := u.userRepoDB.SetClass(classID, classFreeStuds)
// 	if err != nil {
// 		return nil, classFreeStuds, nil
// 	}
// 	withErrs = append(withErrs, failedStuds...)

// 	// collect failed student IDs
// 	toRemove := make(map[int]bool, len(failedStuds))
// 	for idx := range failedStuds {
// 		toRemove[failedStuds[idx].ID] = true
// 	}

// 	addedStudents := make([]entity.Profile, 0, len(classFreeStuds)-len(failedStuds))
// 	for idx := range classFreeStuds {
// 		if toRemove[classFreeStuds[idx].ID] {
// 			continue
// 		}
// 		addedStudents = append(addedStudents, *classFreeStuds[idx].Profile)
// 	}
// 	return addedStudents, withErrs, nil
// }
