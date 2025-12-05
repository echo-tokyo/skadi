package v1

import (
	fiber "github.com/gofiber/fiber/v2"

	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
)

// ExampleController represents a controller with example handlers to check auth.
type ExampleController struct{}

// NewExampleController returns a new instance of ExampleController.
func NewExampleController() *ExampleController {
	return &ExampleController{}
}

// Free represents a handler without any auth restriction.
func (c *ExampleController) Free(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusOK).JSON(map[string]string{
		"handler": "free",
		"access":  "any",
	})
}

// Restricted represents a handler with auth restriction (for all user roles).
func (c *ExampleController) Restricted(ctx *fiber.Ctx) error {
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)
	return ctx.Status(fiber.StatusOK).JSON(map[string]any{
		"userClaims": userClaims,
		"handler":    "restricted",
		"access":     "auth user",
	})
}

// Admin represents a handler for admins only.
func (c *ExampleController) Admin(ctx *fiber.Ctx) error {
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)
	return ctx.Status(fiber.StatusOK).JSON(map[string]any{
		"userClaims": userClaims,
		"handler":    "admin",
		"access":     "admin only",
	})
}

// Teacher represents a handler for teachers only.
func (c *ExampleController) Teacher(ctx *fiber.Ctx) error {
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)
	return ctx.Status(fiber.StatusOK).JSON(map[string]any{
		"userClaims": userClaims,
		"handler":    "teacher",
		"access":     "teacher only",
	})
}

// Student represents a handler for students only.
func (c *ExampleController) Student(ctx *fiber.Ctx) error {
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)
	return ctx.Status(fiber.StatusOK).JSON(map[string]any{
		"userClaims": userClaims,
		"handler":    "student",
		"access":     "student only",
	})
}
