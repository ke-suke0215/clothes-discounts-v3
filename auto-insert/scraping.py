import os
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
import re
from datetime import datetime, timedelta
from dotenv import load_dotenv
import json
import sys

def scrape_and_insert(gender: str, gender_id: int):
    print('Start scraping...')
    
    # Chromeオプションの設定
    options = Options()
    options.add_argument('--no-sandbox')
    options.add_argument('--headless')
    options.add_argument('--disable-dev-shm-usage')
    options.binary_location = '/usr/bin/chromium'  # Chromiumのパスを指定
    
    # ChromeDriverの設定
    service = Service('/usr/bin/chromedriver')  # chromedriverのパスを指定
    
    # WebDriverの初期化
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        # 環境変数をロード
        load_dotenv()

        # 定数を定義
        UNIQLO_DOMAIN = "https://www.uniqlo.com"
        OPEN_URL = UNIQLO_DOMAIN + f"/jp/ja/feature/limited-offers/{gender}"
        TIME_DIFFERENCE = 9  # UTCとの時差
        API_URL = os.getenv("REMIX_APP_URL") + "/api/insert-product-discounts"

        # 現在の日付を取得
        current_date = datetime.today()
        date_include_time_diff = current_date + timedelta(hours=TIME_DIFFERENCE)
        formatted_date = date_include_time_diff.strftime('%Y-%m-%d')

        # スクレイピング処理
        driver.get(OPEN_URL)
        time.sleep(10)

        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        # 必要なデータを抽出（2025年7月時点の構造に対応）
        names = [element.text.strip() for element in soup.find_all('h3')]
        
        # 価格を取得（商品エリア内のみを対象とし、JavaScriptデータを除外）
        product_links = soup.find_all('a', href=re.compile(r'/jp/ja/products/'))
        prices = []
        for link in product_links:
            # 各商品リンク内から価格を検索（期間限定価格表示に対応）
            price_text = link.get_text()
            # パターン: ¥1,2907/17まで -> ¥1,290 と 7/17 を分離
            price_match = re.search(r'¥([\d,]+)(\d+)/(\d+)', price_text)
            if price_match:
                # 価格部分と日付部分を分離
                price_part = price_match.group(1)
                date_part = price_match.group(2)  # 日付の一部が価格に混在
                
                # 価格部分から日付部分を除去
                if len(date_part) == 1:  # 7/17の場合は7が混在
                    # 最後の数字を除去
                    clean_price = price_part[:-1] if price_part[-1] == date_part else price_part
                    prices.append(int(clean_price.replace(',', '')))
                else:
                    # 通常の価格処理
                    prices.append(int(price_part.replace(',', '')))
            else:
                # 通常の価格パターン
                price_match = re.search(r'¥([\d,]+)', price_text)
                if price_match:
                    prices.append(int(price_match.group(1).replace(',', '')))
        
        # 商品コードとページURLを取得（価格取得で使用したのと同じリンクを使用）
        product_codes = []
        page_urls = []
        
        for link in product_links:
            href = link.get('href')
            if href:
                # 商品コードをURLから抽出 (例: /jp/ja/products/E474415-000/00 → E474415-000)
                code_match = re.search(r'/products/([^/]+)/', href)
                if code_match:
                    product_codes.append(code_match.group(1))
                    page_urls.append(UNIQLO_DOMAIN + href)
        
        # 商品画像を取得
        image_urls = []
        for img in soup.find_all('img'):
            src = img.get('src')
            if src and 'imagesgoods' in src:
                image_urls.append(src)

        # データの整形とAPIリクエスト
        print(f'Found {len(names)} names, {len(prices)} prices, {len(product_codes)} product codes, {len(image_urls)} images')
        
        # データの数が一致しない場合の処理を改善
        min_count = min(len(names), len(prices), len(product_codes), len(page_urls), len(image_urls))
        
        if min_count == 0:
            print('No products found. Check if the website structure has changed.')
            print('Debug info:')
            print(f'Names: {names[:3]}')  # 最初の3つを表示
            print(f'Prices: {prices[:3]}')
            print(f'Product codes: {product_codes[:3]}')
            sys.exit(1)
        
        if len(names) != len(prices) or len(names) != len(product_codes):
            print(f'Warning: Data count mismatch. Using first {min_count} items.')
            print(f'Names count: {len(names)}')
            print(f'Prices count: {len(prices)}')
            print(f'Product codes count: {len(product_codes)}')
            print(f'Page URLs count: {len(page_urls)}')
            print(f'Image URLs count: {len(image_urls)}')
        
        # 最小の数まで調整
        names = names[:min_count]
        prices = prices[:min_count]
        product_codes = product_codes[:min_count]
        page_urls = page_urls[:min_count]
        image_urls = image_urls[:min_count]
        
        product_discounts = []
        for i in range(min_count):
            product_discounts.append({
                "productCode": product_codes[i],
                "name": names[i],
                "gender": gender_id,
                "officialUrl": page_urls[i],
                "imageUrl": image_urls[i],
                "price": prices[i],
                "date": formatted_date
            })

        # 0件の場合は明示的に失敗させる
        if len(product_discounts) == 0:
            print('ERROR: No products to process. Scraping failed.')
            sys.exit(1)

        # APIリクエスト
        form = {"productDiscounts": product_discounts}

        try:
            # APIキーをヘッダーに追加
            headers = {
                "Insert-Discount-API-Key": os.getenv("INSERT_DISCOUNT_API_KEY")
            }
            response = requests.post(API_URL, json=form, headers=headers)
            response.raise_for_status()
            print(f"Data successfully sent to API: {response.json()}")
            print(f"Successfully processed {len(product_discounts)} products")
        except requests.exceptions.RequestException as e:
            print(f"Failed to send data to API: {e}")
            sys.exit(1)

    finally:
        driver.quit()