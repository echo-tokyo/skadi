package v1

import (
	"skadi/backend/internal/app/entity"
)

// @description taskBody represents a data with task.
type taskBody struct {
	// task title
	Title string `json:"title" validate:"required,max=100" example:"ООП в Python" maxLength:"100"`
	// task description
	Desc string `json:"description" validate:"required" example:"ООП в Python - это ..."`
	// classes for task solutions
	ClassIDs []int `json:"classes,omitempty" validate:"omitempty" example:"3,6,9"`
	// students for task solutions
	StudentIDs []int `json:"students,omitempty" validate:"omitempty" example:"22,32,14"`
}

// @description taskIDPath represents a data with task ID in path params.
type taskIDPath struct {
	// task id
	ID int `params:"id" validate:"required" example:"2"`
}

// @description solutionIDPath represents a data with solution ID in path params.
type solutionIDPath struct {
	// solution id
	ID int `params:"id" validate:"required" example:"2"`
}

// @description listTaskQuery represents a data with optional query-params to get tasks list.
type listTaskQuery struct {
	// substring to filter data by substring (case-insensitive)
	Search string `query:"search,omitempty" json:"search" example:"F26"`
	// pagination params
	*entity.PaginationQuery
}

// @description listSolutionTeacherQuery represents a data with
// optional query-params to get solutions list for a teacher tasks.
type listSolutionTeacherQuery struct {
	// filter for checked solutions if true
	Archived bool `query:"archived,omitempty" json:"archived" example:"true"`
	// substring to filter data by substring (case-insensitive)
	Search string `query:"search,omitempty" json:"search" example:"F26"`
	// pagination params
	*entity.PaginationQuery
}

// @description listSolutionStudentQuery represents a data with
// optional query-params to get solutions list for a student.
type listSolutionStudentQuery struct {
	// filter for checked solutions if true
	Archived bool `query:"archived,omitempty" json:"archived" example:"true"`
	// pagination params
	*entity.PaginationQuery
}
