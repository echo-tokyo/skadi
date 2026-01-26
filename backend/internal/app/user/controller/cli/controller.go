package cli

import (
	"fmt"

	"skadi/backend/config"
	"skadi/backend/internal/app/user"
)

// UserController represents a controller for all auth routes.
type UserController struct {
	userUCAdmin user.UsecaseAdmin
}

// NewUserController returns a new instance of UserController.
func NewUserController(_ *config.Config, userUCAdmin user.UsecaseAdmin) *UserController {
	return &UserController{
		userUCAdmin: userUCAdmin,
	}
}

// CreateAdmin creates a new admin user.
func (c *UserController) CreateAdmin() error {
	var (
		inputBody          = &userBody{}
		username, password string
	)

	// ask for username
	fmt.Print("Enter username: ")
	fmt.Scan(&username)
	if err := inputBody.ParseUsername(username); err != nil {
		return err
	}
	// ask for password
	fmt.Println(`Password rules:
	1) At least 8 letters.
	2) At least 1 number.
	3) At least 1 upper case.
	4) At least 1 special character.`)
	fmt.Print("Enter password: ")
	fmt.Scan(&password)
	if err := inputBody.ParsePassword(password); err != nil {
		return err
	}

	// sign up a new admin
	userObj, err := c.userUCAdmin.CreateAdmin(inputBody.Username, inputBody.Password)
	if err != nil {
		return err
	}
	fmt.Printf("Admin user %q was created successfully!\n", userObj.Username)
	return nil
}
