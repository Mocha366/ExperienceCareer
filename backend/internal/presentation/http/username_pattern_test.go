package httpapi

import "testing"

func TestUsernamePattern(t *testing.T) {
	accept := []string{"abc", "tarou", "a234567890123456789012345"}
	reject := []string{"ab", "", "a2345678901234567890123456", "Tarou", "ta-rou", "たろう"}

	for _, username := range accept {
		if !usernamePattern.MatchString(username) {
			t.Errorf("accept %q", username)
		}
	}
	for _, username := range reject {
		if usernamePattern.MatchString(username) {
			t.Errorf("reject %q", username)
		}
	}
}
