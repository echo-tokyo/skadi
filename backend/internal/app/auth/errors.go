package auth

import "errors"

var (
	ErrForbidden       = errors.New("forbidden")        // code 403
	ErrInvalidPassword = errors.New("invalid password") // code 401
	ErrInvalidToken    = errors.New("invalid token")    // code 401
	ErrNotFound        = errors.New("record not found") // code 404
)
