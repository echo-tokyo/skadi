// Package jwt provides JWT-token builder.
// Also it contains functions to parse JWT-tokens.
package jwt

import (
	"errors"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
)

const (
	_defaultAccessExpired  = 5 * time.Minute     // default access token exp duration  (5 minutes)
	_defaultRefreshExpired = 24 * 10 * time.Hour // default refresh token exp duration (10 days)
)

// Builder represents a JWT-token builder for obtaining tokens.
type Builder struct {
	secret         []byte
	accessExpires  time.Duration
	refreshExpires time.Duration
}

// Option represents an option for Builder initializing.
type Option func(*Builder)

// NewBuilder returns a new instance of Builder.
func NewBuilder(secret []byte, options ...Option) *Builder {
	builder := &Builder{
		secret:         secret,
		accessExpires:  _defaultAccessExpired,
		refreshExpires: _defaultRefreshExpired,
	}

	// apply all options to customize Builder
	for _, opt := range options {
		opt(builder)
	}
	return builder
}

// WithAccessExpires sets custom access token expiration duration.
func WithAccessExpires(exp time.Duration) Option {
	return func(b *Builder) {
		b.accessExpires = exp
	}
}

// WithRefreshExpires sets custom refresh token with given user claims expiration duration.
func WithRefreshExpires(exp time.Duration) Option {
	return func(b *Builder) {
		b.refreshExpires = exp
	}
}

// ObtainAccess obtains a new access token with given user claims and returns it.
func (b *Builder) ObtainAccess(userClaims *UserClaims) (string, error) {
	return b.obtain(b.accessExpires, userClaims)
}

// ObtainRefresh obtains a new refresh token with given user claims and returns it.
func (b *Builder) ObtainRefresh(userClaims *UserClaims) (string, error) {
	return b.obtain(b.refreshExpires, userClaims)
}

// obtain obtains a new token with given user claims and returns it.
func (b *Builder) obtain(ttl time.Duration, userClaims *UserClaims) (string, error) {
	claims := &TokenClaims{
		UserClaims: userClaims,
		Exp:        time.Now().UTC().Add(ttl).Unix(),
	}
	tokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := tokenObj.SignedString(b.secret)
	if err != nil {
		return "", err
	}
	return tokenStr, nil
}

// ParseTokenClaims parses user claims from token object from request.
func ParseTokenClaims(token *jwt.Token) (*TokenClaims, error) {
	claims, ok := token.Claims.(*TokenClaims)
	if !ok {
		return nil, errors.New("invalid claims")
	}
	return claims, nil
}
