package v1

import (
	"errors"
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/class"
	"skadi/backend/internal/app/task"
	"skadi/backend/internal/pkg/httperror"
	"skadi/backend/internal/pkg/validator"
)

// TaskController represents a controller for task routes accepted for all clients.
type TaskController struct {
	valid        validator.Validator
	taskUCClient task.UsecaseClient
}

// NewTaskController returns a new instance of ClassController.
func NewTaskController(taskUCClient task.UsecaseClient,
	valid validator.Validator) *TaskController {

	return &TaskController{
		valid:        valid,
		taskUCClient: taskUCClient,
	}
}

// @summary		Получение решения задания по id.
// @description	Получение всех данных о решении задания с полной инфой о задании и преподе (ID и полное имя), а также со списком учеников, которые тоже выполняют это задание.
// @router			/solution/get/{id} [get]
// @id				solution-read
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path		int	true	"ID решения задания"
// @success		200	{object}	solutionOut
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		404	"решение задания не найдено"
func (c *TaskController) Read(ctx *fiber.Ctx) error {
	inputPath := &solutionIDPath{}
	if err := inputPath.Parse(ctx, c.valid); err != nil {
		return err
	}

	solution, students, err := c.taskUCClient.GetByID(inputPath.ID)
	if errors.Is(err, class.ErrNotFound) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusNotFound,
			Message:    "решение задания не найдено",
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
