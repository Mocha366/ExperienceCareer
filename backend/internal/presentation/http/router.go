package httpapi

import "net/http"

func NewRouter(profileHandler *ProfileHandler) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/profiles/{username}", profileHandler.GetByUsername)
	return mux
}
