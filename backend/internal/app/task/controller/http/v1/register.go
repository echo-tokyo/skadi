// Package http/v1 is a first version of task HTTP-controller.
// It provides registers for task HTTP-routes and controller with handlers for them.
package v1

import (
	fiber "github.com/gofiber/fiber/v2"
)

// RegisterEndpoints registers all task endpoints.
func RegisterEndpoints(router fiber.Router, controller *TaskController,
	controllerStudent *TaskControllerStudent, controllerTeacher *TaskControllerTeacher,
	mwJWTAccess fiber.Handler, mwStudent fiber.Handler, mwTeacher fiber.Handler) {

	teacherGroup := router.Group("/teacher", mwJWTAccess, mwTeacher)
	{
		teacherGroup.Post("/task", controllerTeacher.Create)
		// teacherGroup.Patch("/solution/:id", controllerTeacher.Update)
		// teacherGroup.Delete("/solution/:id", controllerTeacher.Delete)
		// teacherGroup.Get("/solution", controllerTeacher.GetManyTeacher)
	}

	// studentGroup := router.Group("/student", mwJWTAccess, mwStudent)
	// {
	// 	studentGroup.Patch("/solution/:id", controllerStudent.Update)
	// 	studentGroup.Get("/solution", controllerStudent.GetManyStudent)
	// }

	authGroup := router.Group("/solution", mwJWTAccess)
	authGroup.Get("/get/:id", controller.Read)
}
