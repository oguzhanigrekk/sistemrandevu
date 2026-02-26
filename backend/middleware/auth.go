package middleware

import (
	"log"
	"os"
	"time"

	"github.com/MicahParks/keyfunc/v2"
	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

var jwks *keyfunc.JWKS

func SetupJWKS() {
	jwksURL := os.Getenv("KEYCLOAK_JWKS_URL")
	if jwksURL == "" {
		jwksURL = "http://kuafor_keycloak:8080/realms/kuafor_realm/protocol/openid-connect/certs"
	}

	options := keyfunc.Options{
		RefreshInterval: time.Hour,
		RefreshErrorHandler: func(err error) {
			log.Printf("There was an error with the jwt.Keyfunc\nError: %s", err)
		},
	}

	var err error
	jwks, err = keyfunc.Get(jwksURL, options)
	if err != nil {
		log.Printf("Warning: Failed to create JWKS from %s. Realm might not be created yet. Error: %s", jwksURL, err)
		// Retry in background
		go func() {
			for {
				time.Sleep(10 * time.Second)
				jwks, err = keyfunc.Get(jwksURL, options)
				if err == nil {
					log.Println("JWKS fetched successfully!")
					break
				}
				log.Printf("Retrying fetching JWKS...")
			}
		}()
	} else {
		log.Println("JWKS fetched successfully on startup!")
	}
}

// Protected middleware handles JWT validation
func Protected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if jwks == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "JWKS not initialized yet. Keycloak might be down or realm is missing.",
			})
		}

		handler := jwtware.New(jwtware.Config{
			KeyFunc: jwks.Keyfunc,
			ErrorHandler: func(c *fiber.Ctx, err error) error {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"error":   "Unauthorized",
					"message": err.Error(),
				})
			},
		})

		return handler(c)
	}
}
