package entity

import "time"

// Task represents a task data.
type Task struct {
	// task id
	ID int `gorm:"primaryKey;autoIncrement" json:"id" validate:"required"`
	// task title
	Title string `json:"title" validate:"required"`
	// task description
	Desc string `gorm:"column:description" json:"description,omitempty" validate:"omitempty"`
	// task teacher id
	TeacherID int `json:"-"`
	// task creating datetime
	CreatedAt time.Time `json:"-"`

	// teacher object
	Teacher     *Profile `gorm:"-" json:"teacher,omitempty" validate:"omitempty"`
	TeacherUser *User    `gorm:"foreignKey:TeacherID;references:ID" json:"-"`
}

// TableName determines DB table name for the task object.
func (*Task) TableName() string {
	return "task"
}

// TaskUpdate represents a data to update task.
type TaskUpdate struct {
	// new task title
	Title *string
	// new task description
	Desc *string
}
