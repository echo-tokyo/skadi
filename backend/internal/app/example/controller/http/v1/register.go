// Package http/v1 is a first version of example HTTP-controller.
// It provides registers for example HTTP-routes and controller with handlers for them.
package v1

import (
	fiber "github.com/gofiber/fiber/v2"
)

// RegisterEndpoints registers all example endpoints.
func RegisterEndpoints(router fiber.Router, controller *ExampleController,
	mwJWTAccess fiber.Handler, mwAdmin fiber.Handler,
	mwTeacher fiber.Handler, mwStudent fiber.Handler) {

	group := router.Group("/example")
	// public
	group.Get("/free", controller.Free)
	// authenticated only
	authGroup := group.Use(mwJWTAccess)
	authGroup.Get("/restricted", controller.Restricted)
	authGroup.Get("/admin", mwAdmin, controller.Admin)       // admin only
	authGroup.Get("/teacher", mwTeacher, controller.Teacher) // teacher only
	authGroup.Get("/student", mwStudent, controller.Student) // student only
}
