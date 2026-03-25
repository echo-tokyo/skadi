package v1

import (
	"errors"
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/task"
	"skadi/backend/internal/pkg/httperror"
	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
	"skadi/backend/internal/pkg/validator"
)

// TaskControllerTeacher represents a controller for task routes accepted for teachers only.
type TaskControllerTeacher struct {
	valid         validator.Validator
	taskUCTeacher task.UsecaseTeacher
}

// NewTaskControllerTeacher returns a new instance of TaskControllerTeacher.
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
// @failure		400			"неверный ученик ErrInvalidStudent"
// @failure		400			"неверный преподаватель ErrInvalidTeacher"
// @failure		400			"преподаватель не найден ErrNotFoundUser"
// @failure		401			"неверный токен (пустой, истекший или неверный формат)"
func (c *TaskControllerTeacher) Create(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputBody := &taskBody{}
	if err := inputBody.Parse(ctx, c.valid); err != nil {
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

// // @summary		Обновление группы по id. [Только админ]
// // @description	Частичное обновление группы (только переданные поля) по её id.
// // @router			/admin/class/{id} [patch]
// // @id				admin-class-update
// // @tags			class
// // @accept			json
// // @produce		json
// // @security		JWTAccess
// // @param			id			path		string		true	"ID группы"
// // @param			updateBody	body		updateBody	true	"updateBody"
// // @success		200			{object}	entity.Class
// // @failure		400			"неверный ученик"
// // @failure		400			"неверный преподаватель"
// // @failure		400			"преподаватель не найден"
// // @failure		401			"неверный токен (пустой, истекший или неверный формат)"
// // @failure		404			"группа не найдена"
// func (c *ClassControllerAdmin) Update(ctx *fiber.Ctx) error {
// 	inputPath := &classIDPath{}
// 	if err := inputPath.Parse(ctx, c.valid); err != nil {
// 		return err
// 	}
// 	inputBody := &updateBody{}
// 	if err := inputBody.Parse(ctx, c.valid); err != nil {
// 		return err
// 	}

// 	// data reshaping
// 	newData := &entity.ClassUpdate{
// 		Name:            inputBody.Name,
// 		TeacherID:       inputBody.TeacherID,
// 		Schedule:        inputBody.Schedule,
// 		NewFullStudents: inputBody.Students,
// 	}
// 	classObj, err := c.classUCAdmin.Update(inputPath.ID, newData)
// 	if errors.Is(err, class.ErrNotFound) {
// 		return &httperror.HTTPError{
// 			CauseErr:   err,
// 			StatusCode: fiber.StatusConflict,
// 			Message:    "группа не найдена",
// 		}
// 	}
// 	if errors.Is(err, class.ErrNotFoundUser) {
// 		return &httperror.HTTPError{
// 			CauseErr:   err,
// 			StatusCode: fiber.StatusBadRequest,
// 			Message:    "преподаватель не найден",
// 		}
// 	}
// 	if errors.Is(err, class.ErrInvalidTeacher) {
// 		return &httperror.HTTPError{
// 			CauseErr:   err,
// 			StatusCode: fiber.StatusBadRequest,
// 			Message:    "неверный преподаватель",
// 		}
// 	}
// 	if errors.Is(err, class.ErrInvalidStud) {
// 		return &httperror.HTTPError{
// 			CauseErr:   err,
// 			StatusCode: fiber.StatusBadRequest,
// 			Message:    "неверный ученик",
// 		}
// 	}
// 	if err != nil {
// 		return err
// 	}
// 	return ctx.Status(fiber.StatusOK).JSON(classObj)
// }

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
	if err := inputPath.Parse(ctx, c.valid); err != nil {
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
	if err := inputPath.Parse(ctx, c.valid); err != nil {
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

// // @summary		Получение списка групп.
// // @description	Получение списка групп со всеми данными (ID и имена препода и учеников).
// // @router			/class [get]
// // @id				class-list
// // @tags			class
// // @accept			json
// // @produce		json
// // @security		JWTAccess
// // @param			listClassQuery	query		listClassQuery	false	"listClassQuery"
// // @success		200				{object}	listClassOut
// // @failure		401				"неверный токен (пустой, истекший или неверный формат)"
// func (c *ClassController) ListFull(ctx *fiber.Ctx) error {
// 	inputQuery := &listClassQuery{}
// 	if err := inputQuery.Parse(ctx, c.valid); err != nil {
// 		return err
// 	}
// 	// get pagination object OR nil
// 	pageParams := entity.NewPagination(inputQuery.Page, inputQuery.PerPage)

// 	// get classes
// 	classListResp, err := c.classUCClient.ListFull(pageParams)
// 	if err != nil {
// 		return fmt.Errorf("list: %w", err)
// 	}
// 	output := &listClassOut{
// 		Data:       classListResp,
// 		Pagination: pageParams,
// 	}
// 	return ctx.Status(fiber.StatusOK).JSON(output)
// }
