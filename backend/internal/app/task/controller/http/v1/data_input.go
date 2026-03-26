package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/pkg/validator"
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

// Parse parses taskBody request data and validates it.
func (u *taskBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse JSON-body
	if err := ctx.BodyParser(u); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(u); err != nil {
		return err
	}
	return nil
}

// @description solutionIDPath represents a data with solution ID in path params.
type solutionIDPath struct {
	// solution id
	ID int `params:"id" validate:"required" example:"2"`
}

// Parse parses solutionIDPath request data and validates it.
func (u *solutionIDPath) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse path-params
	if err := ctx.ParamsParser(u); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(u); err != nil {
		return err
	}
	return nil
}

// @description taskIDPath represents a data with task ID in path params.
type taskIDPath struct {
	// task id
	ID int `params:"id" validate:"required" example:"2"`
}

// Parse parses taskIDPath request data and validates it.
func (u *taskIDPath) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse path-params
	if err := ctx.ParamsParser(u); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(u); err != nil {
		return err
	}
	return nil
}

// @description listTaskQuery represents a data with optional query-params to get tasks list.
type listTaskQuery struct {
	// substring to filter data by substring (case-insensitive)
	Search string `query:"search,omitempty" json:"search" example:"F26"`
	// pagination params
	*entity.PaginationQuery
}

// Parse parses listTaskQuery request data and validates it.
func (u *listTaskQuery) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse query-params
	if err := ctx.QueryParser(u); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(u); err != nil {
		return err
	}
	return nil
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

// Parse parses listSolutionTeacherQuery request data and validates it.
func (u *listSolutionTeacherQuery) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse query-params
	if err := ctx.QueryParser(u); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(u); err != nil {
		return err
	}
	return nil
}

// @description listSolutionStudentQuery represents a data with
// optional query-params to get solutions list for a student.
type listSolutionStudentQuery struct {
	// filter for checked solutions if true
	Archived bool `query:"archived,omitempty" json:"archived" example:"true"`
	// pagination params
	*entity.PaginationQuery
}

// Parse parses listSolutionStudentQuery request data and validates it.
func (u *listSolutionStudentQuery) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse query-params
	if err := ctx.QueryParser(u); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(u); err != nil {
		return err
	}
	return nil
}
