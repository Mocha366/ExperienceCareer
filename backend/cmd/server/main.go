package main

import (
	"log"
	"net/http"

	"github.com/Mocha366/ExperienceCareer/backend/internal/infrastructure/memory"
	httpapi "github.com/Mocha366/ExperienceCareer/backend/internal/presentation/http"
	"github.com/Mocha366/ExperienceCareer/backend/internal/usecase"
)

func main() {
	repo := memory.NewProfileRepository()
	getPublicProfile := usecase.NewGetPublicProfile(repo)
	profileHandler := httpapi.NewProfileHandler(getPublicProfile)
	router := httpapi.NewRouter(profileHandler)

	addr := ":8080"
	log.Printf("listening on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatal(err)
	}
}
