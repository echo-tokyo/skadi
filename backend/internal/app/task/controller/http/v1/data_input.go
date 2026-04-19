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

// @description updateTaskBody represents a data with optional body to update task.
type updateTaskBody struct {
	// new task title
	Title *string `json:"title,omitempty" validate:"omitempty,max=100" example:"Понятие ООП" maxLength:"100"`
	// new task description
	Desc *string `json:"description,omitempty" validate:"omitempty" example:"Что такое ООП? Перечислить принципы ООП"`
	// IDs of students (updated list) for the task
	Students []int `json:"students,omitempty" validate:"omitempty"`
}

// @description listTaskQuery represents a data with optional query-params to get tasks list.
type listTaskQuery struct {
	// substring to filter data by substring (case-insensitive)
	Search string `query:"search,omitempty" json:"search" example:"F26"`
	// pagination params
	entity.PaginationQuery
}
