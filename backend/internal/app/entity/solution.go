package entity

import "time"

// Solution represents a task solution data.
type Solution struct {
	// solution id
	ID int `gorm:"primaryKey;autoIncrement" json:"id" validate:"required"`
	// solution task id
	TaskID int `json:"-"`
	// student id
	StudentID int `json:"-"`
	// solution status id
	StatusID int `json:"-"`
	// solution grade
	Grade *string `json:"grade,omitempty" validate:"omitempty"`
	// solution text answer
	Answer *string `json:"answer,omitempty" validate:"omitempty"`
	// last-update datetime of solution
	UpdatedAt *time.Time `json:"updated_at,omitempty" validate:"omitempty"`

	// task object
	Task *Task `gorm:"foreignKey:TaskID;references:ID" json:"task,omitempty" validate:"required"`
	// student object
	Student     *Profile `gorm:"-" json:"student,omitempty" validate:"omitempty"`
	StudentUser *User    `gorm:"foreignKey:StudentID;references:ID" json:"-"`
	// status object
	Status *Status `gorm:"foreignKey:StatusID;references:ID" json:"status" validate:"required"`
}

// TableName determines DB table name for the solution object.
func (*Solution) TableName() string {
	return "solution"
}

// SolutionUpdate represents a data to update solution.
type SolutionUpdate struct {
	// new status ID
	StatusID *int
	// new grade
	Grade *string
	// new answer
	Answer *string
	// last-update datetime of solution
	UpdatedAt *time.Time
}

// ToUpdatesMap generates map to update solution object.
func (s *SolutionUpdate) ToUpdatesMap() map[string]any {
	updates := make(map[string]any)
	// set new grade
	if s.Grade != nil {
		updates["grade"] = *s.Grade
	}
	// set new answer
	if s.Answer != nil {
		updates["answer"] = s.Answer
	}
	// set new teacher ID
	if s.StatusID != nil {
		updates["status_id"] = s.StatusID
	}
	return updates
}
