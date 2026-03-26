package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/pkg/validator"
)

// @description listClassQuery represents a data with optional query-params to get classes list.
type listClassQuery struct {
	// substring to filter classes by name (case-insensitive)
	Search string `query:"search,omitempty" json:"search" example:"F26"`
	// pagination params
	*entity.PaginationQuery
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
