package v1

import (
	"errors"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/config"
	"skadi/backend/internal/app/user"
	"skadi/backend/internal/pkg/httperror"
	"skadi/backend/internal/pkg/validator"
)

// UserController represents a controller for all auth routes.
type UserController struct {
	valid       validator.Validator
	userUCAdmin user.UsecaseAdmin
}

// NewUserController returns a new instance of UserController.
func NewUserController(_ *config.Config, userUCAdmin user.UsecaseAdmin,
	valid validator.Validator) *UserController {

	return &UserController{
		valid:       valid,
		userUCAdmin: userUCAdmin,
	}
}

// @summary		Регистрация юзера. [Только админ]
// @description	Регистрация нового юзера с логином и паролем.
// @router			/admin/user/sign-up [post]
// @id				admin-user-sign-up
// @tags			user
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			userBody	body		userBody	true	"userBody"
// @success		201			{object}	entity.User
// @failure		401			"Неверный токен (пустой, истекший или неверный формат)"
// @failure		409			"Юзер с введенным логином уже зарегистрирован"
func (c *UserController) SignUp(ctx *fiber.Ctx) error {
	inputBody := &userBody{}
	if err := inputBody.Parse(ctx, c.valid); err != nil {
		return err
	}

	// sign up new user
	userObj, err := c.userUCAdmin.SignUp(inputBody.Username,
		[]byte(inputBody.Password), inputBody.Role)
	if err != nil && errors.Is(err, user.ErrAlreadyExists) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusConflict,
			Message:    "пользователь с введенным логином уже зарегистрирован",
		}
	}
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(userObj)
}
