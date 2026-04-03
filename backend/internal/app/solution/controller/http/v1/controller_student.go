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

// SolControllerStudent represents a controller for solution routes accepted for students only.
type SolControllerStudent struct {
	valid        validator.Validator
	solUCStudent solution.UsecaseStudent
}

// NewSolControllerStudent returns a new instance of [SolControllerStudent].
func NewSolControllerStudent(solUCStudent solution.UsecaseStudent,
	valid validator.Validator) *SolControllerStudent {

	return &SolControllerStudent{
		valid:        valid,
		solUCStudent: solUCStudent,
	}
}

// @summary		Обновление решения. [Только ученик]
// @description	Частичное обновление решения (только переданные поля: статус, кроме "проверено", ответ, файл ответа) по его id.
// @router			/solution/for-student/{id} [patch]
// @id				solution-for-student-update
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
func (c *SolControllerStudent) Update(ctx *fiber.Ctx) error {
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
		Answer:   inputBody.Answer,
	}

	solObj, err := c.solUCStudent.Update(userClaims.ID, inputPath.ID, newData)
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

// @summary		Получение списка решений. [Только ученик]
// @description	Получение списка решений конкретного ученика.
// @router			/solution/for-student [get]
// @id				solution-for-student-list
// @tags			solution
// @accept			json
// @produce		json
// @security		JWTAccess
// @param			listSolutionStudentQuery	query		listSolutionStudentQuery	false	"listSolutionStudentQuery"
// @success		200							{object}	listSolutionOut
// @failure		401							"неверный токен (пустой, истекший или неверный формат)"
func (c *SolControllerStudent) List(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)

	inputQuery := &listSolutionStudentQuery{}
	if err := serialize.Deserialize(inputQuery, ctx.QueryParser, c.valid.Validate); err != nil {
		return err
	}
	// get pagination object OR nil
	pageParams := inputQuery.PaginationQuery.ToPagination()

	// get solutions
	solListResp, err := c.solUCStudent.GetManyForStudent(userClaims.ID,
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
