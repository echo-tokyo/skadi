package usecase

// import (
// 	"fmt"

// 	"skadi/backend/config"
// 	"skadi/backend/internal/app/entity"
// 	"skadi/backend/internal/app/task"
// )

// // Ensure UCClient implements interfaces.
// var _ task.UsecaseClient = (*UCClient)(nil)

// // UCClient represents a task usecase for client.
// // It implements the [task.UsecaseClient] interface.
// type UCClient struct {
// 	cfg        *config.Config
// 	taskRepoDB task.RepositoryDB
// }

// // NewUCClient returns a new instance of [UCClient].
// func NewUCClient(cfg *config.Config, taskRepoDB task.RepositoryDB) *UCClient {
// 	return &UCClient{
// 		cfg:        cfg,
// 		taskRepoDB: taskRepoDB,
// 	}
// }

// // GetByID returns a full solution info and all students linked to the solution task.
// func (u *UCClient) GetByIDFull(solutionID int,
// 	userClaims *entity.UserClaims) (*entity.Solution, []entity.Profile, error) {

// 	solution, err := u.taskRepoDB.GetSolutionByIDFull(solutionID)
// 	if err != nil {
// 		return nil, nil, fmt.Errorf("get solution: %w", err)
// 	}

// 	// role checks
// 	if userClaims.IsTeacher() && solution.Task.TeacherID != userClaims.ID {
// 		return nil, nil, fmt.Errorf("%w: user (teacher) is not a task owner", task.ErrForbidden)
// 	}
// 	if userClaims.IsStudent() && solution.StudentID != userClaims.ID {
// 		return nil, nil, fmt.Errorf("%w: user (stud) is not a solution owner", task.ErrForbidden)
// 	}

// 	studProfiles, err := u.taskRepoDB.GetTaskStudents(solution.TaskID)
// 	if err != nil {
// 		return nil, nil, fmt.Errorf("get task students: %w", err)
// 	}
// 	return solution, studProfiles, nil
// }
