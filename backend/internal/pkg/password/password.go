// Package password provides functions for passwords and its hashes.
package password

import (
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
