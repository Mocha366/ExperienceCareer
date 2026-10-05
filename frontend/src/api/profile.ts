import type { Experience } from "../components/experiences";

export type PublicProfile = {
  username: string;
  name: string;
  school?: string;
  department?: string;
  bio?: string;
  areas: string[];
  experiences: Experience[];
};

export async function fetchPublicProfile(username: string): Promise<PublicProfile> {
  const res = await fetch(`/api/profiles/${encodeURIComponent(username)}`);
  if (res.status === 404) {
    throw new Error("not found");
  }
  if (!res.ok) {
    throw new Error("failed to fetch profile");
  }
  return res.json();
}
