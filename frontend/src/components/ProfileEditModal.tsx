import { useEffect, useState, type SubmitEvent } from "react";
import { fetchMe, updateProfile, updateUsername } from "../api/auth";
import { fetchPublicProfile } from "../api/profile";

type Props = {
  onClose: () => void;
  onSaved: (username: string) => void;
};

export function ProfileEditModal({ onClose, onSaved }: Props) {
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [savedUsername, setSavedUsername] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMe()
      .then((me) => {
        if (me === null || !me.username) {
          onClose();
          return;
        }
        return fetchPublicProfile(me.username).then((profile) => {
          setSavedUsername(profile.username);
          setUsername(profile.username);
          setName(profile.name);
          setSchool(profile.school ?? "");
          setDepartment(profile.department ?? "");
          setBio(profile.bio ?? "");
          setStatus("ready");
        });
      })
      .catch(() => setError("読み込みに失敗しました"));
  }, [onClose]);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const nextUsername = username.trim();
    const request =
      nextUsername === savedUsername
        ? updateProfile({ name, school, department, bio })
        : updateProfile({ name, school, department, bio }).then(() => updateUsername(nextUsername));

    request.then(
      () => {
        onSaved(nextUsername);
      },
      (err: Error) => {
        setError(err.message === "conflict" ? "この Username は使えません" : "保存に失敗しました");
      },
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
        className="w-full max-w-md bg-[#f6f4ef] px-8 py-8 text-[#2b2b2b]"
      >
        <h2 id="profile-edit-title" className="text-2xl font-medium">
          プロフィールを編集
        </h2>
        {status === "loading" && !error && <p className="mt-8">読み込み中</p>}
        {error && status !== "ready" && <p className="mt-8 text-sm">{error}</p>}
        {status === "ready" && (
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
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
              required
            />
            </label>
            <label className="block text-sm">
            学科
            <input
              className="mt-1 w-full border border-[#e6e1d8] bg-white px-3 py-2"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              required
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
            <div className="flex gap-2">
              <button type="submit" className="border border-[#e6e1d8] px-4 py-2 text-sm">
                保存する
              </button>
              <button
                type="button"
                className="border border-[#e6e1d8] px-4 py-2 text-sm"
                onClick={onClose}
              >
                閉じる
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
