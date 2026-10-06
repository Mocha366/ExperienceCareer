package postgres

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func Open() (*sql.DB, error) {
	user := getenv("POSTGRES_USER", "experience")
	password := getenv("POSTGRES_PASSWORD", "experience")
	dbName := getenv("POSTGRES_DB", "experience")
	port := getenv("POSTGRES_PORT", "5433")
	host := getenv("POSTGRES_HOST", "localhost")

	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		user, password, host, port, dbName,
	)

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, fmt.Errorf("open postgres: %w", err)
	}

	if err := db.Ping(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("ping postgres: %w", err)
	}

	return db, nil
}

func getenv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
