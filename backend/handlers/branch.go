package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sort"
	"time"

	"github.com/ahmetmerttirpan/kuafor-backend/models"
	"github.com/gofiber/fiber/v2"
)

type GooglePlacesResponse struct {
	Results []struct {
		Name             string  `json:"name"`
		Vicinity         string  `json:"vicinity"`
		Rating           float64 `json:"rating"`
		UserRatingsTotal int     `json:"user_ratings_total"`
		Geometry         struct {
			Location struct {
				Lat float64 `json:"lat"`
				Lng float64 `json:"lng"`
			} `json:"location"`
		} `json:"geometry"`
		Photos []struct {
			PhotoReference string `json:"photo_reference"`
		} `json:"photos"`
	} `json:"results"`
	Status string `json:"status"`
}

// GetNearbyBranches returns salons from Google Maps API
func GetNearbyBranches(c *fiber.Ctx) error {
	lat := c.QueryFloat("lat", 0)
	lon := c.QueryFloat("lon", 0)

	if lat == 0 || lon == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Enlem (lat) ve Boylam (lon) bilgisi gereklidir",
		})
	}

	apiKey := os.Getenv("GOOGLE_MAPS_API_KEY")
	if apiKey == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "GOOGLE_MAPS_API_KEY bulunamadı. Lütfen docker-compose.yml üzerinden api key ekleyin.",
		})
	}

	// Fetch from Google Places API
	url := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%f,%f&radius=5000&type=beauty_salon&keyword=kuaf%%C3%%B6r&key=%s", lat, lon, apiKey)
	
	resp, err := http.Get(url)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Google Haritalar API'sine bağlanılamadı"})
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var places GooglePlacesResponse
	if err := json.Unmarshal(body, &places); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Harita verisi işlenemedi", "details": err.Error()})
	}

	if places.Status != "OK" && places.Status != "ZERO_RESULTS" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Google API Hatası: " + places.Status})
	}

	var branches []models.Branch

	for i, place := range places.Results {
		// Use Google Maps photo if available, else fallback to unsplash
		heroImg := "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop"
		if len(place.Photos) > 0 {
			heroImg = fmt.Sprintf("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=%s&key=%s", place.Photos[0].PhotoReference, apiKey)
		}

		b := models.Branch{
			ID:          uint(i + 1), // Virtual ID since not in DB
			Name:        place.Name,
			Address:     place.Vicinity,
			Latitude:    place.Geometry.Location.Lat,
			Longitude:   place.Geometry.Location.Lng,
			Rating:      place.Rating,
			Type:        "Güzellik & Kuaför",
			HeroImage:   heroImg,
			CreatedAt:   time.Now(),
		}
		branches = append(branches, b)
	}

	// Sort by rating descending (highest stars first)
	sort.Slice(branches, func(i, j int) bool {
		return branches[i].Rating > branches[j].Rating
	})

	// Take top 5
	if len(branches) > 5 {
		branches = branches[:5]
	}

	// Make the first one "Sponsored" (Advertisement Simulation) as requested
	if len(branches) > 0 {
		branches[0].IsSponsored = true
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   branches,
	})
}
