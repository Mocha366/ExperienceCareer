package postgres

import (
	"database/sql"
	"fmt"

	"github.com/Mocha366/ExperienceCareer/backend/internal/domain"
)

type AccountRepository struct {
	db *sql.DB
}

func NewAccountRepository(db *sql.DB) *AccountRepository {
	return &AccountRepository{db: db}
}

func (r *AccountRepository) UpsertByGoogleSub(googleSub, email string) (domain.Account, error) {
	const q = `
		INSERT INTO accounts (google_sub, email)
		VALUES ($1, $2)
		ON CONFLICT (google_sub) DO UPDATE
			SET email = EXCLUDED.email
		RETURNING id, google_sub, email, created_at
	`

	var account domain.Account
	err := r.db.QueryRow(q, googleSub, email).Scan(
		&account.ID,
		&account.GoogleSub,
		&account.Email,
		&account.CreatedAt,
	)
	if err != nil {
		return domain.Account{}, fmt.Errorf("upsert account: %w", err)
	}
	return account, nil
}

func (r *AccountRepository) FindByID(id int64) (domain.Account, bool) {
	const q = `
		SELECT id, google_sub, email, created_at
		FROM accounts
		WHERE id = $1
	`

	var account domain.Account
	err := r.db.QueryRow(q, id).Scan(
		&account.ID,
		&account.GoogleSub,
		&account.Email,
		&account.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return domain.Account{}, false
	}
	if err != nil {
		return domain.Account{}, false
	}
	return account, true
}
