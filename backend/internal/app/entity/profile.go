package entity

// Profile represents a user profile with additional user data.
type Profile struct {
	// profile id (user id)
	ID int `gorm:"primaryKey" json:"-"`
	// user full name
	Fullname string `json:"fullname" validate:"required"`
	// user address
	Address string `json:"address" validate:"required"`
	// extra data (for admin only)
	Extra *string `json:"extra,omitempty" validate:"omitempty"`
	// user contact info id
	ContactID int `json:"-"`
	// parent contact info id (for students)
	ParentContactID *int `json:"-"`

	Contact       *Contact `gorm:"foreignKey:ContactID" json:"contact" validate:"required"`
	ParentContact *Contact `gorm:"foreignKey:ParentContactID" json:"parent_contact,omitempty" validate:"omitempty"`
}

// TableName determines DB table name for the profile object.
func (*Profile) TableName() string {
	return "profile"
}

// Contact represents a contact info for user profile.
type Contact struct {
	// contact id
	ID    int    `gorm:"primaryKey;autoIncrement" json:"-"`
	Phone string `json:"phone" validate:"required"`
	Email string `json:"email" validate:"required"`
}

// TableName determines DB table name for the contact object.
func (*Contact) TableName() string {
	return "contact"
}
