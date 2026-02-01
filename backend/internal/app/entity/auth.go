// Package entity contains all app entities used in the app's core logic.
package entity

import "time"

// User represents an app user with main user data.
type User struct {
	// user id
	ID int `json:"id" gorm:"primaryKey;autoIncrement"`
	// user username
	Username string `json:"username"`
	// user password hash
	Password []byte `json:"-"`
	// admin, teacher or student
	Role string `json:"role"`
	// user creating datetime
	CreatedAt time.Time `json:"-"`

	// user profile
	Profile *Profile `json:"profile,omitempty" gorm:"foreignKey:ID"`
}

// TableName determines DB table name for the user object.
func (*User) TableName() string {
	return "user"
}

// UserClaims represents a claims with user data for JWT-tokens.
type UserClaims struct {
	// user ID
	ID int `json:"id"`
	// admin, teacher or student
	Role string `json:"role"`
}

// Token represents a user token pair (access and refresh).
type Token struct {
	// access token
	Access string `json:"access"`
	// refresh token
	Refresh string `json:"-"`
}

// UserWithToken is a user object and a token object.
type UserWithToken struct {
	User  *User  `json:"user"`
	Token *Token `json:"token"`
}
