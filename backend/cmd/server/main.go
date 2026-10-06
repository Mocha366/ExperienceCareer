package main

import (
	"log"
	"net/http"

	"github.com/Mocha366/ExperienceCareer/backend/internal/infrastructure/postgres"
	httpapi "github.com/Mocha366/ExperienceCareer/backend/internal/presentation/http"
	"github.com/Mocha366/ExperienceCareer/backend/internal/usecase"
)

func main() {
	db, err := postgres.Open()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	log.Printf("connected to postgres")

	repo := postgres.NewProfileRepository(db)
	getPublicProfile := usecase.NewGetPublicProfile(repo)
	profileHandler := httpapi.NewProfileHandler(getPublicProfile)
	router := httpapi.NewRouter(profileHandler)

	addr := ":8080"
	log.Printf("listening on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatal(err)
	}
}
