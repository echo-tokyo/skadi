package v1

import (
	"skadi/backend/internal/app/entity"
)

// @description solutionIDPath represents a data with solution ID in path params.
type solutionIDPath struct {
	// solution id
	ID int `params:"id" validate:"required" example:"2"`
}

// @description updateSolutionBody represents a data with optional body to update solution.
type updateSolutionBody struct {
	// new status ID (student and teacher)
	StatusID *int `json:"status_id,omitempty" validate:"omitempty" example:"2"`
	// new grade (teacher only)
	Grade *string `json:"grade,omitempty" validate:"omitempty,max=5" example:"5+" maxLength:"50"`
	// new answer (student only)
	Answer *string `json:"answer,omitempty" validate:"omitempty" example:"ООП - это объектно-ориентированное программирование"`
}

// @description listSolutionTeacherQuery represents a data with
// optional query-params to get solutions list for a teacher tasks.
type listSolutionTeacherQuery struct {
	// status filter
	StatusID int `query:"status_id,omitempty" json:"status_id" validate:"omitempty,oneof=1 2 3 4" example:"2"`
	// substring to filter data by task title or student fullname (case-insensitive)
	Search string `query:"search,omitempty" json:"search" example:"HTML"`
	// pagination params
	entity.PaginationQuery
}

// @description listSolutionStudentQuery represents a data with
// optional query-params to get solutions list for a student.
type listSolutionStudentQuery struct {
	// status filter
	StatusID int `query:"status_id,omitempty" json:"status_id" validate:"omitempty,oneof=1 2 3 4" example:"2"`
	// pagination params
	entity.PaginationQuery
}
