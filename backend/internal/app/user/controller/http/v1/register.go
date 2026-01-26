// Package http/v1 is a first version of user HTTP-controller.
// It provides registers for user HTTP-routes and controller with handlers for them.
package v1

import (
	fiber "github.com/gofiber/fiber/v2"
)

// RegisterEndpoints registers all user endpoints.
func RegisterEndpoints(router fiber.Router, controller *UserController,
	mwJWTAccess fiber.Handler, mwAdmin fiber.Handler) {

	adminGroup := router.Group("/admin/user", mwJWTAccess, mwAdmin)
	adminGroup.Post("/", controller.Create)
	adminGroup.Get("/:id", controller.Read)
	// adminGroup.Patch("/:id", controller.Update)
	// adminGroup.Delete("/:id", controller.Delete)
	adminGroup.Get("/", controller.List)

	// authGroup := router.Group("/user", mwJWTAccess)
	// authGroup.Get("/me", controller.GetMe)
	// authGroup.Patch("/me", controller.UpdateMe)
	// authGroup.Post("/change-password", controller.ChangePassword)
}
