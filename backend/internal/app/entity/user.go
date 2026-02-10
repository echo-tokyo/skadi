// Package entity contains all app entities used in the app's core logic.
package entity

import "time"

// User represents an app user with main user data.
type User struct {
	// user id
	ID int `gorm:"primaryKey;autoIncrement" json:"id" validate:"required"`
	// user username
	Username string `json:"username" validate:"required"`
	// user password hash
	Password []byte `json:"-"`
	// admin, teacher or student
	Role string `json:"role" validate:"required"`
	// user creating datetime
	CreatedAt time.Time `json:"-"`
	// student's class id
	ClassID int `json:"-"`

	// user profile
	Profile *Profile `gorm:"foreignKey:ID" json:"profile,omitempty" validate:"omitempty"`
	// student's class
	Class *Class `gorm:"foreignKey:ClassID" json:"class" validate:"omitempty"`
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
	Access string
	// refresh token
	Refresh string
}

// UserWithToken is a user object and a token object.
type UserWithToken struct {
	User  *User
	Token *Token `json:"-"`
}
