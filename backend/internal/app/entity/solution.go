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
	StatusID *int `json:"-"`
	// solution grade
	Grade *string `json:"grade,omitempty" validate:"omitempty"`
	// solution text answer
	Answer *string `json:"answer,omitempty" validate:"omitempty"`
	// task creating datetime
	UpdatedAt time.Time `json:"updated_at" validate:"required"`

	// task object
	Task *Task `gorm:"foreignKey:TaskID;references:ID" json:"task" validate:"required"`
	// student object
	Student     *Profile `gorm:"-" json:"student" validate:"required"`
	StudentUser *User    `gorm:"foreignKey:StudentID;references:ID" json:"-"`
	// status object
	Status *Status `gorm:"foreignKey:StudentID;references:ID" json:"status,omitempty" validate:"omitempty"`
}

// TableName determines DB table name for the solution object.
func (*Solution) TableName() string {
	return "solution"
}
