import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicProfile, type PublicProfile } from "../api/profile";
import { Header } from "../components/Header";
import { Profile } from "../components/Profile";
import { Timeline } from "../components/Timeline";

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState<"loading" | "success" | "notfound" | "error">("loading");

  useEffect(() => {
    if (!username) {
      setStatus("notfound");
      return;
    }

    let cancelled = false;

    setStatus("loading");
    fetchPublicProfile(username)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setStatus("success");
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setProfile(null);
        setStatus(err.message === "not found" ? "notfound" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [username, reloadKey]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-[#f6f4ef] px-8 text-[#2b2b2b]">
      <Header onSaved={() => setReloadKey((key) => key + 1)} />

      {status === "loading" && <p className="py-12">読み込み中...</p>}
      {status === "notfound" && <p className="py-12">プロフィールが見つかりません</p>}
      {status === "error" && <p className="py-12">読み込みに失敗しました</p>}

      {status === "success" && profile && (
        <>
          <Profile
            name={profile.name}
            school={profile.school}
            department={profile.department}
            bio={profile.bio}
            areas={profile.areas}
          />
          <Timeline experiences={profile.experiences} />
        </>
      )}
    </main>
  );
}
