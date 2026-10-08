import { useEffect, useState, type SubmitEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { fetchMe, logout, updateUsername, type Me } from "../api/auth";

export function DashboardPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [nextUsername, setNextUsername] = useState("");
  const [formError, setFormError] = useState("");

  const load = () => {
    setStatus("loading");
    fetchMe()
      .then((data) => {
        setMe(data);
        setStatus("ready");
      })
      .catch(() => {
        setMe(null);
        setStatus("error");
      });
  };

  useEffect(() => {
    load();
  }, []);

  const onLogout = () => {
    logout()
      .then(() => load())
      .catch(() => setStatus("error"));
  };

  const onChangeUsername = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    updateUsername(nextUsername)
      .then(() => {
        setNextUsername("");
        load();
      })
      .catch((err: Error) => {
        setFormError(
          err.message === "conflict" ? "この Username は使えません" : "変更に失敗しました",
        );
      });
  };

  if (status === "loading") {
    return (
      <main className="mx-auto min-h-screen max-w-5xl bg-[#f6f4ef] px-8 py-10 text-[#2b2b2b]">
        <h1 className="text-2xl font-medium">ダッシュボード</h1>
        <p className="mt-8">読み込み中</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="mx-auto min-h-screen max-w-5xl bg-[#f6f4ef] px-8 py-10 text-[#2b2b2b]">
        <h1 className="text-2xl font-medium">ダッシュボード</h1>
        <p className="mt-8">読み込みに失敗しました</p>
      </main>
    );
  }

  if (me === null) {
    return <Navigate to="/login" replace />;
  }

  if (me.username === null) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-[#f6f4ef] px-8 py-10 text-[#2b2b2b]">
      <h1 className="text-2xl font-medium">ダッシュボード</h1>
      <div className="mt-8 space-y-4">
        <p>{me.email}</p>
        <p>
          公開ページ: <Link to={`/${me.username}`}>/{me.username}</Link>
        </p>
        <form className="space-y-2" onSubmit={onChangeUsername}>
          <label className="block text-sm">
            Username を変更
            <input
              className="mt-1 w-full max-w-md border border-[#e6e1d8] bg-white px-3 py-2"
              value={nextUsername}
              onChange={(event) => setNextUsername(event.target.value)}
              required
            />
          </label>
          {formError && <p className="text-sm">{formError}</p>}
          <button type="submit" className="border border-[#e6e1d8] px-4 py-2 text-sm">
            変更する
          </button>
        </form>
        <button
          type="button"
          className="border border-[#e6e1d8] px-4 py-2 text-sm"
          onClick={onLogout}
        >
          ログアウト
        </button>
      </div>
    </main>
  );
}
