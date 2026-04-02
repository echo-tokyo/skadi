// Package http/v1 is a first version of task HTTP-controller.
// It provides registers for task HTTP-routes and controller with handlers for them.
package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/service/server/middleware"
)

// RegisterEndpoints registers all task endpoints.
func RegisterEndpoints(router fiber.Router, controller *TaskController,
	controllerStudent *TaskControllerStudent, controllerTeacher *TaskControllerTeacher,
	mwJWTAccess fiber.Handler, mwAllow middleware.AllowFunc) {

	mwTeacherOnly := mwAllow(entity.Teacher)
	mwStudentOnly := mwAllow(entity.Student)
	mwTeacherStudent := mwAllow(entity.Teacher, entity.Student)

	authGroup := router.Group("/", mwJWTAccess)

	taskAuthGroup := authGroup.Group("/task")
	taskAuthGroup.Post("/", mwTeacherOnly, controllerTeacher.Create)
	taskAuthGroup.Get("/", mwTeacherOnly, controllerTeacher.TaskList)
	// taskAuthGroup.Get("/:id", mwTeacherOnly, controllerTeacher.ReadTask)
	taskAuthGroup.Patch("/:id", mwTeacherOnly, controllerTeacher.UpdateTask)
	taskAuthGroup.Delete("/:id", mwTeacherOnly, controllerTeacher.DeleteTask)

	authGroup.Get("/teacher/solution", mwTeacherOnly, controllerTeacher.SolutionList)
	authGroup.Get("/student/solution", mwStudentOnly, controllerStudent.SolutionList)
	authGroup.Get("/solution/:id", mwTeacherStudent, controller.ReadSolution)
	authGroup.Patch("/teacher/solution/:id", mwTeacherOnly, controllerTeacher.UpdateSolution)
	authGroup.Patch("/student/solution/:id", mwStudentOnly, controllerStudent.UpdateSolution)
	authGroup.Delete("/solution/:id", mwTeacherOnly, controllerTeacher.DeleteSolution)
}
