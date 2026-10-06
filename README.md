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

必要なら `.env` のユーザ / パスワード / DB 名 / ポートを変える。変数の意味は `.env.example` を見る。ホスト側のポートはデフォルト **5433**（Mac で 5432 が既存 Postgres に使われていることが多いため）。Go などホストからつなぐときは `localhost:5433`。

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

DB 起動後、SQL を流して Profile / Experience 用の表を作る。

```bash
cd backend
docker compose exec -T db psql -U experience -d experience < migrations/001_create_profiles_and_experiences.sql
```

表があることの確認:

```bash
cd backend
docker compose exec db psql -U experience -d experience -c '\dt'
```

`profiles` / `experiences` / `experience_areas` / `experience_event_types` / `experience_responsibilities` が見えればよい。SQL は `IF NOT EXISTS` なので、同じファイルを再度流しても表が既にあればスキップされる。

### ダミーデータを入れる（シード）

migration のあと、公開プロフィール用のダミー（`tarou`）を入れる。公開 API はこのシードを読む。

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

API サーバを起動する。**先に Postgres を起動しておく**（上の「PostgreSQL（ローカル）」）。起動時に DB へ接続し、失敗したらサーバは起動しない。接続に使う値は環境変数 `POSTGRES_*`（未設定なら `.env.example` と同じデフォルト。ポートは 5433）。

```bash
cd backend
docker compose up -d
go run ./cmd/server
```

ログに `connected to postgres` と `listening on http://localhost:8080` が出ればよい。

別のターミナルで確認する。

```bash
# 存在するユーザー（シードの tarou）→ 200 と JSON
curl -i http://localhost:8080/api/profiles/tarou

# 存在しないユーザー → 404
curl -i http://localhost:8080/api/profiles/nobody
```

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
   - `http://localhost:5173/` … いまは `/tarou` にリダイレクト（デモ用）

API だけ確認する場合は、バックエンド起動後に上記「バックエンド」の `curl` を使う。フロント経由では `curl -i http://localhost:5173/api/profiles/tarou` でも同じ JSON が返る（proxy 経由）。

## CI

GitHub Actions（`.github/workflows/ci.yml`）では、次を PR / push 時に実行する。

- `frontend` … `lint` / `fmt:check` / `build`
- `backend` … `gofmt` / `go vet` / `go test` / `go build`

上に書いたローカルコマンドと対応している。
