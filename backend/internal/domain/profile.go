package domain

type Experience struct {
	ID               string
	Title            string
	Role             string
	StartDate        string
	EndDate          string
	Attendance       int
	Areas            []string
	EventTypes       []string
	PhotoURL         string
	Organizer        string
	Summary          string
	Responsibilities []string
	Challenge        string
	Outcome          string
	Learning         string
	URL              string
}

type Profile struct {
	Username    string
	Name        string
	School      string
	Department  string
	Bio         string
	Experiences []Experience
}
