// Package http/v1 is a first version of user HTTP-controller.
// It provides registers for user HTTP-routes and controller with handlers for them.
package v1

import (
	fiber "github.com/gofiber/fiber/v2"
)

// RegisterEndpoints registers all user endpoints.
func RegisterEndpoints(router fiber.Router, controllerAdmin *UserControllerAdmin,
	mwJWTAccess fiber.Handler, mwAdmin fiber.Handler) {

	adminGroup := router.Group("/admin/user", mwJWTAccess, mwAdmin)
	adminGroup.Post("/", controllerAdmin.Create)
	adminGroup.Get("/:id", controllerAdmin.Read)
	adminGroup.Put("/:id/profile", controllerAdmin.UpdateProfile)
	adminGroup.Delete("/:id", controllerAdmin.Delete)
	adminGroup.Get("/", controllerAdmin.List)
	adminGroup.Put("/:id/password", controllerAdmin.ChangePassword)

	// authGroup := router.Group("/user", mwJWTAccess)
	// authGroup.Get("/me", controller.GetMe)
	// authGroup.Patch("/me", controller.UpdateMe)
	// authGroup.Post("/change-password", controller.ChangePassword)
}
