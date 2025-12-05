package v1

import (
	"errors"
	"fmt"
	"log/slog"

	fiber "github.com/gofiber/fiber/v2"

	"skadi/backend/config"
	"skadi/backend/internal/app/auth"
	"skadi/backend/internal/pkg/cookie"
	"skadi/backend/internal/pkg/httperror"
	utilsjwt "skadi/backend/internal/pkg/utils/jwt"
	"skadi/backend/internal/pkg/validator"
)

const _refreshTokenCookie = "refresh" // key to store refresh token in cookies

// AuthController represents a controller for all auth routes.
type AuthController struct {
	validator     validator.Validator
	authUCClient  auth.UsecaseClient
	cookieBuilder *cookie.Builder
}

// NewAuthController returns a new instance of AuthController.
func NewAuthController(cfg *config.Config, authUCClient auth.UsecaseClient,
	valid validator.Validator) *AuthController {

	return &AuthController{
		validator:    valid,
		authUCClient: authUCClient,
		cookieBuilder: cookie.NewBuilder(cfg.Auth.Token.RefreshTTL,
			cookie.WithPath(cfg.Auth.Cookie.Path),
			cookie.WithSecure(cfg.Auth.Cookie.Secure),
			cookie.WithHTTPOnly(cfg.Auth.Cookie.HTTPOnly),
			cookie.WithSameSite(cfg.Auth.Cookie.SameSite)),
	}
}

// @summary		Вход для юзера
// @description	Вход для существующего юзера по логину и паролю
// @router			/auth/login [post]
// @id				auth-login
// @tags			auth
// @accept			json
// @produce		json
// @param			authBody	body		authBody	true	"authBody"
// @success		200			{object}	entity.UserWithToken
// @failure		401			"Неверный пароль для учетной записи юзера"
// @failure		404			"Юзер с введенным логином не найден"
func (c *AuthController) Login(ctx *fiber.Ctx) error {
	inputBody := &authBody{}
	// parse JSON-body
	if err := ctx.BodyParser(inputBody); err != nil {
		return err
	}
	// validate parsed data
	if err := c.validator.Validate(inputBody); err != nil {
		return err
	}

	// log in existing user
	userWithToken, err := c.authUCClient.LogIn(inputBody.Username, []byte(inputBody.Password))
	if err != nil && errors.Is(err, auth.ErrInvalidPassword) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusUnauthorized,
			Message:    "неверный пароль",
		}
	}
	if err != nil && errors.Is(err, auth.ErrNotFound) {
		return &httperror.HTTPError{
			CauseErr:   err,
			StatusCode: fiber.StatusNotFound,
			Message:    "пользователь с введенным логином не найден",
		}
	}
	if err != nil {
		return err
	}
	slog.Debug("user login",
		"user", userWithToken.User,
		"token", userWithToken.Token)
	// add refresh token to cookies
	ctx.Cookie(c.cookieBuilder.Create(_refreshTokenCookie, userWithToken.Token.Refresh))
	return ctx.Status(fiber.StatusOK).JSON(userWithToken)
}

// @summary		Получение access токена
// @description	Получение нового access токена по данному refresh токену из cookie.
// @router			/auth/private/obtain [get]
// @id				auth-private-obtain
// @tags			auth
// @produce		json
// @security		JWTRefresh
// @success		200 {object}	entity.Token
// @failure		401	"Пустой или неправильный токен"
// @failure		403	"Истекший или невалидный токен"
func (c *AuthController) Obtain(ctx *fiber.Ctx) error {
	// parse user claims
	userClaims := utilsjwt.ParseUserClaimsFromRequest(ctx)
	// generate access token
	token, err := c.authUCClient.ObtainAccess(userClaims)
	if err != nil {
		return fmt.Errorf("obtain access token: %w", err)
	}
	return ctx.Status(fiber.StatusOK).JSON(token)
}

// @summary		Выход юзера
// @description	Выход юзера (помещение refresh токена юзера в черный список)
// @router			/auth/private/logout [get]
// @id				auth-private-logout
// @tags			auth
// @security		JWTRefresh
// @success		204	"No Content"
// @failure		401	"Пустой или неправильный токен"
// @failure		403	"Истекший или невалидный токен"
func (c *AuthController) Logout(ctx *fiber.Ctx) error {
	// parse access token
	token := utilsjwt.ParseTokenStringFromRequest(ctx)

	// put token to blacklist
	if err := c.authUCClient.LogOut(token); err != nil {
		return err
	}
	// remove refresh token from cookies
	ctx.Cookie(c.cookieBuilder.Clear(_refreshTokenCookie))
	return ctx.Status(fiber.StatusNoContent).Send(nil)
}
