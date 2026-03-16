package task

import "errors"

var (
	ErrInvalidData    = errors.New("invalid data")          // code 400
	ErrInvalidTeacher = errors.New("invalid teacher")       // code 400
	ErrInvalidStudent = errors.New("invalid student")       // code 400
	ErrNotFoundUser   = errors.New("record not found")      // code 404
	ErrNotFound       = errors.New("record not found")      // code 404
	ErrAlreadyExists  = errors.New("record already exists") // code 409
	ErrConflict       = errors.New("conflict")              // code 409
)
