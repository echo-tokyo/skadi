package entity

// Profile represents a user profile with additional user data.
type Profile struct {
	// profile id (user id)
	ID int `json:"-" gorm:"primaryKey"`
	// user full name
	Fullname string `json:"fullname"`
	// user address
	Address string `json:"address"`
	// extra data (for admin only)
	Extra string `json:"extra,omitempty"`
	// user contact info id
	ContactID int `json:"-"`
	// parent contact info id (for students)
	ParentContactID *int `json:"-"`

	Contact       *Contact `json:"contact" gorm:"foreignKey:ContactID"`
	ParentContact *Contact `json:"parent_contact,omitempty" gorm:"foreignKey:ParentContactID"`
}

// TableName determines DB table name for the profile object.
func (*Profile) TableName() string {
	return "profile"
}

// Contact represents a contact info for user profile.
type Contact struct {
	// contact id
	ID    int    `json:"-" gorm:"primaryKey;autoIncrement"`
	Phone string `json:"phone"`
	Email string `json:"email"`
}

// TableName determines DB table name for the contact object.
func (*Contact) TableName() string {
	return "contact"
}
