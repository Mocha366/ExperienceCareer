package memory

import (
	"crypto/rand"
	"encoding/hex"
	"sync"
)

type SessionStore struct {
	mu       sync.RWMutex
	sessions map[string]int64
}

func NewSessionStore() *SessionStore {
	return &SessionStore{
		sessions: make(map[string]int64),
	}
}

func (s *SessionStore) Create(accountID int64) (string, error) {
	id, err := newSessionID()
	if err != nil {
		return "", err
	}

	s.mu.Lock()
	s.sessions[id] = accountID
	s.mu.Unlock()
	return id, nil
}

func (s *SessionStore) Get(sessionID string) (accountID int64, ok bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	accountID, ok = s.sessions[sessionID]
	return accountID, ok
}

func (s *SessionStore) Delete(sessionID string) {
	s.mu.Lock()
	delete(s.sessions, sessionID)
	s.mu.Unlock()
}

func newSessionID() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
