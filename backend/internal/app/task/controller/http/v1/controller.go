package v1

import (
	"errors"
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/task"
	"skadi/backend/internal/pkg/httperror"
	"skadi/backend/internal/pkg/serialize"
	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
	"skadi/backend/internal/pkg/validator"
)

// TaskController represents a controller for task routes accepted for all clients.
type TaskController struct {
	valid        validator.Validator
	taskUCClient task.UsecaseClient
}

// NewTaskController returns a new instance of [TaskController].
func NewTaskController(taskUCClient task.UsecaseClient,
	valid validator.Validator) *TaskController {

	return &TaskController{
		valid:        valid,
		taskUCClient: taskUCClient,
	}
}

// @summary		Получение решения задания по id [Преподаватель и ученик].
// @description	Получение всех данных о решении задания с полной инфой о задании и преподе (ID и полное имя), а также со списком учеников, которые тоже выполняют это задание.
// @router			/solution/{id} [get]
// @id				solution-read
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path		int	true	"ID решения задания"
// @success		200	{object}	solutionOut
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		403	"доступ запрещён"
// @failure		404	"решение задания не найдено"
func (c *TaskController) ReadSolution(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputPath := &solutionIDPath{}
	if err := serialize.Deserialize(inputPath, ctx.ParamsParser, c.valid.Validate); err != nil {
		return err
	}

	solution, students, err := c.taskUCClient.GetByIDFull(inputPath.ID, userClaims)
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

	res := &solutionOut{
		Solution:      solution,
		OtherStudents: students,
	}
	return ctx.Status(fiber.StatusOK).JSON(res)
}
