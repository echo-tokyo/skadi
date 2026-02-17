package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/pkg/validator"
)

// @description listClassQuery represents a data with optional query-params to get classes list.
type listClassQuery struct {
	// page pagination param
	Page int `query:"page,omitempty" validate:"omitempty,numeric,min=1" example:"1" min:"1"`
	// per page pagination param (default: 10)
	PerPage int `query:"per-page,omitempty" validate:"omitempty,numeric,min=1" example:"1" min:"1" default:"10"`
}

// Parse parses listClassQuery request data and validates it.
func (u *listClassQuery) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
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
