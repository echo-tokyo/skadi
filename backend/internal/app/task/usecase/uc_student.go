package usecase

// import (
// 	"errors"
// 	"fmt"
// 	"skadi/backend/config"
// 	"skadi/backend/internal/app/entity"
// 	"skadi/backend/internal/app/status"
// 	"skadi/backend/internal/app/task"
// )

// // Ensure UCStudent implements interfaces.
// var _ task.UsecaseStudent = (*UCStudent)(nil)

// // UCStudent represents a task usecase for student.
// // It implements the [task.UsecaseStudent] interface.
// type UCStudent struct {
// 	cfg          *config.Config
// 	taskRepoDB   task.RepositoryDB
// 	statusRepoDB status.RepositoryDB
// }

// // NewUCStudent returns a new instance of [UCStudent].
// func NewUCStudent(cfg *config.Config, taskRepoDB task.RepositoryDB,
// 	statusRepoDB status.RepositoryDB) *UCStudent {

// 	return &UCStudent{
// 		cfg:          cfg,
// 		taskRepoDB:   taskRepoDB,
// 		statusRepoDB: statusRepoDB,
// 	}
// }

// // GetSolutions returns all student solutions.
// // It returns checked solutions if archived is true.
// func (u *UCStudent) GetSolutions(studID int, archived bool,
// 	page *entity.Pagination) ([]entity.Solution, error) {

// 	return u.taskRepoDB.GetStudentSolutions(studID, archived, page)
// }

// // UpdateSolution updates the given solution by given ID with the new data.
// // It returns the updated solution object.
// // Allows to update the status (apart of archived), answer and solution files.
// func (u *UCStudent) UpdateSolution(studID, solutionID int,
// 	newData *entity.SolutionUpdate) (*entity.Solution, error) {

// 	solObj, err := u.taskRepoDB.GetSolutionByIDFull(solutionID)
// 	if err != nil {
// 		return nil, fmt.Errorf("get task: %w", err)
// 	}
// 	if studID != solObj.StudentID {
// 		return nil, fmt.Errorf("%w: user (student) is not a solution owner", task.ErrForbidden)
// 	}

// 	newData.Grade = nil
// 	if newData.StatusID != nil {
// 		if err := u.getStatusToUpdate(solObj, *newData.StatusID); err != nil {
// 			return nil, err
// 		}
// 	}
// 	if newData.Answer != nil {
// 		solObj.Answer = newData.Answer
// 	}

// 	if err := u.taskRepoDB.UpdateSolution(solutionID, newData); err != nil {
// 		return nil, fmt.Errorf("update: %w", err)
// 	}
// 	solObj.UpdatedAt = newData.UpdatedAt
// 	return solObj, nil
// }

// // getStatusToUpdate sets the new status object to updated solution.
// func (u *UCStudent) getStatusToUpdate(solObj *entity.Solution, newStatusID int) error {
// 	solObj.StatusID = newStatusID
// 	// apart of archived statuses
// 	if newStatusID == _archivedStatusID {
// 		return fmt.Errorf("%w: student cannot set the given status", task.ErrInvalidData)
// 	}
// 	// get status object
// 	var err error
// 	solObj.Status, err = u.statusRepoDB.GetByID(newStatusID)
// 	// if status object with such id not found
// 	if errors.Is(err, task.ErrNotFound) {
// 		return fmt.Errorf("%w: status: %s", task.ErrInvalidData, err.Error())
// 	}
// 	if err != nil {
// 		return fmt.Errorf("get status: %w", err)
// 	}
// 	return nil
// }
