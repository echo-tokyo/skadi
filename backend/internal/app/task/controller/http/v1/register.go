// Package http/v1 is a first version of task HTTP-controller.
// It provides registers for task HTTP-routes and controller with handlers for them.
package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/service/server/middleware"
)

// RegisterEndpoints registers all task endpoints.
func RegisterEndpoints(router fiber.Router, controllerTeacher *TaskControllerTeacher,
	mwJWTAccess fiber.Handler, mwAllow middleware.AllowFunc) {

	mwTeacherOnly := mwAllow(entity.Teacher)
	authGroup := router.Group("/", mwJWTAccess)

	taskAuthGroup := authGroup.Group("/task")
	taskAuthGroup.Post("/", mwTeacherOnly, controllerTeacher.Create)
	taskAuthGroup.Get("/", mwTeacherOnly, controllerTeacher.List)
	taskAuthGroup.Get("/:id", mwTeacherOnly, controllerTeacher.Read)
	taskAuthGroup.Patch("/:id", mwTeacherOnly, controllerTeacher.Update)
	taskAuthGroup.Delete("/:id", mwTeacherOnly, controllerTeacher.Delete)
}
