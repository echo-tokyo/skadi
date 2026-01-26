package middleware

import (
	"fmt"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/internal/app/service/server/errhandler"
	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
)

const (
	_roleAdmin   = "admin"   // admin role name
	_roleTeacher = "teacher" // teacher role name
	_roleStudent = "student" // student role name
)

// Admin represents a middleware that provides access to resources only for admins.
// Use this middleware after JWTAccess middleware.
func Admin() fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		// parse user claims
		userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)
		// allow for admin
		if userClaims.Role == _roleAdmin {
			return ctx.Next()
		}
		// not found error for non-admin
		err := fmt.Errorf("non-admin: %w", fiber.ErrNotFound)
		return errhandler.CustomErrorHandler(ctx, err)
	}
}

// Teacher represents a middleware that provides access to resources only for teachers.
// Use this middleware after JWTAccess middleware.
func Teacher() fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		// parse user claims
		userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)
		// allow for teacher
		if userClaims.Role == _roleTeacher {
			return ctx.Next()
		}
		// not found error for non-teacher
		err := fmt.Errorf("non-teacher: %w", fiber.ErrNotFound)
		return errhandler.CustomErrorHandler(ctx, err)
	}
}

// Student represents a middleware that provides access to resources only for students.
// Use this middleware after JWTAccess middleware.
func Student() fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		// parse user claims
		userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)
		// allow for student
		if userClaims.Role == _roleStudent {
			return ctx.Next()
		}
		// not found error for non-student
		err := fmt.Errorf("non-student: %w", fiber.ErrNotFound)
		return errhandler.CustomErrorHandler(ctx, err)
	}
}
