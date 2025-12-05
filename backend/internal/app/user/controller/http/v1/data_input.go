package v1

// @description userBody represents a data for user auth (sign up).
type userBody struct {
	// user username
	Username string `json:"username" validate:"required,max=50" example:"user1" maxLength:"50"`
	// user password
	Password string `json:"password" validate:"required,min=8,max=40" example:"qwerty123" minLength:"8" maxLength:"40"`
	// user role (teacher or student)
	Role string `json:"role" validate:"required,oneof=teacher student" example:"teacher"`
}
