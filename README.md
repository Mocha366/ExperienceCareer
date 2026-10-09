# Experience Career

情報科学専門学校向けのイベントキャリア共有サービスです。

リポジトリ構成:

- `frontend/` … Vite + React + TypeScript
- `backend/` … Go（公開プロフィール API）

## 必要なもの

- Node.js（フロント。CI では 22）
- Go（バックエンド。バージョンは `backend/go.mod` を見る）
- Docker（ローカルの PostgreSQL。Compose 付き）

## PostgreSQL（ローカル）

`backend/` の Docker Compose で Postgres を起動する。公開プロフィール API は DB（シードの `tarou` など）から読む。サーバ起動時にも Postgres へ接続する。

初回だけ環境変数ファイルを用意する（`.env` はコミットしない）。

```bash
cd backend
cp .env.example .env
```

必要なら `.env` のユーザ / パスワード / DB 名 / ポートを変える。Google ログイン用の `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REDIRECT_URL` も `.env` に書く（値は Google Cloud の OAuth クライアントから。`.env` はコミットしない）。ログイン後の戻り先用に `FRONTEND_ORIGIN`（ローカルは `http://localhost:5173`）も必須。変数の意味は `.env.example` を見る。ホスト側のポートはデフォルト **5433**（Mac で 5432 が既存 Postgres に使われていることが多いため）。Go などホストからつなぐときは `localhost:5433`。

起動（いつも `backend/` で実行する）:

```bash
cd backend
docker compose up -d
```

接続確認（`.env` のユーザ・DB 名に合わせる。デフォルトはどちらも `experience`）:

```bash
cd backend
docker compose exec db psql -U experience -d experience -c '\conninfo'
docker compose exec db psql -U experience -d experience -c 'SELECT 1'
```

### テーブルを作る（migration）

DB 起動後、SQL を番号順に流す。`001` で Profile / Experience、`003` で Account（ログイン主体）と `profiles.account_id`。

```bash
cd backend
docker compose exec -T db psql -U experience -d experience < migrations/001_create_profiles_and_experiences.sql
docker compose exec -T db psql -U experience -d experience < migrations/003_create_accounts.sql
```

表があることの確認:

```bash
cd backend
docker compose exec db psql -U experience -d experience -c '\dt'
docker compose exec db psql -U experience -d experience -c '\d profiles'
```

`profiles` / `experiences` / `experience_areas` / `experience_event_types` / `experience_responsibilities` / `accounts` が見え、`profiles` に `account_id` があればよい。SQL は `IF NOT EXISTS` なので、同じファイルを再度流しても表や列が既にあればスキップされる。

シードの `tarou` は `account_id` を付けない（開発用ダミーのまま）。Google ログイン実装後に本物の Account と紐づける。

### ダミーデータを入れる（シード）

`001`（と任意で `003`）のあと、公開プロフィール用のダミー（`tarou`）を入れる。公開 API はこのシードを読む。

```bash
cd backend
docker compose exec -T db psql -U experience -d experience < migrations/002_seed_tarou.sql
```

確認:

```bash
cd backend
docker compose exec db psql -U experience -d experience -c "SELECT username, name FROM profiles;"
docker compose exec db psql -U experience -d experience -c "SELECT id, title FROM experiences;"
```

`tarou` と経験 3 件が見えればよい。SQL 先頭で同じ username を消してから入れ直すので、何度流してもよい。

止める（データは volume に残る）:

```bash
cd backend
docker compose down
```

volume ごと消すとき（中身も消える。表も消える）:

```bash
cd backend
docker compose down -v
```

## フロントエンド

```bash
cd frontend
npm install
npm run dev
```

公開プロフィールは Go API から取得する。**バックエンドとフロントを両方起動**してからブラウザで確認する（下の「公開プロフィールをローカルで見る」）。

開発時は Vite が `/api` を `http://localhost:8080` に転送する（`frontend/vite.config.ts` の proxy）。`npm run build` 後の静的配信では proxy は効かない。

変更を出す前に、CI と同じチェックをローカルで通す。

```bash
cd frontend
npm run lint
npm run fmt:check
npm run build
```

整形だけ直すとき:

```bash
cd frontend
npm run fmt
```

## バックエンド

API サーバを起動する。**先に Postgres を起動しておく**（上の「PostgreSQL（ローカル）」）。起動時に DB へ接続し、失敗したらサーバは起動しない。接続に使う値は環境変数 `POSTGRES_*`（未設定なら `.env.example` と同じデフォルト。ポートは 5433）。`go run` は **`backend/` で実行**する（同じディレクトリの `.env` を読む）。

```bash
cd backend
docker compose up -d
go run ./cmd/server
```

ログに `connected to postgres` と `listening on http://localhost:8080` が出ればよい。Google 用の環境変数が無いと起動に失敗する。

別のターミナルで確認する。

