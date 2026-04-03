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
	// new status ID
	StatusID *int `json:"status_id,omitempty" validate:"omitempty" example:"2"`
	// new grade
	Grade *string `json:"grade,omitempty" validate:"omitempty,max=5" example:"5+" maxLength:"50"`
	// new answer
	Answer *string `json:"answer,omitempty" validate:"omitempty" example:"ООП - это объектно-ориентированное программирование"`
}

// @description listSolutionTeacherQuery represents a data with
// optional query-params to get solutions list for a teacher tasks.
type listSolutionTeacherQuery struct {
	// filter for checked solutions if true
	Archived bool `query:"archived,omitempty" json:"archived" example:"true"`
	// substring to filter data by substring (case-insensitive)
	Search string `query:"search,omitempty" json:"search" example:"F26"`
	// pagination params
	entity.PaginationQuery
}

// @description listSolutionStudentQuery represents a data with
// optional query-params to get solutions list for a student.
type listSolutionStudentQuery struct {
	// filter for checked solutions if true
	Archived bool `query:"archived,omitempty" json:"archived" example:"true"`
	// pagination params
	entity.PaginationQuery
}
