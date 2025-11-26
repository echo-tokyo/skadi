package utils

import (
	fiber "github.com/gofiber/fiber/v2"
	jwt "github.com/golang-jwt/jwt/v5"
)

const _accessTokenCtxKey = "accessToken" // key for the access token in the fiber ctx

// ParseTokenStringFromRequest parses token string from request.
func ParseTokenStringFromRequest(ctx *fiber.Ctx) string {
	return ctx.Locals(_accessTokenCtxKey).(*jwt.Token).Raw
}
