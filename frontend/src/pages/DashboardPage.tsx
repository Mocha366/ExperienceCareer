import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchMe, logout, type Me } from "../api/auth";

export function DashboardPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

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

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-[#f6f4ef] px-8 py-10 text-[#2b2b2b]">
      <h1 className="text-2xl font-medium">ダッシュボード</h1>
      <div className="mt-8 space-y-4">
        <p>{me.email}</p>
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
