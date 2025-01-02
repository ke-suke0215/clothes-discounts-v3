# Daily Scraping

## Overview

pythonのコードでユニクロのWebサイトに対しスクレイピングを行い、割引の情報をRemixのアプリケーションが用意しているAPIに対してリクエストする。
それに必要なpythonのコード, Dockerfileなどが配置されている。

基本は GithubActions から実行されるものである。

## ファイル構成

- clothes-discounts-v3
  - 仮想環境を作成するための venv 用のディレクトリ（Dockerfileを使って必要なライブラリをインストールすれば不要）
- Dockerfile
  - スクレイピングを動かすために必要なライブラリなどがインストールされたコンテナイメージを作成できる
- requirements.txt
  - スクレイピングを動かすために必要なライブラリが明記されている
- scraping.py
  - スクレイピングを実行する本体
- men_scraping.py
  - `scraping.py` をメンズ商品向けに実行するためのファイル
- women_scraping.py
  - `scraping.py` をレディース商品向けに実行するためのファイル

## ローカルでの利用方法

```shell
docker run \
  -e REMIX_APP_URL={RemixAppへのURL} \
  discount-scraper:1.0.2 \
  python women_scraping.py
```