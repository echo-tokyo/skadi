package v1

import (
	"errors"
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/task"
	"skadi/backend/internal/pkg/httperror"
	"skadi/backend/internal/pkg/serialize"
	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
	"skadi/backend/internal/pkg/utils/slices"
	"skadi/backend/internal/pkg/validator"
)

// TaskControllerTeacher represents a controller for task routes accepted for teachers only.
type TaskControllerTeacher struct {
	valid         validator.Validator
	taskUCTeacher task.UsecaseTeacher
}

// NewTaskControllerTeacher returns a new instance of [TaskControllerTeacher].
func NewTaskControllerTeacher(taskUCTeacher task.UsecaseTeacher,
	valid validator.Validator) *TaskControllerTeacher {

	return &TaskControllerTeacher{
		valid:         valid,
		taskUCTeacher: taskUCTeacher,
	}
}

// @summary		Создание нового задания. [Только преподаватель]
// @description	Создание нового задания для переданных учеников и учеников из переданных групп.
// @router			/task [post]
// @id				task-create
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			taskBody	body		taskBody	true	"taskBody"
// @success		201			{object}	createTaskOut
// @failure		400			"неверный ученик | неверный преподаватель | преподаватель не найден"
// @failure		401			"неверный токен (пустой, истекший или неверный формат)"
func (c *TaskControllerTeacher) Create(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputBody := &taskBody{}
	if err := serialize.Deserialize(inputBody, ctx.BodyParser, c.valid.Validate); err != nil {
		return err
	}

	// data reshaping
	taskObj := &entity.Task{
		Title:     inputBody.Title,
		Desc:      inputBody.Desc,
		TeacherID: userClaims.ID,
	}
	// create a new task with solutions
	solutions, err := c.taskUCTeacher.CreateWithSolutions(taskObj,
		inputBody.StudentIDs, inputBody.ClassIDs)
	if errors.Is(err, task.ErrNotFoundUser) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusBadRequest,
			Message:    "преподаватель не найден",
		}
	}
	if errors.Is(err, task.ErrInvalidTeacher) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusBadRequest,
			Message:    "неверный преподаватель",
		}
	}
	if errors.Is(err, task.ErrInvalidStudent) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusBadRequest,
			Message:    "неверный ученик",
		}
	}
	if err != nil {
		return err
	}

	res := &createTaskOut{
		Task:      taskObj,
		Solutions: solutions,
	}
	return ctx.Status(fiber.StatusCreated).JSON(res)
}

// @summary		Получение задания по id. [Только преподаватель]
// @description	Получение всех данных о задании и преподе (ID и полное имя), а также списка учеников, которые выполняют это задание.
// @router			/task/{id} [get]
// @id				task-read
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path		int	true	"ID решения задания"
// @success		200	{object}	entity.TaskWithStudents
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		403	"доступ запрещён"
// @failure		404	"задание не найдено"
func (c *TaskControllerTeacher) Read(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputPath := &taskIDPath{}
	if err := serialize.Deserialize(inputPath, ctx.ParamsParser, c.valid.Validate); err != nil {
		return err
	}

	taskObj, students, err := c.taskUCTeacher.GetByID(userClaims.ID, inputPath.ID)
	if errors.Is(err, task.ErrNotFound) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusNotFound,
			Message:    "решение задания не найдено",
		}
	}
	if errors.Is(err, task.ErrForbidden) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusForbidden,
			Message:    "доступ запрещён",
		}
	}
	if err != nil {
		return fmt.Errorf("read: %w", err)
	}

	res := &entity.TaskWithStudents{
		Task:     taskObj,
		Students: students,
	}
	return ctx.Status(fiber.StatusOK).JSON(res)
}

// @summary		Обновление задания. [Только преподаватель]
// @description	Частичное обновление задания (только переданные поля: название, описание, привязанные ученики, прикреплённые файлы) по его id.
// @router			/task/{id} [patch]
// @id				task-update
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id				path		string			true	"ID задания"
// @param			updateTaskBody	body		updateTaskBody	true	"updateTaskBody"
// @success		200				{object}	entity.TaskWithStudents
// @failure		400				"неверный ученик"
// @failure		401				"неверный токен (пустой, истекший или неверный формат)"
// @failure		403				"доступ запрещён"
// @failure		404				"задание не найдено"
func (c *TaskControllerTeacher) Update(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputPath := &taskIDPath{}
	if err := serialize.Deserialize(inputPath, ctx.ParamsParser, c.valid.Validate); err != nil {
		return err
	}
	inputBody := &updateTaskBody{}
	if err := serialize.Deserialize(inputBody, ctx.BodyParser, c.valid.Validate); err != nil {
		return err
	}

	// data reshaping
	newData := &entity.TaskUpdate{
		Title:           inputBody.Title,
		Desc:            inputBody.Desc,
		NewFullStudents: slices.DelDupls(inputBody.Students), // delete duplicates from list
	}
	taskObj, students, err := c.taskUCTeacher.Update(userClaims.ID, inputPath.ID, newData)
	if errors.Is(err, task.ErrForbidden) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusForbidden,
			Message:    "доступ запрещён",
		}
	}
	if errors.Is(err, task.ErrNotFound) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusNotFound,
			Message:    "задание не найдено",
		}
	}
	if errors.Is(err, task.ErrInvalidData) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusBadRequest,
			Message:    "неверный ученик",
		}
	}
	if err != nil {
		return err
	}

	res := &entity.TaskWithStudents{
		Task:     taskObj,
		Students: students,
	}
	return ctx.Status(fiber.StatusOK).JSON(res)
}

// @summary		Удаление задания по id. [Только преподаватель]
// @description	Удаление задания целиком (со всеми его решениями) по его id.
// @router			/task/{id} [delete]
// @id				task-delete
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path	string	true	"ID задания"
// @success		204	"No Content"
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		403	"доступ запрещён"
func (c *TaskControllerTeacher) Delete(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputPath := &taskIDPath{}
	if err := serialize.Deserialize(inputPath, ctx.ParamsParser, c.valid.Validate); err != nil {
		return err
	}
	err := c.taskUCTeacher.DeleteByID(userClaims.ID, inputPath.ID)
	if errors.Is(err, task.ErrForbidden) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusForbidden,
			Message:    "доступ запрещён",
		}
	}
	if err != nil {
		return fmt.Errorf("delete task: %w", err)
	}
	return ctx.Status(fiber.StatusNoContent).JSON(nil)
}

// @summary		Получение списка заданий. [Только преподаватель]
// @description	Получение списка заданий конкретного преподавателя.
// @router			/task [get]
// @id				task-list
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			listTaskQuery	query		listTaskQuery	false	"listTaskQuery"
// @success		200				{object}	listTaskOut
// @failure		401				"неверный токен (пустой, истекший или неверный формат)"
func (c *TaskControllerTeacher) List(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputQuery := &listTaskQuery{}
	if err := serialize.Deserialize(inputQuery, ctx.QueryParser, c.valid.Validate); err != nil {
		return err
	}
	// get pagination object OR nil
	pageParams := inputQuery.PaginationQuery.ToPagination()

	// get tasks
	taskListResp, err := c.taskUCTeacher.GetMany(userClaims.ID, inputQuery.Search, pageParams)
	if err != nil {
		return fmt.Errorf("list: %w", err)
	}
	output := &listTaskOut{
		Data:       taskListResp,
		Pagination: pageParams,
	}
	return ctx.Status(fiber.StatusOK).JSON(output)
}
