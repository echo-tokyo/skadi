package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/pkg/validator"
)

// @description authBody represents a data for user auth (log in).
type authBody struct {
	// user username
	Username string `json:"username" validate:"required,max=50" example:"user1" maxLength:"50"`
	// user password
	Password string `json:"password" validate:"required,min=8,max=40" example:"qwerty123" minLength:"8" maxLength:"40"`
}

// Parse parses auth body from JSON-body and validates it.
func (a *authBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse JSON-body
	if err := ctx.BodyParser(a); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(a); err != nil {
		return err
	}
	return nil
}
