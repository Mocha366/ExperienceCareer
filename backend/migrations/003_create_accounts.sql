-- Account: 学校 Google ログインの主体（ADR 03 / 05）。
-- 公開ページは Username → Profile のまま。Account は編集のための紐づけ用。
-- シードの tarou など既存 Profile は account_id NULL のままでよい（開発用ダミー）。

CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    google_sub TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS account_id BIGINT UNIQUE
        REFERENCES accounts (id) ON DELETE SET NULL;
