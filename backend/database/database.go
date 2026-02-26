package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	host := os.Getenv("POSTGRES_HOST")
	if host == "" {
		host = "localhost" // for local running without docker-compose for backend yet
	}
	user := os.Getenv("POSTGRES_USER")
	if user == "" {
		user = "kuafor_user"
	}
	password := os.Getenv("POSTGRES_PASSWORD")
	if password == "" {
		password = "kuafor_password"
	}
	dbname := os.Getenv("POSTGRES_DB")
	if dbname == "" {
		dbname = "kuafor_db"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable TimeZone=Europe/Istanbul",
		host, user, password, dbname)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: \n", err)
	}

	log.Println("Connected to PostgreSQL Database")
	DB = db
}
