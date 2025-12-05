package middleware

import (
	"errors"

	fiberjwt "github.com/gofiber/contrib/jwt"
	fiber "github.com/gofiber/fiber/v2"
	jwt "github.com/golang-jwt/jwt/v5"

	"skadi/backend/config"
	"skadi/backend/internal/app/auth"
	"skadi/backend/internal/app/service/server/errhandler"
	"skadi/backend/internal/pkg/httperror"
	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
)

const (
	_tokenCtxKey      = "token"      // key for the JWT-token in the fiber ctx
	_userClaimsCtxKey = "userClaims" // key for the user claims in the fiber ctx
)

// JWTAccess parses access token from request header to context and validates it.
func JWTAccess(cfg *config.Config) fiber.Handler {
	return fiberjwt.New(fiberjwt.Config{
		TokenLookup:    "header:Authorization",
		ContextKey:     _tokenCtxKey,
		SigningKey:     fiberjwt.SigningKey{Key: cfg.Auth.Token.JWTSecret},
		ErrorHandler:   jwtErrorHandler(),
		SuccessHandler: accessSuccessHandler(),
	})
}

// JWTRefresh parses refresh token from request cookies to context and validates it.
func JWTRefresh(cfg *config.Config, authUC auth.UsecaseMiddleware) fiber.Handler {
	return fiberjwt.New(fiberjwt.Config{
		TokenLookup:    "cookie:refresh",
		ContextKey:     _tokenCtxKey,
		SigningKey:     fiberjwt.SigningKey{Key: cfg.Auth.Token.JWTSecret},
		ErrorHandler:   jwtErrorHandler(),
		SuccessHandler: refreshSuccessHandler(authUC),
	})
}

// jwtErrorHandler represents an error handler executed when token validation fails.
func jwtErrorHandler() fiber.ErrorHandler {
	return func(ctx *fiber.Ctx, err error) error {
		switch {
		// if token has expired
		case errors.Is(err, jwt.ErrTokenExpired):
			err = &httperror.HTTPError{
				CauseErr:   err,
				StatusCode: fiber.StatusForbidden,
				Message:    "token: expired",
			}
		// if token is missing
		case errors.Is(err, fiberjwt.ErrJWTMissingOrMalformed):
			err = &httperror.HTTPError{
				CauseErr:   err,
				StatusCode: fiber.StatusUnauthorized,
				Message:    "token: missing or malformed",
			}
		}
		return errhandler.CustomErrorHandler(ctx, err)
	}
}

// accessSuccessHandler is a success handler for JWTAccess middleware.
// It parses user claims to fiber context.
func accessSuccessHandler() fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		// parse user claims and save them to context
		userClaims, err := utilsjwt.SaveUserClaimsToContext(ctx)
		if err != nil {
			return errhandler.CustomErrorHandler(ctx, err)
		}
		ctx.Locals(_userClaimsCtxKey, userClaims)
		return ctx.Next()
	}
}

// refreshSuccessHandler is a success handler for JWTRefresh middleware.
// It restricts user access with blacklisted token and
// parses user claims to fiber context.
func refreshSuccessHandler(authUC auth.UsecaseMiddleware) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		token := utilsjwt.ParseTokenStringFromRequest(ctx)
		// check token is blacklisted
		err := authUC.BlockIfBlacklist(token)
		if err != nil && errors.Is(err, auth.ErrForbidden) {
			return errhandler.CustomErrorHandler(ctx, &httperror.HTTPError{
				CauseErr:   err,
				StatusCode: fiber.StatusForbidden,
				Message:    "token: invalid",
			})
		}
		if err != nil {
			return errhandler.CustomErrorHandler(ctx, err)
		}

		// parse user claims and save them to context
		userClaims, err := utilsjwt.SaveUserClaimsToContext(ctx)
		if err != nil {
			return errhandler.CustomErrorHandler(ctx, err)
		}
		ctx.Locals(_userClaimsCtxKey, userClaims)
		return ctx.Next()
	}
}
