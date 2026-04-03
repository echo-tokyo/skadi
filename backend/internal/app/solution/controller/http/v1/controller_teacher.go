package v1

import (
	"errors"
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/solution"
	"skadi/backend/internal/app/task"
	"skadi/backend/internal/pkg/httperror"
	"skadi/backend/internal/pkg/serialize"
	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
	"skadi/backend/internal/pkg/validator"
)

// SolControllerTeacher represents a controller for solution routes accepted for teachers only.
type SolControllerTeacher struct {
	valid        validator.Validator
	solUCTeacher solution.UsecaseTeacher
}

// NewSolControllerTeacher returns a new instance of [SolControllerTeacher].
func NewSolControllerTeacher(solUCTeacher solution.UsecaseTeacher,
	valid validator.Validator) *SolControllerTeacher {

	return &SolControllerTeacher{
		valid:        valid,
		solUCTeacher: solUCTeacher,
	}
}

// @summary		Обновление решения. [Только преподаватель]
// @description	Частичное обновление решения (только переданные поля: статус - "готово"/"проверено" - и оценка) по его id.
// @router			/teacher/solution/{id} [patch]
// @id				teacher-solution-update
// @tags			solution
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
func (c *SolControllerTeacher) Update(ctx *fiber.Ctx) error {
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

	solObj, err := c.solUCTeacher.Update(userClaims.ID, inputPath.ID, newData)
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

// @summary		Удаление решения по id. [Только преподаватель]
// @description	Удаление решения (не задания целиком) по его id.
// @router			/solution/{id} [delete]
// @id				solution-delete
// @tags			solution
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			id	path	string	true	"ID решения"
// @success		204	"No Content"
// @failure		401	"неверный токен (пустой, истекший или неверный формат)"
// @failure		403	"доступ запрещён"
func (c *SolControllerTeacher) Delete(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputPath := &solutionIDPath{}
	if err := serialize.Deserialize(inputPath, ctx.ParamsParser, c.valid.Validate); err != nil {
		return err
	}
	err := c.solUCTeacher.DeleteByID(userClaims.ID, inputPath.ID)
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

// @summary		Получение списка решений [только преподаватель].
// @description	Получение списка решений для заданий конкретного преподавателя.
// @router			/teacher/solution [get]
// @id				teacher-solution-list
// @tags			solution
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			listSolutionTeacherQuery	query		listSolutionTeacherQuery	false	"listSolutionTeacherQuery"
// @success		200							{object}	listSolutionOut
// @failure		401							"неверный токен (пустой, истекший или неверный формат)"
func (c *SolControllerTeacher) List(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputQuery := &listSolutionTeacherQuery{}
	if err := serialize.Deserialize(inputQuery, ctx.QueryParser, c.valid.Validate); err != nil {
		return err
	}
	// get pagination object OR nil
	pageParams := inputQuery.PaginationQuery.ToPagination()

	// get solutions
	solListResp, err := c.solUCTeacher.GetManyForTeacher(userClaims.ID, inputQuery.Search,
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
