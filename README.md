# Clothes Discount

## Development

開発環境

```sh
npm run dev
```

ローカルのCloudflare環境

```sh
npm run start
```

## デプロイ

Cloudflare本番環境

```sh
npm run deploy
```

## 動作確認

ローカル起動時の sqlite ファイル

```sh
open .wrangler/state/v3/d1/miniflare-D1DatabaseObject
```

insert 処理確認用 curl コマンド

※ API key は適当に設定する必要あり

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

## その他

- 開発時参考にしていた記事
  - https://qiita.com/miriwo/items/04ae58a0705cc54e198c

---

以下、テンプレートの元のREADME。

# remix-cloudflare-template

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix@latest --template edmundhung/remix-cloudflare-template
```

What's included?

- Development with [Vite](https://vitejs.dev)
- Hosting on [Cloudflare Workers](https://developers.cloudflare.com/workers/)
  with [Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Github Actions](https://github.com/features/actions) for continuous
  integration
- Automatic builds and deployments with
  [Workers Build](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Markdoc](https://markdoc.dev) for rendering markdown
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Playwright](https://playwright.dev/)
- Local third party request mocking with [MSW](https://mswjs.io/)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Development

Before start, copy [.dev.vars.example](./.dev.vars.example) and name it
`.dev.vars` with the required secrets.

```sh
cp .dev.vars.example .dev.vars
```

To starts the vite dev server:

```sh
npm run dev
```

You can also start the Playwright UI mode to test your application. You will
find all the tests defined in the [/tests/e2e](./tests/e2e) directory.

```sh
npm run test
```

To test your application on the workerd runtime, you can start the wrangler dev
server with:

```sh
npm run build && npm run start
```

### New environment variable & secret

To add a new secret, please
[update the value](https://developers.cloudflare.com/workers/configuration/secrets/#secrets-in-development)
on the `.dev.vars` file.

For the rest of the environment variable, you can update the **var** section on
the [wrangler.toml](./wrangler.toml) file with the new variable:

```toml
[vars]
NEW_VARIABLE = "..."
```

The variables will be available from the `env` object in the context.

### Setup a KV Namespace

To setup a new KV namespace on the **development environment**, update
[wrangler.toml](./wrangler.toml) with another object similar to the cache
namespace as shown below:

```toml
kv_namespaces = [
  { binding = "cache", id = "cache" },
  { binding = "new_namespace", id = "new_namespace" }
]
```

Note that the `id` has no effect on the dev environment. You can use the same
name for both `id` and `binding`. The namespace will be available form the `env`
object in the context.

### Generate env types

You can generate the types of the `env` object based on `wrangler.toml` and
`.dev.vars` with:

```sh
npm run typegen
```

## Deployment

Before your first deployment, make sure all the environment variables and
bindings are set properly on the
[Cloudlfare Dashboard](https://dash.cloudflare.com/login).

### Creating a new application

To create a new application on the Cloudflare Dashboard, select **Workers and
Pages** from the menu and click on **Create Application**. You can then follow
the instructions based on your needs.

### Setting up environment variables

To set up environment variables, select **Workers and Pages** from the menu and
look for the application details. You will find the **environment variables**
section under the **Settings** tab.

### Setting up KV namespaces

To set up a new KV namespaces, you need to create a new namespace first through
the **KV** menu under **Workers and Pages** and click **Create a namespace**.

After creating the namespace, you can bind the namespace to the application from
the application details page. You can find the setting from the **Functions**
section under the **Settings** tab.

### Debugging

If your application is not working properly, you can find the real-time logs in
the **Functions** tab from the deployment details page.
