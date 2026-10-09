export type Me = {
  id: number;
  email: string;
  username: string | null;
};

export async function fetchMe(): Promise<Me | null> {
  const res = await fetch("/api/me", {
    credentials: "include",
  });
  if (res.status === 401) {
    return null;
  }
  if (!res.ok) {
    throw new Error("failed to fetch me");
  }
  return res.json();
}

export type CreateProfileInput = {
  username: string;
  name: string;
  school: string;
  department: string;
  bio: string;
};

export async function createProfile(input: CreateProfileInput): Promise<void> {
  const res = await fetch("/api/me/profile", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (res.status === 409) {
    throw new Error("conflict");
  }
  if (!res.ok) {
    throw new Error("failed to create profile");
  }
}

export type UpdateProfileInput = {
  name: string;
  school: string;
  department: string;
  bio: string;
};

export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  const res = await fetch("/api/me/profile", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (res.status === 404) {
    throw new Error("not found");
  }
  if (!res.ok) {
    throw new Error("failed to update profile");
  }
}

export async function updateUsername(username: string): Promise<void> {
  const res = await fetch("/api/me/username", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (res.status === 409) {
    throw new Error("conflict");
  }
  if (!res.ok) {
    throw new Error("failed to update username");
  }
}

export async function logout(): Promise<void> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("failed to logout");
  }
}

export function beginGoogleLogin(): void {
  window.location.href = "/api/auth/google";
}
