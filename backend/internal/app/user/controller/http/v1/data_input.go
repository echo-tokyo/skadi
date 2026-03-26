package v1

// @description updatePasswordBody represents a data to update user password by the user himself.
type updatePasswordBody struct {
	// old user password
	OldPasswd string `json:"old" validate:"required,min=8,max=40" example:"qwerty123" minLength:"8" maxLength:"40"`
	// new user password
	NewPasswd string `json:"new" validate:"required,min=8,max=40" example:"ytrewq321" minLength:"8" maxLength:"40"`
}
