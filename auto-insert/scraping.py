import os
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import re
from datetime import datetime, timedelta

# 定数を定義
UNIQLO_DOMAIN = "https://www.uniqlo.com"
OPEN_URL = UNIQLO_DOMAIN + "/jp/ja/feature/limited-offers/men"
TIME_DIFFERENCE = 0  # UTCとの時差
API_URL = " http://localhost:5173/api/insert-product-discounts"

# スクレイピング設定
webdriver_service = Service(ChromeDriverManager().install())
options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

# 現在の日付を取得
current_date = datetime.today()
date_include_time_diff = current_date + timedelta(hours=TIME_DIFFERENCE)
formatted_date = date_include_time_diff.strftime('%Y-%m-%d')

# スクレイピング処理
print("Start scraping...")
driver = webdriver.Chrome(service=webdriver_service, options=options)
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
            "gender": 2,  # 固定値（必要に応じて変更可能）
            "officialUrl": page_url,
            "imageUrl": image_url,
            "price": price,
            "date": formatted_date
        })

    # APIリクエスト
    form = {"productDiscounts": product_discounts}

    try:
        response = requests.post(API_URL, json=form)
        response.raise_for_status()
        print(f"Data successfully sent to API: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to send data to API: {e}")
else:
    print('Failed to get elements')
    print(f'Names count: {len(names)}')
    print(f'Prices count: {len(prices)}')
    print(f'product_codes count: {len(product_codes)}')

driver.quit()