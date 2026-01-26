package v1

import (
	"errors"
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/config"
	"skadi/backend/internal/app/entity"
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

// @summary		Создание нового юзера. [Только админ]
// @description	Создание нового юзера и профиля для него со всеми данными.
// @router			/admin/user [post]
// @id				admin-user-create
// @tags			user
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			createUserBody	body		createUserBody	true	"createUserBody"
// @success		201				{object}	entity.User
// @failure		401				"неверный токен (пустой, истекший или неверный формат)"
// @failure		409				"пользователь с введенным логином уже существует"
func (c *UserController) Create(ctx *fiber.Ctx) error {
	inputBody := &createUserBody{}
	if err := inputBody.Parse(ctx, c.valid); err != nil {
		return err
	}

	// data reshaping
	userObj := &entity.User{
		Username: inputBody.Username,
		Password: []byte(inputBody.Password),
		Role:     inputBody.Role,
	}
	userObj.Profile = &entity.Profile{
		Fullname: inputBody.Profile.FullName,
		Address:  inputBody.Profile.Address,
		Extra:    inputBody.Profile.Extra,
		Contact: &entity.Contact{
			Phone: inputBody.Profile.Contact.Phone,
			Email: inputBody.Profile.Contact.Email,
		},
	}
	if inputBody.Profile.ParentContact != nil {
		userObj.Profile.ParentContact = &entity.Contact{
			Phone: inputBody.Profile.ParentContact.Phone,
			Email: inputBody.Profile.ParentContact.Email,
		}
	}
	// create a new user
	err := c.userUCAdmin.CreateWithProfile(userObj)
	if errors.Is(err, user.ErrAlreadyExists) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusConflict,
			Message:    "пользователь с введенным логином уже существует",
		}
	}
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(userObj)
}

// @summary		Получение юзера по id. [Только админ]
// @description	Получение юзера со всеми данными по его id.
// @router			/admin/user/{id} [get]
// @id				admin-user-read
// @tags			user
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path		string	true	"ID юзера"
// @success		200	{object}	entity.User
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		404	"юзер с данным id не найден"
func (c *UserController) Read(ctx *fiber.Ctx) error {
	inputBody := &userIDPath{}
	if err := inputBody.Parse(ctx, c.valid); err != nil {
		return err
	}

	userResp, err := c.userUCAdmin.GetByID(inputBody.ID)
	if errors.Is(err, user.ErrNotFound) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusNotFound,
			Message:    "пользователь не найден",
		}
	}
	if err != nil {
		return fmt.Errorf("read: %w", err)
	}
	return ctx.Status(fiber.StatusOK).JSON(userResp)
}
