package user

import "skadi/backend/internal/app/entity"

// UsecaseAdmin describes all user usecases for admin panel.
type UsecaseAdmin interface {
	// SignUp creates a new user in the DB and returns them.
	// Password is a raw (not hashed) password.
	SignUp(username string, password []byte) (*entity.User, error)
}