```bash
# 存在するユーザー（シードの tarou）→ 200 と JSON
curl -i http://localhost:8080/api/profiles/tarou

# 存在しないユーザー → 404
curl -i http://localhost:8080/api/profiles/nobody
```

### Google ログイン（ローカル）

学校ドメイン（`@gn.iwasaki.ac.jp`）の Google アカウントだけでログインできる。セッションはサーバのメモリ（再起動で消える）。公開プロフィールはログイン不要のまま。ログイン後はフロントの `/dashboard`（ダッシュボード）に戻る。

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを用意する  
2. OAuth 同意画面を設定する（テスト中ならテストユーザに自分の学校メールを追加）  
3. OAuth クライアント ID を **ウェブアプリケーション** で作成し、承認済みリダイレクト URI に次を登録する  

   `http://localhost:8080/api/auth/google/callback`

4. Client ID / Client Secret を `backend/.env` に書く（`.env.example` のキー名に合わせる）。`GOOGLE_REDIRECT_URL` は上の URI と一字一句同じにする。`FRONTEND_ORIGIN=http://localhost:5173` も書く（無いとサーバは起動しない）  
5. migration `003` まで流しておく（`accounts` 表）  
6. バックエンドとフロントを両方起動する  

```bash
# ターミナル A
cd backend
go run ./cmd/server

# ターミナル B
cd frontend
npm run dev
```

7. ブラウザで次を開く  

```text
http://localhost:5173/login
```

「Google でログイン」→ 学校 Google → Username が未設定なら `/onboarding` に飛ぶ。Username・名前・学校・学科・自己紹介を保存すると、自分の公開ページ（`/設定したusername`）へ行く。`/dashboard` には email、公開ページへのリンク、ログアウトがある。Username・名前・学校・学科・自己紹介の変更は、ログイン中に公開ページのヘッダーから行う。Username を変えたあと、旧 URL は 404 になる。未ログインで `/dashboard` を開くと `/login` へ誘導される。

公開プロフィール（ログイン不要）の確認:

```text
http://localhost:5173/tarou
```

API だけ試す場合のログイン開始 URL は `http://localhost:8080/api/auth/google`（成功後は `FRONTEND_ORIGIN/dashboard` へ飛ぶ）。

自分のプロフィール（名前・学校・学科・自己紹介）は `PATCH /api/me/profile` で更新する。Username は変えない。未ログインは 401、プロフィールがまだ無いときは 404。名前・学校・学科が空だと 400。自己紹介だけ空欄で保存でき、公開ページでは空の自己紹介は出ない。

```bash
# 未ログイン → 401
curl -i -X PATCH http://localhost:8080/api/me/profile \
  -H 'Content-Type: application/json' \
  -d '{"name":"山田","school":"岩崎学園","department":"情報","bio":""}'
```

ログイン中に更新するときは、ブラウザの `ec_session` Cookie を付けて同じ URL を叩く。成功は 200。その後 `GET /api/profiles/自分のusername` に、送った名前・学校・学科・自己紹介が出る。

止めるときは、サーバを動かしているターミナルで `Ctrl+C`。

変更を出す前に、CI と同じチェックをローカルで通す（必ず `backend/` で実行する）。

```bash
cd backend

# フォーマット（差分があるファイル名が出たら失敗）
test -z "$(gofmt -l .)"

# 静的チェック
go vet ./...

# テスト（まだ無いパッケージはスキップ表示になる）
go test ./...

# ビルド
go build ./...
```

フォーマットを直すとき:

```bash
cd backend
gofmt -w .
```

`go build -o server .` などでできた実行ファイルはコミットしない（`.gitignore` で `/backend/server` を無視している）。

## 公開プロフィールをローカルで見る

1. ターミナル A: `cd backend` → `docker compose up -d` →（初回は migration・シード）→ `go run ./cmd/server`（`:8080`）
2. ターミナル B: `cd frontend` → `npm run dev`（`:5173`）
3. ブラウザで次を開く:
   - `http://localhost:5173/tarou` … DB の公開プロフィール（シードの Username）
   - `http://localhost:5173/nobody` … プロフィールが見つからない表示
   - `http://localhost:5173/login` … ログイン
   - `http://localhost:5173/onboarding` … 初回のプロフィール作成（要ログイン。Username 設定済みなら `/dashboard` へ）
   - `http://localhost:5173/dashboard` … ダッシュボード（要ログイン。公開ページへのリンク / ログアウト）
   - `http://localhost:5173/` … いまは `/tarou` にリダイレクト（デモ用）

API だけ確認する場合は、バックエンド起動後に上記「バックエンド」の `curl` を使う。フロント経由では `curl -i http://localhost:5173/api/profiles/tarou` でも同じ JSON が返る（proxy 経由）。

## CI

GitHub Actions（`.github/workflows/ci.yml`）では、次を PR / push 時に実行する。

- `frontend` … `lint` / `fmt:check` / `build`
- `backend` … `gofmt` / `go vet` / `go test` / `go build`

上に書いたローカルコマンドと対応している。
