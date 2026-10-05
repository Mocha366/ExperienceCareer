export type Experience = {
  id: string;
  title: string;
  role: string;
  startDate: string;
  endDate?: string;
  attendance: number;
  areas: string[];
  eventTypes: string[];
  photoUrl?: string;
  organizer?: string;
  summary?: string;
  responsibilities?: string[];
  challenge?: string;
  outcome?: string;
  learning?: string;
  url?: string;
};

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export function formatSchedule(startDate: string, endDate?: string) {
  if (!endDate || endDate === startDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)}~${formatDate(endDate)}`;
}
