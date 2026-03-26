package v1

import (
	"fmt"
	"skadi/backend/internal/app/task"
	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
	"skadi/backend/internal/pkg/validator"

	fiber "github.com/gofiber/fiber/v2"
)

// TaskControllerStudent represents a controller for task routes accepted for students only.
type TaskControllerStudent struct {
	valid         validator.Validator
	taskUCStudent task.UsecaseStudent
}

// NewTaskControllerStudent returns a new instance of TaskControllerStudent.
func NewTaskControllerStudent(taskUCStudent task.UsecaseStudent,
	valid validator.Validator) *TaskControllerStudent {

	return &TaskControllerStudent{
		valid:         valid,
		taskUCStudent: taskUCStudent,
	}
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

// @summary		Получение списка решений [только студент].
// @description	Получение списка решений конкретного студента.
// @router			/student/solution [get]
// @id				student-solution-list
// @tags			task
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			listSolutionStudentQuery	query		listSolutionStudentQuery	false	"listSolutionStudentQuery"
// @success		200							{object}	listSolutionOut
// @failure		401							"неверный токен (пустой, истекший или неверный формат)"
func (c *TaskControllerStudent) SolutionList(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputQuery := &listSolutionStudentQuery{}
	if err := inputQuery.Parse(ctx, c.valid); err != nil {
		return err
	}
	// get pagination object OR nil
	pageParams := inputQuery.PaginationQuery.ToPagination()

	// get solutions
	solListResp, err := c.taskUCStudent.GetSolutions(userClaims.ID,
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
