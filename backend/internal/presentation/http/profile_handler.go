package httpapi

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/Mocha366/ExperienceCareer/backend/internal/domain"
	"github.com/Mocha366/ExperienceCareer/backend/internal/usecase"
)

type ProfileHandler struct {
	getPublicProfile *usecase.GetPublicProfile
}

func NewProfileHandler(getPublicProfile *usecase.GetPublicProfile) *ProfileHandler {
	return &ProfileHandler{getPublicProfile: getPublicProfile}
}

type experienceResponse struct {
	ID               string   `json:"id"`
	Title            string   `json:"title"`
	Role             string   `json:"role"`
	StartDate        string   `json:"startDate"`
	EndDate          string   `json:"endDate,omitempty"`
	Attendance       int      `json:"attendance"`
	Areas            []string `json:"areas"`
	EventTypes       []string `json:"eventTypes"`
	PhotoURL         string   `json:"photoUrl,omitempty"`
	Organizer        string   `json:"organizer,omitempty"`
	Summary          string   `json:"summary,omitempty"`
	Responsibilities []string `json:"responsibilities,omitempty"`
	Challenge        string   `json:"challenge,omitempty"`
	Outcome          string   `json:"outcome,omitempty"`
	Learning         string   `json:"learning,omitempty"`
	URL              string   `json:"url,omitempty"`
}

type profileResponse struct {
	Username    string               `json:"username"`
	Name        string               `json:"name"`
	School      string               `json:"school,omitempty"`
	Department  string               `json:"department,omitempty"`
	Bio         string               `json:"bio,omitempty"`
	Areas       []string             `json:"areas"`
	Experiences []experienceResponse `json:"experiences"`
}

func (h *ProfileHandler) GetByUsername(w http.ResponseWriter, r *http.Request) {
	username := r.PathValue("username")

	profile, err := h.getPublicProfile.Execute(username)
	if errors.Is(err, usecase.ErrProfileNotFound) {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if err := json.NewEncoder(w).Encode(toProfileResponse(profile)); err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
	}
}

func toProfileResponse(profile usecase.PublicProfile) profileResponse {
	experiences := make([]experienceResponse, 0, len(profile.Experiences))
	for _, experience := range profile.Experiences {
		experiences = append(experiences, toExperienceResponse(experience))
	}

	return profileResponse{
		Username:    profile.Username,
		Name:        profile.Name,
		School:      profile.School,
		Department:  profile.Department,
		Bio:         profile.Bio,
		Areas:       profile.Areas,
		Experiences: experiences,
	}
}

func toExperienceResponse(experience domain.Experience) experienceResponse {
	return experienceResponse{
		ID:               experience.ID,
		Title:            experience.Title,
		Role:             experience.Role,
		StartDate:        experience.StartDate,
		EndDate:          experience.EndDate,
		Attendance:       experience.Attendance,
		Areas:            experience.Areas,
		EventTypes:       experience.EventTypes,
		PhotoURL:         experience.PhotoURL,
		Organizer:        experience.Organizer,
		Summary:          experience.Summary,
		Responsibilities: experience.Responsibilities,
		Challenge:        experience.Challenge,
		Outcome:          experience.Outcome,
		Learning:         experience.Learning,
		URL:              experience.URL,
	}
}
