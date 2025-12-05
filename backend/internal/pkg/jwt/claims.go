package jwt

import (
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
)

// TokenClaims represents all token claims for JWT-token.
// It includes token expiration datetime in UNIX-format and any extra claims.
type TokenClaims struct {
	Exp         int64 `json:"exp"`
	ExtraClaims any
}

// GetSubject implements jwt.Claims.
func (t *TokenClaims) GetSubject() (string, error) { return "", nil }

// GetExpirationTime implements jwt.Claims.
func (t *TokenClaims) GetExpirationTime() (*jwt.NumericDate, error) {
	return &jwt.NumericDate{Time: time.Unix(t.Exp, 0)}, nil
}

// GetIssuedAt implements jwt.Claims.
func (*TokenClaims) GetIssuedAt() (*jwt.NumericDate, error) { return nil, nil }

// GetNotBefore implements jwt.Claims.
func (*TokenClaims) GetNotBefore() (*jwt.NumericDate, error) { return nil, nil }

// GetIssuer implements jwt.Claims.
func (*TokenClaims) GetIssuer() (string, error) { return "", nil }

// GetAudience implements jwt.Claims.
func (*TokenClaims) GetAudience() (jwt.ClaimStrings, error) { return nil, nil }
