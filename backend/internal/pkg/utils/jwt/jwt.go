// Package jwt (utils) contains help-functions for JWT-token parsing.
package jwt

import (
	"errors"

	fiber "github.com/gofiber/fiber/v2"
	gojwt "github.com/golang-jwt/jwt/v5"

	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/pkg/jwt"
)

const (
	_tokenCtxKey      = "token"      // key for the JWT-token in the fiber ctx
	_userClaimsCtxKey = "userClaims" // key for the user claims in the fiber ctx
)

// ParseTokenStringFromRequest parses token string from request context.
// Token object must be saved to context by middleware.
func ParseTokenStringFromRequest(ctx *fiber.Ctx) string {
	tokenObj, ok := ctx.Locals(_tokenCtxKey).(*gojwt.Token)
	if !ok {
		return ""
	}
	return tokenObj.Raw
}

// ParseUserClaimsFromRequest parses user claims from request context.
// User claims must be saved to context by middleware.
func ParseUserClaimsFromRequest(ctx *fiber.Ctx) *entity.UserClaims {
	userClaims, ok := ctx.Locals(_userClaimsCtxKey).(*entity.UserClaims)
	if !ok {
		return nil
	}
	return userClaims
}

// SaveUserClaimsToContext parses token user claims from request and
// saves them to fiber context.
func SaveUserClaimsToContext(ctx *fiber.Ctx) (*entity.UserClaims, error) {
	tokenObj, ok := ctx.Locals(_tokenCtxKey).(*gojwt.Token)
	if !ok {
		return nil, errors.New("invalid token objects")
	}
	tokenClaims, ok := tokenObj.Claims.(*jwt.TokenClaims)
	if !ok {
		return nil, errors.New("invalid token claims object")
	}
	userClaims, ok := tokenClaims.ExtraClaims.(*entity.UserClaims)
	if !ok {
		return nil, errors.New("invalid user claims object")
	}
	return userClaims, nil
}
