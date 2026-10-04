package usecase

import (
	"errors"

	"github.com/Mocha366/ExperienceCareer/backend/internal/domain"
)

var ErrProfileNotFound = errors.New("profile not found")

type ProfileRepository interface {
	FindByUsername(username string) (domain.Profile, bool)
}

type GetPublicProfile struct {
	profiles ProfileRepository
}

func NewGetPublicProfile(profiles ProfileRepository) *GetPublicProfile {
	return &GetPublicProfile{profiles: profiles}
}

type PublicProfile struct {
	Username    string
	Name        string
	School      string
	Department  string
	Bio         string
	Areas       []string
	Experiences []domain.Experience
}

func (u *GetPublicProfile) Execute(username string) (PublicProfile, error) {
	profile, ok := u.profiles.FindByUsername(username)
	if !ok {
		return PublicProfile{}, ErrProfileNotFound
	}

	return PublicProfile{
		Username:    profile.Username,
		Name:        profile.Name,
		School:      profile.School,
		Department:  profile.Department,
		Bio:         profile.Bio,
		Areas:       domain.CollectAreas(profile.Experiences),
		Experiences: profile.Experiences,
	}, nil
}
