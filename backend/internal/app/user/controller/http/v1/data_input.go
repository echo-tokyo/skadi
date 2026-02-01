package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/pkg/validator"
)

// @description updatePasswordBody represents a data to update user password by the user himself.
type updatePasswordBody struct {
	// old user password
	OldPasswd string `json:"old" validate:"required,min=8,max=40" example:"qwerty123" minLength:"8" maxLength:"40"`
	// new user password
	NewPasswd string `json:"new" validate:"required,min=8,max=40" example:"ytrewq321" minLength:"8" maxLength:"40"`
}

// Parse parses updatePasswordBody request data and validates it.
func (u *updatePasswordBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
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
