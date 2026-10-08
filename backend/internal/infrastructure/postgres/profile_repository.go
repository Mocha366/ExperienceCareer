package postgres

import (
	"database/sql"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/Mocha366/ExperienceCareer/backend/internal/domain"
	"github.com/jackc/pgx/v5/pgconn"
)

type ProfileRepository struct {
	db *sql.DB
}

func NewProfileRepository(db *sql.DB) *ProfileRepository {
	return &ProfileRepository{db: db}
}

func (r *ProfileRepository) FindByUsername(username string) (domain.Profile, bool) {
	var profile domain.Profile
	var profileID int64

	err := r.db.QueryRow(
		`SELECT id, username, name, school, department, bio
		FROM profiles
		WHERE username = $1`,
		username,
	).Scan(
		&profileID,
		&profile.Username,
		&profile.Name,
		&profile.School,
		&profile.Department,
		&profile.Bio,
	)
	if err == sql.ErrNoRows {
		return domain.Profile{}, false
	}
	if err != nil {
		return domain.Profile{}, false
	}

	experiences, err := r.findExperiences(profileID)
	if err != nil {
		return domain.Profile{}, false
	}
	profile.Experiences = experiences

	return profile, true
}

func (r *ProfileRepository) findExperiences(profileID int64) ([]domain.Experience, error) {
	rows, err := r.db.Query(
		`SELECT id, title, role, start_date, end_date, attendance, photo_url, organizer, summary, challenge, outcome, learning, url
		FROM experiences
		WHERE profile_id = $1
		ORDER BY start_date DESC, id ASC`,
		profileID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	experiences := make([]domain.Experience, 0)
	for rows.Next() {
		var (
			id         int64
			experience domain.Experience
			startDate  time.Time
			endDate    sql.NullTime
		)

		if err := rows.Scan(
			&id,
			&experience.Title,
			&experience.Role,
			&startDate,
			&endDate,
			&experience.Attendance,
			&experience.PhotoURL,
			&experience.Organizer,
			&experience.Summary,
			&experience.Challenge,
			&experience.Outcome,
			&experience.Learning,
			&experience.URL,
		); err != nil {
			return nil, err
		}

		experience.ID = strconv.FormatInt(id, 10)
		experience.StartDate = startDate.Format("2006-01-02")
		if endDate.Valid {
			experience.EndDate = endDate.Time.Format("2006-01-02")
		}

		areas, err := r.findAreas(id)
		if err != nil {
			return nil, err
		}
		experience.Areas = areas

		eventTypes, err := r.findEventTypes(id)
		if err != nil {
			return nil, err
		}
		experience.EventTypes = eventTypes

		responsibilities, err := r.findResponsibilities(id)
		if err != nil {
			return nil, err
		}
		experience.Responsibilities = responsibilities

		experiences = append(experiences, experience)
	}

	return experiences, rows.Err()
}

func (r *ProfileRepository) findAreas(experienceID int64) ([]string, error) {
	rows, err := r.db.Query(
		`SELECT area FROM experience_areas WHERE experience_id = $1 ORDER BY area`,
		experienceID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	areas := make([]string, 0)
	for rows.Next() {
		var area string
		if err := rows.Scan(&area); err != nil {
			return nil, err
		}
		areas = append(areas, area)
	}
	return areas, rows.Err()
}

func (r *ProfileRepository) findEventTypes(experienceID int64) ([]string, error) {
	rows, err := r.db.Query(
		`SELECT event_type FROM experience_event_types WHERE experience_id = $1 ORDER BY event_type`,
		experienceID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	types := make([]string, 0)
	for rows.Next() {
		var eventType string
		if err := rows.Scan(&eventType); err != nil {
			return nil, err
		}
		types = append(types, eventType)
	}
	return types, rows.Err()
}

func (r *ProfileRepository) findResponsibilities(experienceID int64) ([]string, error) {
	rows, err := r.db.Query(
		`SELECT body FROM experience_responsibilities
		WHERE experience_id = $1
		ORDER BY sort_order`,
		experienceID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	bodies := make([]string, 0)
	for rows.Next() {
		var body string
		if err := rows.Scan(&body); err != nil {
			return nil, err
		}
		bodies = append(bodies, body)
	}
	return bodies, rows.Err()
}

var (
	ErrUsernameTaken   = errors.New("username taken")
	ErrProfileNotFound = errors.New("profile not found")
	ErrProfileExists   = errors.New("profile already exists")
)

func (r *ProfileRepository) FindByAccountID(accountID int64) (domain.Profile, bool) {
	var profile domain.Profile
	err := r.db.QueryRow(
		`SELECT username, name, school, department, bio
		FROM profiles
		WHERE account_id = $1`,
		accountID,
	).Scan(
		&profile.Username,
		&profile.Name,
		&profile.School,
		&profile.Department,
		&profile.Bio,
	)
	if err != nil {
		return domain.Profile{}, false
	}
	return profile, true
}

func (r *ProfileRepository) CreateForAccount(accountID int64, username, name, school, department, bio string) error {
	_, err := r.db.Exec(
		`INSERT INTO profiles (username, name, school, department, bio, account_id)
		VALUES ($1, $2, $3, $4, $5, $6)`,
		username, name, school, department, bio, accountID,
	)
	if err == nil {
		return nil
	}
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		if pgErr.ConstraintName == "profiles_account_id_key" {
			return ErrProfileExists
		}
		return ErrUsernameTaken
	}
	return fmt.Errorf("create profile: %w", err)
}

func (r *ProfileRepository) UpdateUsername(accountID int64, username string) error {
	res, err := r.db.Exec(
		`UPDATE profiles
		SET username = $1, updated_at = now()
		WHERE account_id = $2`,
		username, accountID,
	)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return ErrUsernameTaken
		}
		return fmt.Errorf("update username: %w", err)
	}
	n, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("update username: %w", err)
	}
	if n == 0 {
		return ErrProfileNotFound
	}
	return nil
}
