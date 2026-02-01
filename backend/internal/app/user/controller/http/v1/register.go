// Package http/v1 is a first version of user HTTP-controller.
// It provides registers for user HTTP-routes and controller with handlers for them.
package v1

import (
	fiber "github.com/gofiber/fiber/v2"
)

// RegisterEndpoints registers all user endpoints.
func RegisterEndpoints(router fiber.Router, controller *UserController,
	controllerAdmin *UserControllerAdmin, mwJWTAccess fiber.Handler, mwAdmin fiber.Handler) {

	adminGroup := router.Group("/admin/user", mwJWTAccess, mwAdmin)
	adminGroup.Post("/", controllerAdmin.Create)
	adminGroup.Get("/:id", controllerAdmin.Read)
	adminGroup.Put("/:id/profile", controllerAdmin.UpdateProfile)
	adminGroup.Delete("/:id", controllerAdmin.Delete)
	adminGroup.Get("/", controllerAdmin.List)
	adminGroup.Put("/:id/password", controllerAdmin.ChangePassword)

	authGroup := router.Group("/user/me", mwJWTAccess)
	authGroup.Get("/", controller.GetMe)
	authGroup.Put("/profile", controller.UpdateMeProfile)
	authGroup.Put("/password", controller.ChangePassword)
}
