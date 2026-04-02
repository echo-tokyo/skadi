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
// @router			/teacher/task [post]
// @id				teacher-task-create
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			taskBody	body		taskBody	true	"taskBody"
// @success		201			{object}	taskOut
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
	solutions, err := c.taskUCTeacher.CreateTaskWithSolutions(taskObj,
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

	res := &taskOut{
		Task:      taskObj,
		Solutions: solutions,
	}
	return ctx.Status(fiber.StatusCreated).JSON(res)
}

// @summary		Обновление задания. [Только преподаватель]
// @description	Частичное обновление задания (только переданные поля: название, описание, прикреплённые файлы) по его id.
// @router			/teacher/task/{id} [patch]
// @id				task-update
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id				path		string			true	"ID задания"
// @param			updateTaskBody	body		updateTaskBody	true	"updateTaskBody"
// @success		200				{object}	entity.Task
// @failure		401				"неверный токен (пустой, истекший или неверный формат)"
// @failure		403				"доступ запрещён"
// @failure		404				"задание не найдено"
func (c *TaskControllerTeacher) UpdateTask(ctx *fiber.Ctx) error {
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
		Title: inputBody.Title,
		Desc:  inputBody.Desc,
	}

	taskObj, err := c.taskUCTeacher.UpdateTask(userClaims.ID, inputPath.ID, newData)
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
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusOK).JSON(taskObj)
}

// @summary		Обновление решения. [Только преподаватель]
// @description	Частичное обновление решения (только переданные поля: статус - "готово"/"проверено" - и оценка) по его id.
// @router			/teacher/solution/{id} [patch]
// @id				teacher-solution-update
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id					path		string				true	"ID решения"
// @param			updateSolutionBody	body		updateSolutionBody	true	"updateSolutionBody"
// @success		200					{object}	entity.Solution
// @failure		400					"неверный статус"
// @failure		401					"неверный токен (пустой, истекший или неверный формат)"
// @failure		403					"доступ запрещён"
// @failure		404					"решение не найдено"
func (c *TaskControllerTeacher) UpdateSolution(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputPath := &solutionIDPath{}
	if err := serialize.Deserialize(inputPath, ctx.ParamsParser, c.valid.Validate); err != nil {
		return err
	}
	inputBody := &updateSolutionBody{}
	if err := serialize.Deserialize(inputBody, ctx.BodyParser, c.valid.Validate); err != nil {
		return err
	}

	// data reshaping
	newData := &entity.SolutionUpdate{
		StatusID: inputBody.StatusID,
		Grade:    inputBody.Grade,
	}

	solObj, err := c.taskUCTeacher.UpdateSolution(userClaims.ID, inputPath.ID, newData)
	if errors.Is(err, task.ErrInvalidData) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusBadRequest,
			Message:    "неверный статус",
		}
	}
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
			Message:    "решение не найдено",
		}
	}
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusOK).JSON(solObj)
}

// @summary		Удаление задания по id. [Только преподаватель]
// @description	Удаление задания целиком (со всеми его решениями) по его id.
// @router			/teacher/task/{id} [delete]
// @id				teacher-task-delete
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path	string	true	"ID задания"
// @success		204	"No Content"
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		403	"доступ запрещён"
func (c *TaskControllerTeacher) DeleteTask(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputPath := &taskIDPath{}
	if err := serialize.Deserialize(inputPath, ctx.ParamsParser, c.valid.Validate); err != nil {
		return err
	}
	err := c.taskUCTeacher.DeleteTaskByID(userClaims.ID, inputPath.ID)
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

// @summary		Удаление решения по id. [Только преподаватель]
// @description	Удаление решения (не задания целиком) по его id.
// @router			/teacher/solution/{id} [delete]
// @id				teacher-solution-delete
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path	string	true	"ID решения"
// @success		204	"No Content"
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		403	"доступ запрещён"
func (c *TaskControllerTeacher) DeleteSolution(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputPath := &solutionIDPath{}
	if err := serialize.Deserialize(inputPath, ctx.ParamsParser, c.valid.Validate); err != nil {
		return err
	}
	err := c.taskUCTeacher.DeleteSolutionByID(userClaims.ID, inputPath.ID)
	if errors.Is(err, task.ErrForbidden) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusForbidden,
			Message:    "доступ запрещён",
		}
	}
	if err != nil {
		return fmt.Errorf("delete solution: %w", err)
	}
	return ctx.Status(fiber.StatusNoContent).JSON(nil)
}

// @summary		Получение списка заданий [только преподаватель].
// @description	Получение списка заданий конкретного преподавателя.
// @router			/teacher/task [get]
// @id				task-list
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			listTaskQuery	query		listTaskQuery	false	"listTaskQuery"
// @success		200				{object}	listTaskOut
// @failure		401				"неверный токен (пустой, истекший или неверный формат)"
func (c *TaskControllerTeacher) TaskList(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputQuery := &listTaskQuery{}
	if err := serialize.Deserialize(inputQuery, ctx.QueryParser, c.valid.Validate); err != nil {
		return err
	}
	// get pagination object OR nil
	pageParams := inputQuery.PaginationQuery.ToPagination()

	// get tasks
	taskListResp, err := c.taskUCTeacher.GetTasks(userClaims.ID, inputQuery.Search, pageParams)
	if err != nil {
		return fmt.Errorf("list: %w", err)
	}
	output := &listTaskOut{
		Data:       taskListResp,
		Pagination: pageParams,
	}
	return ctx.Status(fiber.StatusOK).JSON(output)
}

// @summary		Получение списка решений [только преподаватель].
// @description	Получение списка решений для заданий конкретного преподавателя.
// @router			/teacher/solution [get]
// @id				teacher-solution-list
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			listSolutionTeacherQuery	query		listSolutionTeacherQuery	false	"listSolutionTeacherQuery"
// @success		200							{object}	listSolutionOut
// @failure		401							"неверный токен (пустой, истекший или неверный формат)"
func (c *TaskControllerTeacher) SolutionList(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputQuery := &listSolutionTeacherQuery{}
	if err := serialize.Deserialize(inputQuery, ctx.QueryParser, c.valid.Validate); err != nil {
		return err
	}
	// get pagination object OR nil
	pageParams := inputQuery.PaginationQuery.ToPagination()

	// get solutions
	solListResp, err := c.taskUCTeacher.GetSolutions(userClaims.ID, inputQuery.Search,
		inputQuery.Archived, pageParams)
	if err != nil {
		return fmt.Errorf("list: %w", err)
	}
	output := &listSolutionOut{
		Data:       solListResp,
		Pagination: pageParams,
	}
	return ctx.Status(fiber.StatusOK).JSON(output)
}
