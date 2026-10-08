import { useEffect, useState, type SubmitEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createProfile, fetchMe } from "../api/auth";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ready" | "authed" | "guest">("loading");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMe()
      .then((me) => {
        if (me === null) {
          setStatus("guest");
          return;
        }
        if (me.username) {
          setStatus("authed");
          return;
        }
        setStatus("ready");
      })
      .catch(() => setError("読み込みに失敗しました"));
  }, []);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    createProfile({ username, name, school, department, bio })
      .then(() => navigate(`/${username}`))
      .catch((err: Error) => {
        setError(err.message === "conflict" ? "この Username は使えません" : "保存に失敗しました");
      });
  };

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }
  if (status === "authed") {
    return <Navigate to="/me" replace />;
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-[#f6f4ef] px-8 py-10 text-[#2b2b2b]">
      <h1 className="text-2xl font-medium">プロフィールを作る</h1>
      {status === "loading" && <p className="mt-8">読み込み中</p>}
      {status === "ready" && (
        <form className="mt-8 max-w-md space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            Username
            <input
              className="mt-1 w-full border border-[#e6e1d8] bg-white px-3 py-2"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            名前
            <input
              className="mt-1 w-full border border-[#e6e1d8] bg-white px-3 py-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            学校
            <input
              className="mt-1 w-full border border-[#e6e1d8] bg-white px-3 py-2"
              value={school}
              onChange={(event) => setSchool(event.target.value)}
            />
          </label>
          <label className="block text-sm">
            学科
            <input
              className="mt-1 w-full border border-[#e6e1d8] bg-white px-3 py-2"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            />
          </label>
          <label className="block text-sm">
            自己紹介
            <textarea
              className="mt-1 w-full border border-[#e6e1d8] bg-white px-3 py-2"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </label>
          {error && <p className="text-sm">{error}</p>}
          <button type="submit" className="border border-[#e6e1d8] px-4 py-2 text-sm">
            保存する
          </button>
        </form>
      )}
    </main>
  );
}
