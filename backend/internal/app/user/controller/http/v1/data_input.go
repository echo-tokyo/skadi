package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/pkg/validator"
)

// @description createUserBody represents a data to create a new user.
type createUserBody struct {
	// user username
	Username string `json:"username" validate:"required,max=50" example:"user1" maxLength:"50"`
	// user password
	Password string `json:"password" validate:"required,min=8,max=40" example:"qwerty123" minLength:"8" maxLength:"40"`
	// user role (teacher or student)
	Role string `json:"role" validate:"required,oneof=teacher student" example:"teacher"`
	// user profile
	Profile createProfileBody `json:"profile" validate:"required"`
}

// @description createProfileBody represents a data to create a new user profile.
type createProfileBody struct {
	// user full name
	FullName string `json:"fullname" validate:"required,max=150" example:"Иванов Василий Петрович" maxLength:"150"`
	// user address
	Address string `json:"address" validate:"required,max=255" example:"3-я ул.Строителей д. 25" maxLength:"255"`
	// extra data (for admin only)
	Extra string `json:"extra,omitempty" validate:"omitempty" example:"только для админов"`
	// user contact info
	Contact createContactBody `json:"contact" validate:"required"`
	// parent contact info (for students)
	ParentContact *createContactBody `json:"parent_contact,omitempty" validate:"omitempty"`
}

// @description createProfileBody represents a data to create a new profile contact.
type createContactBody struct {
	Phone string `json:"phone" validate:"required,max=15" example:"88005553535" maxLength:"15"`
	Email string `json:"email" validate:"required,max=50" example:"ivanovvp@gmail.com" maxLength:"50"`
}

// Parse parses createUserBody request data and validates it.
func (c *createUserBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse JSON-body
	if err := ctx.BodyParser(c); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(c); err != nil {
		return err
	}
	return nil
}

// @description userIDPath represents a data with user ID in path params.
type userIDPath struct {
	// user (and profile) id
	ID string `params:"id" validate:"required,numeric" example:"2"`
}

// Parse parses userIDPath request data and validates it.
func (u *userIDPath) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse JSON-body
	if err := ctx.ParamsParser(u); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(u); err != nil {
		return err
	}
	return nil
}
