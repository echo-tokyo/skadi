// Package roles contains functions to check user roles.
package roles

import "skadi/backend/internal/app/entity"

const (
	Admin   = "admin"   // admin role for user
	Teacher = "teacher" // teacher role for user
	Student = "student" // student role for user
)

// IsAdmin returns true if user role is Admin.
func IsAdmin(user *entity.User) bool {
	return user.Role == Admin
}

// IsTeacher returns true if user role is Teacher.
func IsTeacher(user *entity.User) bool {
	return user.Role == Teacher
}

// IsStudent returns true if user role is Student.
func IsStudent(user *entity.User) bool {
	return user.Role == Student
}
