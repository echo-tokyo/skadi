package v1

import (
	"fmt"
	"slices"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/pkg/validator"
)

// _acceptedRoles contains accepted roles for listUserQuery
var _acceptedRoles = []string{"teacher", "student"}

// @description userBody represents a data with user.
type userBody struct {
	// user username
	Username string `json:"username" validate:"required,max=50" example:"user1" maxLength:"50"`
	// user password
	Password string `json:"password" validate:"required,min=8,max=40" example:"qwerty123" minLength:"8" maxLength:"40"`
	// user role (teacher or student)
	Role string `json:"role" validate:"required,oneof=teacher student" example:"teacher"`
	// user profile
	Profile profileBody `json:"profile" validate:"required"`
}

// @description profileBody represents a data with user profile.
type profileBody struct {
	// user full name
	FullName string `json:"fullname" validate:"required,max=150" example:"Иванов Василий Петрович" maxLength:"150"`
	// user address
	Address string `json:"address" validate:"required,max=255" example:"3-я ул.Строителей д. 25" maxLength:"255"`
	// extra data (for admin only)
	Extra *string `json:"extra,omitempty" validate:"omitempty" example:"только для админов"`
	// user contact info
	Contact contactBody `json:"contact" validate:"required"`
	// parent contact info (for students)
	ParentContact *contactBody `json:"parent_contact,omitempty" validate:"omitempty"`
}

// @description contactBody represents a data with profile contact.
type contactBody struct {
	Phone string `json:"phone" validate:"required,max=15" example:"88005553535" maxLength:"15"`
	Email string `json:"email" validate:"required,email,max=50" example:"ivanovvp@gmail.com" maxLength:"50"`
}

// Parse parses userBody request data and validates it.
func (u *userBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
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

// Parse parses profileBody request data and validates it.
func (p *profileBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
	// parse JSON-body
	if err := ctx.BodyParser(p); err != nil {
		return err
	}
	// validate parsed data
	if err := valid.Validate(p); err != nil {
		return err
	}
	return nil
}

// @description userIDPath represents a data with user ID in path params.
type userIDPath struct {
	// user (and profile) id
	ID int `params:"id" validate:"required,numeric" example:"2"`
}

// Parse parses userIDPath request data and validates it.
func (u *userIDPath) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
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

// // @description updateProfileBody represents a data to update user profile.
// type updateProfileBody struct {
// 	// user full name
// 	FullName *string `json:"fullname,omitempty" validate:"omitempty,max=150" example:"Иванов Василий Петрович" maxLength:"150"`
// 	// user address
// 	Address *string `json:"address,omitempty" validate:"omitempty,max=255" example:"3-я ул.Строителей д. 25" maxLength:"255"`
// 	// extra data (for admin only)
// 	Extra *string `json:"extra,omitempty" validate:"omitempty" example:"только для админов"`
// 	// user contact info
// 	Contact *contactBody `json:"contact,omitempty" validate:"omitempty"`
// 	// parent contact info (for students)
// 	ParentContact *contactBody `json:"parent_contact,omitempty" validate:"omitempty"`
// }

// // Parse parses updateProfileBody request data and validates it.
// func (u *updateProfileBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
// 	// parse JSON-body
// 	if err := ctx.BodyParser(u); err != nil {
// 		return err
// 	}
// 	// validate parsed data
// 	if err := valid.Validate(u); err != nil {
// 		return err
// 	}
// 	return nil
// }

// @description listUserQuery represents a data with optional query-params to get users list.
type listUserQuery struct {
	// user roles (accepted: "teacher", "student")
	Roles []string `query:"role,omitempty" example:"student"`
}

// Parse parses listUserQuery request data and validates it.
func (u *listUserQuery) Parse(ctx *fiber.Ctx) error {
	// parse query-params
	if err := ctx.QueryParser(u); err != nil {
		return err
	}
	// validate parsed roles list
	for _, role := range u.Roles {
		if !slices.Contains(_acceptedRoles, role) {
			return fmt.Errorf("%w: invalid user role %s", validator.ErrValidate, role)
		}
	}
	// set all roles if no one role specified
	if len(u.Roles) == 0 {
		u.Roles = _acceptedRoles
	}
	return nil
}

// @description updatePasswordAdminBody represents a data to update user password by admin.
type updatePasswordAdminBody struct {
	// new password for user
	NewPasswd string `json:"new" validate:"required,min=8,max=40" example:"ytrewq321" minLength:"8" maxLength:"40"`
}

// Parse parses updatePasswordAdminBody request data and validates it.
func (u *updatePasswordAdminBody) Parse(ctx *fiber.Ctx, valid validator.Validator) error {
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
