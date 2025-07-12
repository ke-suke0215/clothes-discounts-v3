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

        # 必要なデータを抽出
        products = soup.find_all('a', class_='product-tile__link')
        
        names = []
        prices = []
        product_codes = []
        page_urls = []
        image_urls = []
        
        for product in products:
            # 商品名: 最初の画像のalt属性
            img = product.find('img', class_='image__img')
            name = img.get('alt') if img else None
            names.append(name)
            
            # 価格: ¥を含むdivテキスト
            price_div = product.find('div', string=re.compile(r'¥[0-9,]+'))
            price = None
            if price_div:
                price_text = price_div.get_text().replace('¥', '').replace(',', '')
                price = int(price_text) if price_text.isdigit() else None
            prices.append(price)
            
            href = product.get('href', '')
            product_code_match = re.search(r'/products/([^/]+)/\d+', href)
            product_code = product_code_match.group(1) if product_code_match else None
            product_codes.append(product_code)
            
            # ページURL
            full_url = UNIQLO_DOMAIN + href if href else None
            page_urls.append(full_url)
            
            # 画像URL: 最初の画像のsrc
            image_url = img.get('src') if img else None
            image_urls.append(image_url)

        # データの整形とAPIリクエスト
        if len(names) == len(prices) == len(product_codes):
            product_discounts = []

            for name, price, product_code, page_url, image_url in zip(names, prices, product_codes, page_urls, image_urls):
                # Noneの場合はスキップ
                if not all([name, price, product_code, page_url, image_url]):
                    continue
                product_discounts.append({
                    "productCode": product_code,
                    "name": name,
                    "gender": gender_id,
                    "officialUrl": page_url,
                    "imageUrl": image_url,
                    "price": price,
                    "date": formatted_date
                })

            # APIリクエスト
            form = {"productDiscounts": product_discounts}

            # リクエスト内容を出力
            print("Sending data to API...")
            print(json.dumps(form, indent=2, ensure_ascii=False))

            try:
                # APIキーをヘッダーに追加
                headers = {
                    "Insert-Discount-API-Key": os.getenv("INSERT_DISCOUNT_API_KEY")
                }
                response = requests.post(API_URL, json=form, headers=headers)
                response.raise_for_status()
                print(f"Data successfully sent to API: {response.json()}")
            except requests.exceptions.RequestException as e:
                print(f"Failed to send data to API: {e}")
                sys.exit(1)
        else:
            print('Failed to get elements')
            print(f'Names count: {len(names)}')
            print(f'Prices count: {len(prices)}')
            print(f'product_codes count: {len(product_codes)}')
            sys.exit(1)

    finally:
        driver.quit()