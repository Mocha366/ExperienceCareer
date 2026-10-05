# DB は PostgreSQL、ローカルは Docker にする

## 決定

永続化には PostgreSQL を使う。

ローカル開発では Docker（Compose）で Postgres を起動する。アプリ本体（Go / Vite）はこれまでどおりホストで動かす。

SQLite や MySQL は採用しない。

テーブル定義・migration・公開 API の DB 読み替え・Google ログインは、この ADR では決めない。別の小さな issue で進める。

## 切った案

- SQLite（ローカルは楽だが、本番を別 DB にすると二重管理になりやすい）
- MySQL / MariaDB（特に理由がなければ Postgres で足りる）
- マシンへの Postgres 直入れを前提にする（プロジェクト用に Docker で足りる）

## 理由

- 認証・編集に進むと、再起動で消えるメモリ保存では足りない
- 本番想定と同時書き込みを考えると Postgres が扱いやすい
- ローカルは Docker なら直入れせずに起動・停止できる
- 操作範囲を小さく保つため、DB 選定とローカル起動手段だけ先に決める
