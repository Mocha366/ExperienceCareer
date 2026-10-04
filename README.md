# Experience Career

情報科学専門学校向けのイベントキャリア共有サービスです。

リポジトリ構成:

- `frontend/` … Vite + React + TypeScript
- `backend/` … Go（公開プロフィール API）

## 必要なもの

- Node.js（フロント。CI では 22）
- Go（バックエンド。バージョンは `backend/go.mod` を見る）

## フロントエンド

```bash
cd frontend
npm install
npm run dev
```

ブラウザで表示を確認する。

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

API サーバを起動する。

```bash
cd backend
go run ./cmd/server
```

別のターミナルで確認する。

```bash
# 存在するユーザー → 200 と JSON
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

## CI

GitHub Actions（`.github/workflows/ci.yml`）では、次を PR / push 時に実行する。

- `frontend` … `lint` / `fmt:check` / `build`
- `backend` … `gofmt` / `go vet` / `go test` / `go build`

上に書いたローカルコマンドと対応している。
