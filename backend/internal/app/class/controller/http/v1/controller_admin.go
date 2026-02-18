package v1

import (
	"errors"
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/class"
	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/pkg/httperror"
	"skadi/backend/internal/pkg/validator"
)

// ClassControllerAdmin represents a controller for class routes accepted for admin only.
type ClassControllerAdmin struct {
	valid        validator.Validator
	classUCAdmin class.UsecaseAdmin
}

// NewClassControllerAdmin returns a new instance of ClassControllerAdmin.
func NewClassControllerAdmin(classUCAdmin class.UsecaseAdmin,
	valid validator.Validator) *ClassControllerAdmin {

	return &ClassControllerAdmin{
		valid:        valid,
		classUCAdmin: classUCAdmin,
	}
}

// @summary		Создание новой группы. [Только админ]
// @description	Создание новой группы со всеми данными и включение в неё переданных студентов.
// @router			/admin/class [post]
// @id				admin-class-create
// @tags			class
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			classBody	body		classBody	true	"classBody"
// @success		201			{object}	entity.Class
// @failure		400			"преподаватель не найден"
// @failure		401			"неверный токен (пустой, истекший или неверный формат)"
// @failure		409			"группа с введенным названием уже существует"
func (c *ClassControllerAdmin) Create(ctx *fiber.Ctx) error {
	inputBody := &classBody{}
	if err := inputBody.Parse(ctx, c.valid); err != nil {
		return err
	}

	// data reshaping
	classObj := &entity.Class{
		Name:      inputBody.Name,
		TeacherID: inputBody.TeacherID,
		Schedule:  inputBody.Schedule,
	}
	// create a new class
	err := c.classUCAdmin.Create(classObj, inputBody.StudentIDs)
	if errors.Is(err, class.ErrAlreadyExists) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusConflict,
			Message:    "группа с введенным названием уже существует",
		}
	}
	if errors.Is(err, class.ErrInvalidData) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusBadRequest,
			Message:    "преподаватель не найден",
		}
	}
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(classObj)
}

// // @summary		Обновление юзера по id. [Только админ]
// // @description	Полное обновление профиля юзера и его группы (если студент) по его id.
// // @router			/admin/user/{id} [put]
// // @id				admin-user-update
// // @tags			user
// // @accept			json
// // @produce		json
// // @security		JWTAccess
// // @param			id			path		string		true	"ID юзера"
// // @param			updateBody	body		updateBody	true	"updateBody"
// // @success		200			{object}	entity.User
// // @failure		400			"группа не найдена"
// // @failure		401			"неверный токен (пустой, истекший или неверный формат)"
// // @failure		404			"пользователь не найден"
// func (c *UserControllerAdmin) Update(ctx *fiber.Ctx) error {
// 	inputPath := &userIDPath{}
// 	if err := inputPath.Parse(ctx, c.valid); err != nil {
// 		return err
// 	}
// 	inputBody := &updateBody{}
// 	if err := inputBody.Parse(ctx, c.valid); err != nil {
// 		return err
// 	}

// 	// data reshaping
// 	oldUser := &entity.User{
// 		ClassID: inputBody.ClassID,
// 		Profile: &entity.Profile{
// 			Fullname: inputBody.Profile.FullName,
// 			Address:  inputBody.Profile.Address,
// 			Extra:    inputBody.Profile.Extra,
// 		},
// 	}
// 	if inputBody.Profile.Contact != nil {
// 		oldUser.Profile.Contact = &entity.Contact{
// 			Phone: inputBody.Profile.Contact.Phone,
// 			Email: inputBody.Profile.Contact.Email,
// 		}
// 	}
// 	if inputBody.Profile.ParentContact != nil {
// 		oldUser.Profile.ParentContact = &entity.Contact{
// 			Phone: inputBody.Profile.ParentContact.Phone,
// 			Email: inputBody.Profile.ParentContact.Email,
// 		}
// 	}

// 	// update user
// 	newUser, err := c.userUCAdmin.Update(inputPath.ID, oldUser)
// 	if errors.Is(err, user.ErrNotFound) {
// 		return &httperror.HTTPError{
// 			CauseErr:   err,
// 			StatusCode: fiber.StatusNotFound,
// 			Message:    "пользователь не найден",
// 		}
// 	}
// 	if errors.Is(err, user.ErrInvalidData) {
// 		return &httperror.HTTPError{
// 			CauseErr:   err,
// 			StatusCode: fiber.StatusBadRequest,
// 			Message:    "группа не найдена",
// 		}
// 	}
// 	if err != nil {
// 		return fmt.Errorf("update: %w", err)
// 	}
// 	return ctx.Status(fiber.StatusOK).JSON(newUser)
// }

// @summary		Удаление группы по id. [Только админ]
// @description	Удаление группы по её id.
// @router			/admin/class/{id} [delete]
// @id				admin-class-delete
// @tags			class
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path	string	true	"ID юзера"
// @success		204	"No Content"
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
func (c *ClassControllerAdmin) Delete(ctx *fiber.Ctx) error {
	inputPath := &classIDPath{}
	if err := inputPath.Parse(ctx, c.valid); err != nil {
		return err
	}
	err := c.classUCAdmin.DeleteByID(inputPath.ID)
	if err != nil {
		return fmt.Errorf("delete: %w", err)
	}
	return ctx.Status(fiber.StatusNoContent).JSON(nil)
}

// // @summary		Смена пароля юзера. [Только админ]
// // @description	Смена пароля юзера по его id.
// // @router			/admin/user/{id}/password [put]
// // @id				admin-user-password-update
// // @tags			user
// // @accept			json
// // @produce		json
// // @security		JWTAccess
// // @param			id						path	string					true	"ID юзера"
// // @param			updatePasswordAdminBody	body	updatePasswordAdminBody	true	"updatePasswordAdminBody"
// // @success		204						"No Content"
// // @failure		401						"неверный токен (пустой, истекший или неверный формат)"
// // @failure		404						"пользователь не найден"
// func (c *UserControllerAdmin) ChangePassword(ctx *fiber.Ctx) error {
// 	inputPath := &userIDPath{}
// 	if err := inputPath.Parse(ctx, c.valid); err != nil {
// 		return err
// 	}
// 	inputBody := &updatePasswordAdminBody{}
// 	if err := inputBody.Parse(ctx, c.valid); err != nil {
// 		return err
// 	}

// 	// change user password
// 	err := c.userUCAdmin.ChangePasswordAsAdmin(inputPath.ID, []byte(inputBody.NewPasswd))
// 	if errors.Is(err, user.ErrNotFound) {
// 		return &httperror.HTTPError{
// 			CauseErr:   err,
// 			StatusCode: fiber.StatusNotFound,
// 			Message:    "пользователь не найден",
// 		}
// 	}
// 	if err != nil {
// 		return err
// 	}
// 	return ctx.Status(fiber.StatusNoContent).JSON(nil)
// }
