import { beginGoogleLogin } from "../api/auth";

export function LoginPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-[#f6f4ef] px-8 py-10 text-[#2b2b2b]">
      <h1 className="text-2xl font-medium">ログイン</h1>
      <p className="mt-4 text-[#8a8175]">学校の Google アカウントでログインします</p>
      <button
        type="button"
        className="mt-8 border border-[#e6e1d8] px-4 py-2 text-sm"
        onClick={beginGoogleLogin}
      >
        Google でログイン
      </button>
    </main>
  );
}
