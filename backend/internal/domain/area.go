package domain

// CollectAreas は経験の担当領域を、登場順のまま重複なく集める
func CollectAreas(experiences []Experience) []string {
	seen := make(map[string]bool)
	areas := make([]string, 0)

	for _, experience := range experiences {
		for _, area := range experience.Areas {
			if area == "" || seen[area] {
				continue
			}
			seen[area] = true
			areas = append(areas, area)
		}
	}

	return areas
}
