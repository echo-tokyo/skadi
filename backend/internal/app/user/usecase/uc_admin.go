// Package usecase contains auth.UsecaseAdmin implementation.
package usecase

import (
	"fmt"
	"skadi/backend/config"
	"skadi/backend/internal/app/entity"
	"skadi/backend/internal/app/user"
	"skadi/backend/internal/pkg/jwt"
	"skadi/backend/internal/pkg/password"
)

// Ensure UCAdmin implements interface.
var _ user.UsecaseAdmin = (*UCAdmin)(nil)

// UCAdmin represents an auth usecase for client.
// It implements the auth.UsecaseAdmin interface.
type UCAdmin struct {
	cfg        *config.Config
	userRepoDB user.RepositoryDB
	jwtBuilder jwt.Builder
}

// NewUCAdmin returns a new instance of UCAdmin.
func NewUCAdmin(cfg *config.Config, userRepoDB user.RepositoryDB) *UCAdmin {
	return &UCAdmin{
		cfg:        cfg,
		userRepoDB: userRepoDB,
		jwtBuilder: *jwt.NewBuilder(cfg.Auth.Token.JWTSecret,
			jwt.WithAccessTTL(cfg.Auth.Token.AccessTTL),
			jwt.WithRefreshTTL(cfg.Auth.Token.RefreshTTL)),
	}
}

// SignUp creates a new user in the DB and returns them.
// Password is a raw (not hashed) password.
func (u *UCAdmin) SignUp(username string, passwd []byte) (*entity.User, error) {
	// hash password
	hashPasswd, err := password.Encode(passwd)
	if err != nil {
		return nil, fmt.Errorf("encode password: %w", err)
	}

	userObj := &entity.User{
		Username: username,
		Password: hashPasswd,
	}
	// create user
	err = u.userRepoDB.CreateUser(userObj)
	if err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}
	return userObj, nil
}
