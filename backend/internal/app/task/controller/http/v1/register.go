// Package http/v1 is a first version of task HTTP-controller.
// It provides registers for task HTTP-routes and controller with handlers for them.
package v1

import (
	fiber "github.com/gofiber/fiber/v2"
)

const (
	_pathTeacher  = "/teacher"
	_pathStudent  = "/student"
	_pathTask     = "/task"
	_pathSolution = "/solution"
	_pathByID     = "/:id"
)

// RegisterEndpoints registers all task endpoints.
func RegisterEndpoints(router fiber.Router, controller *TaskController,
	controllerStudent *TaskControllerStudent, controllerTeacher *TaskControllerTeacher,
	mwJWTAccess fiber.Handler, mwStudent fiber.Handler, mwTeacher fiber.Handler) {

	teacherGroup := router.Group(_pathTeacher, mwJWTAccess, mwTeacher)
	{
		taskGroup := teacherGroup.Group(_pathTask)
		taskGroup.Post("/", controllerTeacher.Create)
		taskGroup.Patch(_pathByID, controllerTeacher.UpdateTask)
		taskGroup.Delete(_pathByID, controllerTeacher.DeleteTask)
		taskGroup.Get("/", controllerTeacher.TaskList)

		solutionGroup := teacherGroup.Group(_pathSolution)
		solutionGroup.Patch(_pathByID, controllerTeacher.UpdateSolution)
		solutionGroup.Delete(_pathByID, controllerTeacher.DeleteSolution)
		solutionGroup.Get("/", controllerTeacher.SolutionList)
	}

	studentGroup := router.Group(_pathStudent, mwJWTAccess, mwStudent)
	{
		solutionGroup := studentGroup.Group(_pathSolution)
		solutionGroup.Patch(_pathByID, controllerStudent.UpdateSolution)
		solutionGroup.Get("/", controllerStudent.SolutionList)
	}

	authGroup := router.Group(_pathSolution, mwJWTAccess)
	authGroup.Get("/get"+_pathByID, controller.Read)
}
