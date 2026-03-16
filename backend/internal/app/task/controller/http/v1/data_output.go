package v1

import (
	"skadi/backend/internal/app/entity"
)

// @description taskOut represents a task data with solutions.
type taskOut struct {
	// task object
	Task *entity.Task `json:"task" validate:"required"`
	// task solutions
	Solutions []entity.Solution `json:"solutions,omitempty" validate:"omitempty"`
}

// @description solutionOut represents a solution data with students (solving the same task).
type solutionOut struct {
	// solution object
	Solution *entity.Solution `json:"solutions" validate:"required"`
	// other students solving the same task
	OtherStudents []entity.Profile `json:"other_students,omitempty" validate:"omitempty"`
}
