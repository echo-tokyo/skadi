package jwt

import (
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
)

// UserClaims represents user claims for JWT-token.
type UserClaims struct {
	// user ID
	UserID string `json:"sub"`
	// true if user is admin
	IsAdmin bool `json:"is_admin"`
	// true if user is teacher
	IsTeacher bool `json:"is_teacher"`
	// true if user is student
	IsStudent bool `json:"is_student"`
}

// UserClaims represents all token claims for JWT-token.
// It includes user claims and token expiration datetime in UNIX-format.
type TokenClaims struct {
	*UserClaims
	Exp int64 `json:"exp"`
}

// GetSubject implements jwt.Claims.
func (t *TokenClaims) GetSubject() (string, error) {
	return t.UserID, nil
}

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
