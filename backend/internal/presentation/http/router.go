package httpapi

import "net/http"

func NewRouter(profileHandler *ProfileHandler, authHandler *AuthHandler) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/profiles/{username}", profileHandler.GetByUsername)

	mux.HandleFunc("GET /api/auth/google", authHandler.BeginGoogle)
	mux.HandleFunc("GET /api/auth/google/callback", authHandler.GoogleCallback)
	mux.HandleFunc("POST /api/auth/logout", authHandler.Logout)
	mux.HandleFunc("GET /api/me", authHandler.Me)

	return mux
}
