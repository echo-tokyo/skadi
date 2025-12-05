package v1

import (
	"errors"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/config"
	"skadi/backend/internal/app/user"
	"skadi/backend/internal/pkg/cookie"
	"skadi/backend/internal/pkg/httperror"
	"skadi/backend/internal/pkg/validator"
)

// UserController represents a controller for all auth routes.
type UserController struct {
	validator     validator.Validator
	userUCAdmin   user.UsecaseAdmin
	cookieBuilder *cookie.Builder
}

// NewUserController returns a new instance of UserController.
func NewUserController(cfg *config.Config, userUCAdmin user.UsecaseAdmin,
	valid validator.Validator) *UserController {

	return &UserController{
		validator:   valid,
		userUCAdmin: userUCAdmin,
		cookieBuilder: cookie.NewBuilder(cfg.Auth.Token.RefreshTTL,
			cookie.WithPath(cfg.Auth.Cookie.Path),
			cookie.WithSecure(cfg.Auth.Cookie.Secure),
			cookie.WithHTTPOnly(cfg.Auth.Cookie.HTTPOnly),
			cookie.WithSameSite(cfg.Auth.Cookie.SameSite)),
	}
}

// @summary		Регистрация юзера
// @description	Регистрация нового юзера с логином и паролем
// @router			/admin/user/sign-up [post]
// @id				admin-user-sign-up
// @tags			user
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			userBody	body		userBody	true	"userBody"
// @success		201			{object}	entity.User
// @failure		409			"Юзер с введенным логином уже зарегистрирован"
func (c *UserController) SignUp(ctx *fiber.Ctx) error {
	inputBody := &userBody{}
	// parse JSON-body
	if err := ctx.BodyParser(inputBody); err != nil {
		return err
	}
	// validate parsed data
	if err := c.validator.Validate(inputBody); err != nil {
		return err
	}

	// sign up new user
	userObj, err := c.userUCAdmin.SignUp(inputBody.Username, []byte(inputBody.Password))
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
