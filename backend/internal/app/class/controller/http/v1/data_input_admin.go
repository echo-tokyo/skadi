package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/pkg/utils/slices"
	"skadi/backend/internal/pkg/validator"
)

// @description classBody represents a data with class.
type classBody struct {
	// class name
	Name string `json:"name" validate:"required,max=50" example:"B26-1" maxLength:"50"`
	// teacher id
	TeacherID *int `json:"teacher_id,omitempty" validate:"omitempty,numeric" example:"2"`
	// class schedule
	Schedule *string `json:"schedule,omitempty" validate:"omitempty,max=100" example:"сб 18:00-19:00" maxLength:"100"`
	// student ID list
	StudentIDs []int `json:"students,omitempty" validate:"omitempty"`
}

// Parse parses classBody request data and validates it.
func (u *classBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
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

// @description classIDPath represents a data with class ID in path params.
type classIDPath struct {
	// class id
	ID int `params:"id" validate:"required,numeric" example:"2"`
}

// Parse parses classIDPath request data and validates it.
func (u *classIDPath) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
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

// @description updateBody represents a data to update class.
type updateBody struct {
	// new class name
	Name *string `json:"name,omitempty" validate:"omitempty,max=50" example:"F26-2" maxLength:"50"`
	// new teacher id
	TeacherID *int `json:"teacher_id,omitempty" validate:"omitempty,numeric" example:"5"`
	// new class schedule
	Schedule *string `json:"schedule,omitempty" validate:"omitempty,max=100" example:"пн 15:00-16:00" maxLength:"100"`
	// IDs of students (updated list) in the class
	Students []int `json:"students,omitempty" validate:"omitempty"`
}

// Parse parses updateBody request data and validates it.
func (u *updateBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse JSON-body
	if err := ctx.BodyParser(u); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(u); err != nil {
		return err
	}
	// delete duplicates from students list
	u.Students = slices.DelDupls(u.Students)
	return nil
}
