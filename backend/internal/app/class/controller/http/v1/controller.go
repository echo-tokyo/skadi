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
// @router			/class/get/{id} [get]
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

	classResp, err := c.classUCClient.GetByID(inputPath.ID)
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
	return ctx.Status(fiber.StatusOK).JSON(classResp)
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
	classListResp, err := c.classUCClient.ListShort()
	if err != nil {
		return fmt.Errorf("list: %w", err)
	}
	return ctx.Status(fiber.StatusOK).JSON(classListResp)
}

// @summary		Получение списка групп.
// @description	Получение списка групп со всеми данными (ID и имена препода и учеников).
// @router			/class [get]
// @id				class-list
// @tags			class
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			listClassQuery	query		listClassQuery	false	"listClassQuery"
// @success		200				{object}	listClassOut
// @failure		401				"неверный токен (пустой, истекший или неверный формат)"
func (c *ClassController) ListFull(ctx *fiber.Ctx) error {
	inputQuery := &listClassQuery{}
	if err := inputQuery.Parse(ctx, c.valid); err != nil {
		return err
	}
	// get pagination object OR nil
	pageParams := entity.NewPagination(inputQuery.Page, inputQuery.PerPage)

	// get classes
	classListResp, err := c.classUCClient.ListFull(pageParams)
	if err != nil {
		return fmt.Errorf("list: %w", err)
	}
	output := &listClassOut{
		Data:       classListResp,
		Pagination: pageParams,
	}
	return ctx.Status(fiber.StatusOK).JSON(output)
}
