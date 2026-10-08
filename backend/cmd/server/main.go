package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/Mocha366/ExperienceCareer/backend/internal/auth"
	"github.com/Mocha366/ExperienceCareer/backend/internal/infrastructure/memory"
	"github.com/Mocha366/ExperienceCareer/backend/internal/infrastructure/postgres"
	httpapi "github.com/Mocha366/ExperienceCareer/backend/internal/presentation/http"
	"github.com/Mocha366/ExperienceCareer/backend/internal/usecase"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("warning: .env not loaded: %v", err)
	}

	db, err := postgres.Open()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	log.Printf("connected to postgres")

	google, err := auth.NewGoogle(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	frontendOrigin := os.Getenv("FRONTEND_ORIGIN")
	if frontendOrigin == "" {
		log.Fatal("FRONTEND_ORIGIN is required")
	}

	accountRepo := postgres.NewAccountRepository(db)
	sessions := memory.NewSessionStore()
	profileRepo := postgres.NewProfileRepository(db)
	authHandler := httpapi.NewAuthHandler(google, accountRepo, sessions, profileRepo, frontendOrigin)

	getPublicProfile := usecase.NewGetPublicProfile(profileRepo)
	profileHandler := httpapi.NewProfileHandler(getPublicProfile)

	router := httpapi.NewRouter(profileHandler, authHandler)

	addr := ":8080"
	log.Printf("listening on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatal(err)
	}
}
