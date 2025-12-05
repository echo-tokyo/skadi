package user

import "errors"

var (
	ErrAlreadyExists = errors.New("record already exists") // code 409
)
