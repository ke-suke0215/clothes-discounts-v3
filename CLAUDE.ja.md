# CLAUDE.md

このファイルは、このリポジトリ内のコードを扱う際に Claude
Code（claude.ai/code）に向けたガイドラインを提供します。

## コマンド一覧

### 開発

- `npm run dev` - Vite の開発サーバーを起動してローカル開発を開始
- `npm run start` - Wrangler の開発サーバーを起動（Cloudflare
  Workers ランタイム）
- `npm run build && npm run start` - workerd ランタイム上でローカル動作確認

### テスト & 品質チェック

- `npm run test` - Playwright を UI モードで実行
- `npm run lint` - ESLint を実行
- `npm run typecheck` - TypeScript の型チェックと Wrangler 型の生成を実行
- `npm run format` - Prettier でコードを整形

### デプロイ

- `npm run deploy` - 本番環境に Cloudflare Workers へデプロイ

### データベース & 型生成

- `npm run typegen` - `wrangler.toml` および `.dev.vars` から環境変数の型を生成

## アーキテクチャ

このプロジェクトは Cloudflare
Workers 上にデプロイされた Remix アプリケーションで、以下の主要なアーキテクチャパターンを採用しています。

### バックエンド層（クリーンアーキテクチャ）

バックエンドはレイヤードアーキテクチャを採用しています：

- **ドメインモデル**（`app/backend/domain/models/`）: 中核となるビジネスエンティティ（Product、DiscountHistory、Gender など）
- **アプリケーションサービス**（`app/backend/application/`）: ビジネスロジックの統括レイヤー
- **インフラストラクチャ**（`app/backend/infrastructure/`）:
  Prisma を使ったデータアクセス用リポジトリ
- **エラーハンドリング**（`app/backend/errors/`）: アプリケーション用のカスタムエラー型

### データベース

- **Cloudflare D1**（SQLite）をデータベースとして使用
- **Prisma ORM**（D1 アダプターを利用）
- データベース接続は `load-context.ts`
  にて PrismaClient を D1 アダプターとともに作成
- マイグレーションファイルは `/migrations/` ディレクトリに配置

### データフロー

1. Remix のルートが HTTP リクエストを処理
2. 各ルートがアプリケーションサービスを呼び出してビジネスロジックを実行
3. サービスはインフラ層のリポジトリを使ってデータアクセス
4. リポジトリは D1 アダプター付きの Prisma を通じて DB を操作

### フロントエンド

- **Remix** + React による SSR / クライアントサイドレンダリング
- **Tailwind CSS** によるスタイリング、`app/components/ui/`
  にカスタム UI コンポーネントを配置
- **Radix UI** によるアクセシブルな UI プリミティブを活用

### 主要な統合ポイント

- `load-context.ts` - 各リクエストごとに DB 接続を設定
- `app/database/client.ts` - Prisma D1 アダプターを使用した DB 接続ファクトリ
- アプリケーションサービスには PrismaClient が依存性注入パターンで渡される

### 環境構成

- `.dev.vars` ファイルにローカル用のシークレットを定義
- `wrangler.toml` の vars セクションに環境変数を記述
- D1 データベースバインディングも `wrangler.toml` に設定
- `npm run typegen` で型生成が可能
