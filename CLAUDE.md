# CLAUDE.md

このファイルは、このリポジトリでのコード作業時にClaude Code
(claude.ai/code) にガイダンスを提供します。

## コマンド

### 開発

- `npm run dev` - 開発用のVite devサーバーを起動
- `npm run start` - Wrangler devサーバーを起動（Cloudflare Workers実行時）
- `npm run build && npm run start` - workerd実行時でローカルテスト

### テスト・品質管理

- `npm run test` - Playwright テストをUIモードで実行
- `npm run lint` - ESLint を実行
- `npm run typecheck` - TypeScript型チェックとWranglerタイプ生成を実行
- `npm run format` - Prettier でコードフォーマット

### デプロイ

- `npm run deploy` - Cloudflare Workers本番環境にデプロイ

### データベース・タイプ

- `npm run typegen` - wrangler.toml と .dev.vars から環境タイプを生成

## アーキテクチャ

このプロジェクトは、以下の主要なアーキテクチャパターンを持つCloudflare
Workers上で動作するRemixアプリケーションです：

### バックエンドレイヤー（クリーンアーキテクチャ）

バックエンドは階層化されたアーキテクチャパターンに従います：

- **ドメインモデル**
  (`app/backend/domain/models/`)：コアビジネスエンティティ（Product、DiscountHistory、Gender）
- **アプリケーションサービス**
  (`app/backend/application/`)：ビジネスロジック オーケストレーション層
- **インフラストラクチャ**
  (`app/backend/infrastructure/`)：Prismaを使用したデータアクセス リポジトリ
- **エラーハンドリング**
  (`app/backend/errors/`)：アプリケーション用のカスタムエラータイプ

### データベース

- **Cloudflare D1** (SQLite) をデータベースとして使用
- **Prisma ORM** と D1 アダプターによるデータベース操作
- データベース接続は `load-context.ts`
  で設定され、D1 アダプターを持つ PrismaClient を作成
- マイグレーションファイルは `/migrations/` ディレクトリに配置

### データフロー

1. Remix ルートが HTTP リクエストを処理
2. ルートがビジネスロジックのためにアプリケーションサービスを呼び出し
3. サービスがデータアクセスのためにインフラストラクチャ リポジトリを使用
4. リポジトリがデータベースクエリのために D1 アダプターを持つ Prisma を使用

### フロントエンド

- **Remix** と React による SSR/クライアントサイドレンダリング
- **Tailwind CSS** による スタイリング、カスタムUIコンポーネントは
  `app/components/ui/` に配置
- **Radix UI** コンポーネントによるアクセシブルなUIプリミティブ

### 主要な統合ポイント

- `load-context.ts` - 各リクエストコンテキストでデータベース接続を設定
- `app/database/client.ts` - Prisma
  D1 アダプターを使用したデータベース接続ファクトリー
- アプリケーションサービスは依存性注入パターンを通じてPrismaClientを受け取る

### 環境設定

- ローカル秘密情報は `.dev.vars` ファイルに設定
- 環境変数は `wrangler.toml` の vars セクションに設定
- D1 データベースバインディングは wrangler.toml で設定
- タイプ生成は `npm run typegen` で利用可能

## 開発時の注意点

### データベース操作確認

ローカル開発時のsqliteファイルは以下で確認可能：

```sh
open .wrangler/state/v3/d1/miniflare-D1DatabaseObject
```

### API動作確認

商品割引情報の挿入API確認用のcurlコマンド例：

```sh
curl -X POST http://localhost:5173/api/insert-product-discounts \
-H "Content-Type: application/json" \
-H "Insert-Discount-API-Key: xxxxxxxxx" \
-d '{
  "productDiscounts": [
    {
      "productCode": "418910",
      "name": "ストレッチセルビッジスリムフィットジーンズ",
      "gender": 1,
      "officialUrl": "https://www.uniqlo.com/jp/ja/products/E418910-000/00",
      "imageUrl": "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/418910/item/goods_69_418910.jpg?width=300",
      "price": 1200,
      "date": "2025-05-28"
    }
  ]
}'
```

### スクレイピング機能

`auto-insert/`
ディレクトリには商品データを自動収集するPythonスクリプトが含まれています：

- `men_scraping.py` - メンズ商品データ収集
- `women_scraping.py` - ウィメンズ商品データ収集
- `scraping.py` - 基本スクレイピング機能
