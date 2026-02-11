package v1

import (
	"errors"
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/user"
	"skadi/backend/internal/pkg/httperror"
	"skadi/backend/internal/pkg/validator"
)

// UserControllerAdmin represents a controller for user routes accepted for admin only.
type UserControllerAdmin struct {
	valid       validator.Validator
	userUCAdmin user.UsecaseAdmin
}

// NewUserControllerAdmin returns a new instance of UserControllerAdmin.
func NewUserControllerAdmin(userUCAdmin user.UsecaseAdmin,
	valid validator.Validator) *UserControllerAdmin {

	return &UserControllerAdmin{
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
// @param			userBody	body		userBody	true	"userBody"
// @success		201			{object}	entity.User
// @failure		400			"группа не найдена"
// @failure		401			"неверный токен (пустой, истекший или неверный формат)"
// @failure		404			"группа не найдена"
// @failure		409			"пользователь с введенным логином уже существует"
func (c *UserControllerAdmin) Create(ctx *fiber.Ctx) error {
	inputBody := &userBody{}
	if err := inputBody.Parse(ctx, c.valid); err != nil {
		return err
	}

	// data reshaping
	userObj := &entity.User{
		Username: inputBody.Username,
		Password: []byte(inputBody.Password),
		Role:     inputBody.Role,
		ClassID:  inputBody.ClassID,
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
	if errors.Is(err, user.ErrInvalidData) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusBadRequest,
			Message:    "группа не найдена",
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
// @failure		404	"пользователь не найден"
func (c *UserControllerAdmin) Read(ctx *fiber.Ctx) error {
	inputPath := &userIDPath{}
	if err := inputPath.Parse(ctx, c.valid); err != nil {
		return err
	}

	userResp, err := c.userUCAdmin.GetByID(inputPath.ID)
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

// @summary		Обновление профиля юзера по id. [Только админ]
// @description	Полное обновление профиля юзера по его id.
// @router			/admin/user/{id}/profile [put]
// @id				admin-user-profile-update
// @tags			user
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id			path		string		true	"ID юзера"
// @param			profileBody	body		profileBody	true	"profileBody"
// @success		200			{object}	entity.User
// @failure		401			"неверный токен (пустой, истекший или неверный формат)"
// @failure		404			"пользователь не найден"
func (c *UserControllerAdmin) UpdateProfile(ctx *fiber.Ctx) error {
	inputPath := &userIDPath{}
	if err := inputPath.Parse(ctx, c.valid); err != nil {
		return err
	}
	inputBody := &profileBody{}
	if err := inputBody.Parse(ctx, c.valid); err != nil {
		return err
	}

	// data reshaping
	profile := &entity.Profile{
		Fullname: inputBody.FullName,
		Address:  inputBody.Address,
		Extra:    inputBody.Extra,
		Contact: &entity.Contact{
			Phone: inputBody.Contact.Phone,
			Email: inputBody.Contact.Email,
		},
	}
	if inputBody.ParentContact != nil {
		profile.ParentContact = &entity.Contact{
			Phone: inputBody.ParentContact.Phone,
			Email: inputBody.ParentContact.Email,
		}
	}

	// update user profile
	userObj, err := c.userUCAdmin.UpdateProfile(inputPath.ID, profile)
	if errors.Is(err, user.ErrNotFound) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusNotFound,
			Message:    "пользователь не найден",
		}
	}
	if err != nil {
		return fmt.Errorf("update profile: %w", err)
	}
	return ctx.Status(fiber.StatusOK).JSON(userObj)
}

// @summary		Удаление юзера по id. [Только админ]
// @description	Удаление юзера и его профиля по его id.
// @router			/admin/user/{id} [delete]
// @id				admin-user-delete
// @tags			user
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path	string	true	"ID юзера"
// @success		204	"No Content"
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		404	"пользователь не найден"
func (c *UserControllerAdmin) Delete(ctx *fiber.Ctx) error {
	inputPath := &userIDPath{}
	if err := inputPath.Parse(ctx, c.valid); err != nil {
		return err
	}

	err := c.userUCAdmin.DeleteByID(inputPath.ID)
	if errors.Is(err, user.ErrNotFound) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusNotFound,
			Message:    "пользователь не найден",
		}
	}
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return ctx.Status(fiber.StatusNoContent).JSON(nil)
}

// @summary		Получение списка юзеров. [Только админ]
// @description	Получение списка юзеров со всеми данными.
// @router			/admin/user [get]
// @id				admin-user-list
// @tags			user
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			listUserQuery	query	listUserQuery	false	"listUserQuery"
// @success		200				{array}	entity.User
// @failure		401				"неверный токен (пустой, истекший или неверный формат)"
func (c *UserControllerAdmin) List(ctx *fiber.Ctx) error {
	inputQuery := &listUserQuery{}
	if err := inputQuery.Parse(ctx); err != nil {
		return err
	}
	userListResp, err := c.userUCAdmin.GetByRoles(inputQuery.Roles)
	if err != nil {
		return fmt.Errorf("list: %w", err)
	}
	return ctx.Status(fiber.StatusOK).JSON(userListResp)
}

// @summary		Смена пароля юзера. [Только админ]
// @description	Смена пароля юзера по его id.
// @router			/admin/user/{id}/password [put]
// @id				admin-user-password-update
// @tags			user
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id						path	string					true	"ID юзера"
// @param			updatePasswordAdminBody	body	updatePasswordAdminBody	true	"updatePasswordAdminBody"
// @success		204						"No Content"
// @failure		401						"неверный токен (пустой, истекший или неверный формат)"
// @failure		404						"пользователь не найден"
func (c *UserControllerAdmin) ChangePassword(ctx *fiber.Ctx) error {
	inputPath := &userIDPath{}
	if err := inputPath.Parse(ctx, c.valid); err != nil {
		return err
	}
	inputBody := &updatePasswordAdminBody{}
	if err := inputBody.Parse(ctx, c.valid); err != nil {
		return err
	}

	// change user password
	err := c.userUCAdmin.ChangePasswordAsAdmin(inputPath.ID, []byte(inputBody.NewPasswd))
	if errors.Is(err, user.ErrNotFound) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusNotFound,
			Message:    "пользователь не найден",
		}
	}
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusNoContent).JSON(nil)
}
