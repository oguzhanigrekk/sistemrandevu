package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/ahmetmerttirpan/kuafor-backend/database"
	"github.com/ahmetmerttirpan/kuafor-backend/handlers"
	"github.com/ahmetmerttirpan/kuafor-backend/middleware"
	"github.com/ahmetmerttirpan/kuafor-backend/models"
)

func main() {
	// Initialize Database
	database.ConnectDB()

	// Run Automigrations
	err := models.Migrate(database.DB)
	if err != nil {
		log.Fatal("Failed to run migrations: \n", err)
	}

	app := fiber.New()
	
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, http://127.0.0.1:3000, http://sistemrandevu.biasdanismanlik.com, https://sistemrandevu.biasdanismanlik.com",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Initialize JWKS for Keycloak
	middleware.SetupJWKS()

	// Logger middleware
	app.Use(logger.New())

	// Public Healthcheck endpoint
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "success",
			"message": "Kuafor & Guzellik Merkezi API is running!",
		})
	})

	// Public API group
	publicAPI := app.Group("/api/public")
	publicAPI.Get("/branches/nearby", handlers.GetNearbyBranches)

	// Protected endpoints group
	api := app.Group("/api", middleware.Protected())
	api.Get("/profile", func(c *fiber.Ctx) error {
		// Inside the route, logic to extract user from token goes here
		return c.JSON(fiber.Map{
			"status":  "success",
			"message": "You have accessed a protected route.",
		})
	})

	log.Println("Starting server on port 3000...")
	log.Fatal(app.Listen(":3000"))
}
