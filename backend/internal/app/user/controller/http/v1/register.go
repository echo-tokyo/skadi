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
	adminGroup.Post("/sign-up", controller.SignUp)
}
