// Package password provides functions for passwords and its hashes.
package password

import (
	"regexp"

	"golang.org/x/crypto/bcrypt"
)

// Encode returns hashed password.
func Encode(password []byte) ([]byte, error) {
	hash, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	if err != nil {
		// probably, password is too long
		return nil, err
	}
	return hash, nil
}

// IsCorrect returns true if the given password equals to its hash from DB.
func IsCorrect(password, hash []byte) bool {
	err := bcrypt.CompareHashAndPassword(hash, password)
	return err == nil
}

// Strong returns true if password is strong. Strength rules:
// 1) At least 8 letters.
// 2) At least 1 number.
// 3) At least 1 upper case.
// 4) At least 1 special character.
func Strong(password string) bool {
	var (
		matched bool
		err     error
		tests   = []string{".{8,}", "[a-z]", "[0-9]", "[A-Z]", "[^\\d\\w]"}
	)

	for _, test := range tests {
		matched, err = regexp.MatchString(test, password)
		if err != nil {
			return false
		}
		if !matched {
			return false
		}
	}
	return true
}
