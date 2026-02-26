package models

import (
	"time"

	"gorm.io/gorm"
)

type Branch struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:255;not null" json:"name"`
	Address   string         `gorm:"type:text" json:"address"`
	Phone     string         `gorm:"size:50" json:"phone"`
	Latitude  float64        `json:"latitude"`
	Longitude float64        `json:"longitude"`
	Rating      float64        `gorm:"default:0" json:"rating"`
	Type        string         `gorm:"size:100" json:"type"`
	HeroImage   string         `gorm:"type:text" json:"hero_image"`
	IsSponsored bool           `gorm:"default:false" json:"is_sponsored"`
	Distance    float64        `gorm:"-" json:"distance,omitempty"` // Computed distance in kilometers
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type User struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	KeycloakID string         `gorm:"size:255;uniqueIndex;not null" json:"keycloak_id"`
	Role       string         `gorm:"size:50;not null" json:"role"` // e.g. "super_admin", "branch_admin", "staff"
	BranchID   *uint          `json:"branch_id"`
	Branch     Branch         `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
	Name       string         `gorm:"size:255;not null" json:"name"`
	Email      string         `gorm:"size:255;uniqueIndex;not null" json:"email"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

type Customer struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	KeycloakID   *string        `gorm:"size:255;uniqueIndex" json:"keycloak_id,omitempty"` // Nullable for customers who don't register online
	Name         string         `gorm:"size:255;not null" json:"name"`
	Phone        string         `gorm:"size:50;uniqueIndex;not null" json:"phone"`
	Email        string         `gorm:"size:255" json:"email"`
	LanguagePref string         `gorm:"size:10;default:'TR'" json:"language_pref"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

type Service struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	BranchID        uint           `not null json:"branch_id"`
	Branch          Branch         `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
	Name            string         `gorm:"size:255;not null" json:"name"`
	DurationMinutes int            `gorm:"not null" json:"duration_minutes"`
	Price           float64        `gorm:"type:decimal(10,2);not null" json:"price"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

type Appointment struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	BranchID   uint           `not null json:"branch_id"`
	Branch     Branch         `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
	UserID     uint           `not null json:"user_id"` // Standardizer staff
	User       User           `gorm:"foreignKey:UserID" json:"staff,omitempty"`
	CustomerID uint           `not null json:"customer_id"`
	Customer   Customer       `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
	ServiceID  uint           `not null json:"service_id"`
	Service    Service        `gorm:"foreignKey:ServiceID" json:"service,omitempty"`
	StartTime  time.Time      `gorm:"not null" json:"start_time"`
	EndTime    time.Time      `gorm:"not null" json:"end_time"`
	Status     string         `gorm:"size:50;default:'pending'" json:"status"` // pending, confirmed, completed, cancelled
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

type Ticket struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	AppointmentID uint           `not null json:"appointment_id"`
	Appointment   Appointment    `gorm:"foreignKey:AppointmentID" json:"appointment,omitempty"`
	TotalAmount   float64        `gorm:"type:decimal(10,2);not null" json:"total_amount"`
	PaymentStatus string         `gorm:"size:50;default:'unpaid'" json:"payment_status"` // unpaid, paid, partially_paid
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// Migrate function to auto-migrate the schema
func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&Branch{},
		&User{},
		&Customer{},
		&Service{},
		&Appointment{},
		&Ticket{},
	)
}
