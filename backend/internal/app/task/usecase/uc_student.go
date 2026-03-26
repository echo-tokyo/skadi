package usecase

import (
	"skadi/backend/config"
	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/task"
)

// Ensure UCStudent implements interfaces.
var _ task.UsecaseStudent = (*UCStudent)(nil)

// UCStudent represents a task usecase for student.
// It implements the task.UsecaseStudent interface.
type UCStudent struct {
	cfg        *config.Config
	taskRepoDB task.RepositoryDB
}

// NewUCStudent returns a new instance of UCStudent.
func NewUCStudent(cfg *config.Config, taskRepoDB task.RepositoryDB) *UCStudent {
	return &UCStudent{
		cfg:        cfg,
		taskRepoDB: taskRepoDB,
	}
}

// GetSolutions returns all student solutions.
// It returns checked solutions if archived is true.
func (u *UCStudent) GetSolutions(studID int, archived bool,
	page *entity.Pagination) ([]entity.Solution, error) {

	solList, err := u.taskRepoDB.GetStudentSolutions(studID, archived, page)
	return solList, err // err OR nil
}
