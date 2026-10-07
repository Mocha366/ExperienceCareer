package domain

import "time"

type Account struct {
	ID        int64
	GoogleSub string
	Email     string
	CreatedAt time.Time
}
