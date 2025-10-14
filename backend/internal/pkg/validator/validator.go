// Package validator provides interface to validate struct data by tags.
package validator

// Validator describes tool to validate any struct.
type Validator interface {
	Validate(s any) error
}
