package entity

// Class represents a student class data.
type Class struct {
	// class id
	ID int `gorm:"primaryKey" json:"id" validate:"required"`
	// class name
	Name string `json:"name" validate:"required"`
	// teacher id
	TeacherID int `json:"-"`
	// class schedule
	Schedule *string `json:"schedule,omitempty" validate:"omitempty"`

	Teacher  *User   `gorm:"foreignKey:TeacherID" json:"teacher,omitempty" validate:"omitempty"`
	Students []*User `gorm:"foreignKey:ClassID" json:"students,omitempty" validate:"omitempty"`
}

// TableName determines DB table name for the class object.
func (*Class) TableName() string {
	return "class"
}
