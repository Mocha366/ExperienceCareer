-- 既存 DB 向け。001 を再実行しても CHECK は置き換わらない。
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_format;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_username_format
  CHECK (username ~ '^[a-z0-9]{3,25}$');
