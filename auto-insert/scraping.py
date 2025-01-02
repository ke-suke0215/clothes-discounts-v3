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
        names = [element.text for element in soup.find_all('h3', class_='fr-ec-title')]
        prices = [int(element.text.replace('¥', '').replace(',', '')) for element in soup.find_all('p', class_='fr-ec-price-text')]
        product_codes = [element.get('id') for element in soup.find_all('a', class_='fr-ec-product-tile')]
        page_urls = [UNIQLO_DOMAIN + element.get('href') for element in soup.find_all('a', class_='fr-ec-product-tile')]
        image_urls = [element.get('src') for element in soup.find_all('img', class_='fr-ec-image__img')]

        # データの整形とAPIリクエスト
        if len(names) == len(prices) == len(product_codes):
            product_discounts = []

            for name, price, product_code, page_url, image_url in zip(names, prices, product_codes, page_urls, image_urls):
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