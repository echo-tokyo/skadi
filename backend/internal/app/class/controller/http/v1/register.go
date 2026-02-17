// Package http/v1 is a first version of class HTTP-controller.
// It provides registers for class HTTP-routes and controller with handlers for them.
package v1

import (
	fiber "github.com/gofiber/fiber/v2"
)

// RegisterEndpoints registers all class endpoints.
func RegisterEndpoints(router fiber.Router, controller *ClassController,
	controllerAdmin *ClassControllerAdmin, mwJWTAccess fiber.Handler, mwAdmin fiber.Handler) {

	adminGroup := router.Group("/admin/class", mwJWTAccess, mwAdmin)
	{
		adminGroup.Post("/", controllerAdmin.Create)
		// 	adminGroup.Patch("/one/:id", controllerAdmin.Update)
		// 	adminGroup.Delete("/one/:id", controllerAdmin.Delete)
	}

	authGroup := router.Group("/class", mwJWTAccess)
	{
		authGroup.Get("/one/:id", controller.Read)
		authGroup.Get("/short", controller.ListShort)
		authGroup.Get("/", controller.ListFull)
	}
}
