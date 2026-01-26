package cli

import (
	"errors"
	"skadi/backend/internal/pkg/password"
)

const _usernameMaxLen = 50 // max length of user username

// userBody represents a data to sign up new user.
type userBody struct {
	// user username
	Username string
	// user password
	Password []byte
}

// ParseUsername parses user username from given string and validates it.
func (a *userBody) ParseUsername(raw string) error {
	if len(raw) > _usernameMaxLen {
		return errors.New("username is too long: accepted 50 (or less) simbols length")
	}
	a.Username = raw
	return nil
}

// ParsePassword parses user password from given string and validates it.
func (a *userBody) ParsePassword(raw string) error {
	if !password.Strong(raw) {
		return errors.New("weak password")
	}
	a.Password = []byte(raw)
	return nil
}
