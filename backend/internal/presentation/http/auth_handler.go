package httpapi

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/oauth2"

	"github.com/Mocha366/ExperienceCareer/backend/internal/auth"
	"github.com/Mocha366/ExperienceCareer/backend/internal/infrastructure/memory"
	"github.com/Mocha366/ExperienceCareer/backend/internal/infrastructure/postgres"
)

const (
	sessionCookieName  = "ec_session"
	allowedEmailDomain = "gn.iwasaki.ac.jp"
	oauthStateTTL      = 10 * time.Minute
)

type AuthHandler struct {
	google         *auth.Google
	accounts       *postgres.AccountRepository
	sessions       *memory.SessionStore
	frontendOrigin string

	statesMu sync.Mutex
	states   map[string]time.Time
}

func NewAuthHandler(
	google *auth.Google,
	accounts *postgres.AccountRepository,
	sessions *memory.SessionStore,
	frontendOrigin string,
) *AuthHandler {
	return &AuthHandler{
		google:         google,
		accounts:       accounts,
		sessions:       sessions,
		frontendOrigin: strings.TrimRight(frontendOrigin, "/"),
		states:         make(map[string]time.Time),
	}
}

func (h *AuthHandler) BeginGoogle(w http.ResponseWriter, r *http.Request) {
	state, err := newOpaqueID()
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	h.statesMu.Lock()
	h.states[state] = time.Now().Add(oauthStateTTL)
	h.statesMu.Unlock()

	url := h.google.OAuth2.AuthCodeURL(
		state,
		oauth2.AccessTypeOnline,
		oauth2.SetAuthURLParam("hd", allowedEmailDomain),
	)
	http.Redirect(w, r, url, http.StatusFound)
}

func (h *AuthHandler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	if !h.consumeState(r.URL.Query().Get("state")) {
		http.Error(w, "invalid state", http.StatusBadRequest)
		return
	}

	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "missing code", http.StatusBadRequest)
		return
	}

	oauth2Token, err := h.google.OAuth2.Exchange(ctx, code)
	if err != nil {
		http.Error(w, "token exchange failed", http.StatusBadRequest)
		return
	}

	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok || rawIDToken == "" {
		http.Error(w, "missing id_token", http.StatusBadRequest)
		return
	}

	idToken, err := h.google.Verifier.Verify(ctx, rawIDToken)
	if err != nil {
		http.Error(w, "invalid id_token", http.StatusBadRequest)
		return
	}

	var claims struct {
		Email         string `json:"email"`
		EmailVerified bool   `json:"email_verified"`
		HD            string `json:"hd"`
	}
	if err := idToken.Claims(&claims); err != nil {
		http.Error(w, "invalid claims", http.StatusBadRequest)
		return
	}
	if !claims.EmailVerified {
		http.Error(w, "email not verified", http.StatusForbidden)
		return
	}
	if !isAllowedSchoolEmail(claims.Email, claims.HD) {
		http.Error(w, "forbidden domain", http.StatusForbidden)
		return
	}

	account, err := h.accounts.UpsertByGoogleSub(idToken.Subject, claims.Email)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	sessionID, err := h.sessions.Create(account.ID)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookieName,
		Value:    sessionID,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	afterLogin := h.frontendOrigin + "/me"
	if h.frontendOrigin == "" {
		afterLogin = "/api/me"
	}
	http.Redirect(w, r, afterLogin, http.StatusFound)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	if c, err := r.Cookie(sessionCookieName); err == nil {
		h.sessions.Delete(c.Value)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookieName,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	w.WriteHeader(http.StatusNoContent)
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie(sessionCookieName)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	accountID, ok := h.sessions.Get(c.Value)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	account, ok := h.accounts.FindByID(accountID)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"id":    account.ID,
		"email": account.Email,
	})
}

func (h *AuthHandler) consumeState(state string) bool {
	if state == "" {
		return false
	}
	h.statesMu.Lock()
	defer h.statesMu.Unlock()

	expiry, ok := h.states[state]
	delete(h.states, state)
	if !ok {
		return false
	}
	return time.Now().Before(expiry)
}

func isAllowedSchoolEmail(email, hd string) bool {
	email = strings.ToLower(strings.TrimSpace(email))
	if hd != "" && !strings.EqualFold(hd, allowedEmailDomain) {
		return false
	}
	return strings.HasSuffix(email, "@"+allowedEmailDomain)
}

func newOpaqueID() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
