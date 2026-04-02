package middleware

import (
	"fmt"
	"slices"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/service/server/errhandler"
	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
)

// AllowFunc represents a type that describes an Allow middleware.
type AllowFunc func(roles ...entity.Role) fiber.Handler

// Allow represents a middleware that provides access to resources for the given roles.
// Use this middleware after JWTAccess middleware.
func Allow(roles ...entity.Role) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		// parse user claims
		userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)
		// allow for roles
		fmt.Println()
		fmt.Printf("roles %T \n", roles)
		fmt.Println("roles", roles)
		fmt.Printf("userClaims.Role %T \n", userClaims.Role)
		fmt.Println("userClaims.Role", userClaims.Role)
		fmt.Println()
		if slices.Contains(roles, userClaims.Role) {
			fmt.Println("AAAAAA")
			return ctx.Next()
		}
		fmt.Println("BBB")
		// not found error for other roles
		err := fmt.Errorf("non-admin: %w", fiber.ErrNotFound)
		return errhandler.CustomErrorHandler(ctx, err)
	}
}

// Admin represents a middleware that provides access to resources only for admins.
// Use this middleware after JWTAccess middleware.
func Admin() fiber.Handler {
	return Allow(entity.Admin)
}

// Teacher represents a middleware that provides access to resources only for teachers.
// Use this middleware after JWTAccess middleware.
func Teacher() fiber.Handler {
	return Allow(entity.Teacher)
}

// Student represents a middleware that provides access to resources only for students.
// Use this middleware after JWTAccess middleware.
func Student() fiber.Handler {
	return Allow(entity.Student)
}
