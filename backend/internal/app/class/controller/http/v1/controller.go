package v1

import (
	"errors"
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/class"
	"skadi/backend/internal/pkg/httperror"
	"skadi/backend/internal/pkg/validator"
)

// ClassController represents a controller for class routes accepted for all clients.
type ClassController struct {
	valid         validator.Validator
	classUCClient class.UsecaseClient
}

// NewClassController returns a new instance of ClassController.
func NewClassController(classUCClient class.UsecaseClient,
	valid validator.Validator) *ClassController {

	return &ClassController{
		valid:         valid,
		classUCClient: classUCClient,
	}
}

// @summary		Получение группы по id.
// @description	Получение всех данных о группе с инфой о преподе и учениках (ID и полные имена).
// @router			/class/{id} [get]
// @id				class-read
// @tags			class
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path		string	true	"ID группы"
// @success		200	{object}	entity.Class
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		404	"группа не найдена"
func (c *ClassController) Read(ctx *fiber.Ctx) error {
	inputPath := &classIDPath{}
	if err := inputPath.Parse(ctx, c.valid); err != nil {
		return err
	}

	userResp, err := c.classUCClient.GetByID(inputPath.ID)
	if errors.Is(err, class.ErrNotFound) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusNotFound,
			Message:    "группа не найдена",
		}
	}
	if err != nil {
		return fmt.Errorf("read: %w", err)
	}
	return ctx.Status(fiber.StatusOK).JSON(userResp)
}

// @summary		Получение списка групп (кратко).
// @description	Получение списка групп (только ID и названия).
// @router			/class/short [get]
// @id				class-list-short
// @tags			class
// @accept			json
// @produce		json
// @security		JWTAccess
// @success		200	{array}	entity.Class
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
func (c *ClassController) ListShort(ctx *fiber.Ctx) error {
	// inputQuery := &listUserQuery{}
	// if err := inputQuery.Parse(ctx); err != nil {
	// 	return err
	// }
	userListResp, err := c.classUCClient.ListShort()
	if err != nil {
		return fmt.Errorf("list: %w", err)
	}
	return ctx.Status(fiber.StatusOK).JSON(userListResp)
}

// @summary		Получение списка групп.
// @description	Получение списка групп со всеми данными (ID и имена препода и учеников).
// @router			/class [get]
// @id				class-list
// @tags			class
// @accept			json
// @produce		json
// @security		JWTAccess
// @success		200	{array}	entity.Class
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
func (c *ClassController) ListFull(ctx *fiber.Ctx) error {
	// inputQuery := &listUserQuery{}
	// if err := inputQuery.Parse(ctx); err != nil {
	// 	return err
	// }
	userListResp, err := c.classUCClient.ListFull()
	if err != nil {
		return fmt.Errorf("list: %w", err)
	}
	return ctx.Status(fiber.StatusOK).JSON(userListResp)
}

// // @summary		Получение информации о себе.
// // @description	Получение всей информации о себе (юзер, профиль).
// // @router			/user/me [get]
// // @id				user-me-get
// // @tags			user
// // @accept			json
// // @produce		json
// // @security		JWTAccess
// // @success		200	{object}	entity.User
// // @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// func (c *UserController) GetMe(ctx *fiber.Ctx) error {
// 	// parse user claims
// 	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

// 	userResp, err := c.userUCClient.GetByID(userClaims.ID)
// 	if err != nil {
// 		return fmt.Errorf("read: %w", err)
// 	}
// 	return ctx.Status(fiber.StatusOK).JSON(userResp)
// }

// // @summary		Обновление своего профиля.
// // @description	Полное обновление своего профиля.
// // @router			/user/me/profile [put]
// // @id				user-me-profile-update
// // @tags			user
// // @accept			json
// // @produce		json
// // @security		JWTAccess
// // @param			profileBody	body		profileBody	true	"profileBody"
// // @success		200			{object}	entity.User
// // @failure		401			"неверный токен (пустой, истекший или неверный формат)"
// func (c *UserController) UpdateMeProfile(ctx *fiber.Ctx) error {
// 	inputBody := &profileBody{}
// 	if err := inputBody.Parse(ctx, c.valid); err != nil {
// 		return err
// 	}
// 	// parse user claims
// 	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

// 	// data reshaping
// 	profile := &entity.Profile{
// 		Fullname: inputBody.FullName,
// 		Address:  inputBody.Address,
// 		Extra:    inputBody.Extra,
// 	}
// 	if inputBody.Contact != nil {
// 		profile.Contact = &entity.Contact{
// 			Phone: inputBody.Contact.Phone,
// 			Email: inputBody.Contact.Email,
// 		}
// 	}
// 	if inputBody.ParentContact != nil {
// 		profile.ParentContact = &entity.Contact{
// 			Phone: inputBody.ParentContact.Phone,
// 			Email: inputBody.ParentContact.Email,
// 		}
// 	}

// 	// update user profile
// 	userObj, err := c.userUCClient.UpdateProfile(userClaims.ID, profile)
// 	if err != nil {
// 		return fmt.Errorf("update profile: %w", err)
// 	}
// 	return ctx.Status(fiber.StatusOK).JSON(userObj)
// }

// // @summary		Смена своего пароля.
// // @description	Смена своего пароля.
// // @router			/user/me/password [put]
// // @id				user-me-password-update
// // @tags			user
// // @accept			json
// // @produce		json
// // @security		JWTAccess
// // @param			updatePasswordBody	body	updatePasswordBody	true	"updatePasswordBody"
// // @success		204					"No Content"
// // @failure		400					"неверный старый пароль"
// // @failure		401					"неверный токен (пустой, истекший или неверный формат)"
// // @failure		409					"пароли не должны совпадать"
// func (c *UserController) ChangePassword(ctx *fiber.Ctx) error {
// 	inputBody := &updatePasswordBody{}
// 	if err := inputBody.Parse(ctx, c.valid); err != nil {
// 		return err
// 	}
// 	// parse user claims
// 	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

// 	// change user password
// 	err := c.userUCClient.ChangePasswordAsClient(userClaims.ID,
// 		[]byte(inputBody.OldPasswd), []byte(inputBody.NewPasswd))
// 	if errors.Is(err, user.ErrInvalidData) {
// 		return &httperror.HTTPError{
// 			CauseErr:   err,
// 			StatusCode: fiber.StatusBadRequest,
// 			Message:    "неверный старый пароль",
// 		}
// 	}
// 	if errors.Is(err, user.ErrConflict) {
// 		return &httperror.HTTPError{
// 			CauseErr:   err,
// 			StatusCode: fiber.StatusConflict,
// 			Message:    "пароли не должны совпадать",
// 		}
// 	}
// 	if err != nil {
// 		return err
// 	}
// 	return ctx.Status(fiber.StatusNoContent).JSON(nil)
// }
