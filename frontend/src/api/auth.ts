export type Me = {
  id: number;
  email: string;
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
