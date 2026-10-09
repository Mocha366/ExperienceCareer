import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMe } from "../api/auth";
import { ProfileEditModal } from "./ProfileEditModal";

type Props = {
  onSaved: () => void;
};

export function Header({ onSaved }: Props) {
  const navigate = useNavigate();
  const { username: pageUsername } = useParams<{ username: string }>();
  const [meUsername, setMeUsername] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchMe()
      .then((me) => setMeUsername(me?.username ?? null))
      .catch(() => setMeUsername(null));
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-[#e6e1d8] py-5 text-sm">
      <p className="font-medium">experience career</p>
      <div className="flex items-center gap-4">
        {meUsername && (
          <button
            type="button"
            className="border border-[#e6e1d8] px-3 py-1"
            onClick={() => setOpen(true)}
          >
            プロフィール編集
          </button>
        )}
      </div>
      {open && (
        <ProfileEditModal
          onClose={() => setOpen(false)}
          onSaved={(nextUsername) => {
            setOpen(false);
            setMeUsername(nextUsername);
            if (nextUsername !== pageUsername) {
              navigate(`/${nextUsername}`);
              return;
            }
            onSaved();
          }}
        />
      )}
    </header>
  );
}
