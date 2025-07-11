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
    
    # ローカル環境とDocker環境で分岐
    try:
        # Docker環境用の設定
        options.binary_location = '/usr/bin/chromium'
        service = Service('/usr/bin/chromedriver')
        driver = webdriver.Chrome(service=service, options=options)
    except Exception as e:
        print(f"Docker chromedriver not found, trying system chromedriver: {e}")
        # ローカル環境用（webdriver-managerを使用）
        from webdriver_manager.chrome import ChromeDriverManager
        # Remove the binary_location for local environment
        options.binary_location = None
        service = Service(ChromeDriverManager().install())
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

        # JavaScript で動的に読み込まれる要素を待つ
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        
        try:
            # 商品リンクが読み込まれるまで待つ（最大30秒）
            wait = WebDriverWait(driver, 30)
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "a[href*='/jp/ja/products/'] h3")))
            print("Product elements loaded successfully")
        except Exception as e:
            print(f"Warning: Could not find product elements: {e}")
            # 追加で待機時間を設ける
            time.sleep(15)

        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        # 必要なデータを抽出（2025年7月時点の構造に対応）
        # 商品リンクを取得
        product_links = soup.find_all('a', href=re.compile(r'/jp/ja/products/'))
        print(f"Found {len(product_links)} product links")
        
        # 商品名を取得（新旧両方の構造に対応）
        names = []
        for link in product_links:
            product_name = None
            
            # 旧構造：h3タグ内の商品名
            h3_element = link.find('h3')
            if h3_element:
                product_name = h3_element.text.strip()
            else:
                # 新構造：img要素のalt属性から商品名を取得
                img_element = link.find('img')
                if img_element and img_element.get('alt'):
                    product_name = img_element.get('alt').strip()
            
            # 商品名のバリデーション
            if product_name and len(product_name) >= 3 and len(product_name) <= 100:
                # XSS対策：HTMLタグを除去
                clean_name = re.sub(r'<[^>]+>', '', product_name)
                names.append(clean_name)
        
        # 価格を取得（新旧両方の構造に対応）
        prices = []
        
        # 旧構造用：商品リンク内の価格要素
        for link in product_links:
            price_element = link.find('p', class_='fr-ec-price-text')
            if price_element:
                try:
                    price_text = price_element.get_text().strip()
                    price_match = re.search(r'¥([\d,]+)', price_text)
                    if price_match:
                        price_value = int(price_match.group(1).replace(',', ''))
                        if 0 < price_value < 1000000:
                            prices.append(price_value)
                except (ValueError, AttributeError) as e:
                    print(f"Failed to parse price: {price_text}, error: {e}")
                    continue
        
        # 新構造用：価格要素が商品リンク内にない場合、ページ全体から取得
        if len(prices) == 0:
            print("No prices found in product links, trying page-wide search...")
            # ページ全体から¥を含む文字列を検索
            yen_elements = soup.find_all(string=re.compile(r'¥[\d,]+'))
            for yen_text in yen_elements:
                try:
                    price_match = re.search(r'¥([\d,]+)', yen_text)
                    if price_match:
                        price_value = int(price_match.group(1).replace(',', ''))
                        if 0 < price_value < 1000000:
                            prices.append(price_value)
                except (ValueError, AttributeError) as e:
                    print(f"Failed to parse price: {yen_text}, error: {e}")
                    continue
            
            # 商品数に合わせて価格を調整
            if len(prices) > len(product_links):
                prices = prices[:len(product_links)]
        
        # 商品コードとページURLを取得
        product_codes = []
        page_urls = []
        
        for link in product_links:
            href = link.get('href')
            if href:
                # 商品コードをURLから抽出 (例: /jp/ja/products/E474415-000/00 → E474415-000)
                code_match = re.search(r'/products/([^/]+)/', href)
                if code_match:
                    product_code = code_match.group(1)
                    # 商品コードの形式バリデーション (E123456-000 形式)
                    if re.match(r'^[A-Z]\d{6}-\d{3}$', product_code):
                        product_codes.append(product_code)
                        page_urls.append(UNIQLO_DOMAIN + href)
                    else:
                        print(f"Invalid product code format: {product_code}")
        
        # 商品画像を取得
        image_urls = []
        for link in product_links:
            img_element = link.find('img')
            if img_element:
                src = img_element.get('src')
                if src and 'imagesgoods' in src:
                    image_urls.append(src)

        # データの整形とAPIリクエスト
        print(f'Found {len(names)} names, {len(prices)} prices, {len(product_codes)} product codes, {len(image_urls)} images')
        
        # データの数をチェックして最小数を計算
        min_count = min(len(names), len(prices), len(product_codes), len(page_urls), len(image_urls))
        
        # 0件の場合は処理を終了
        if min_count == 0:
            print('No products found. Check if the website structure has changed.')
            print('Debug info:')
            print(f'Names: {names[:3]}')  # 最初の3つを表示
            print(f'Prices: {prices[:3]}')
            print(f'Product codes: {product_codes[:3]}')
            sys.exit(1)
        
        # データ数の不一致を警告表示
        if len(names) != len(prices) or len(names) != len(product_codes):
            print(f'Warning: Data count mismatch. Using first {min_count} items.')
            print(f'Names count: {len(names)}')
            print(f'Prices count: {len(prices)}')
            print(f'Product codes count: {len(product_codes)}')
            print(f'Page URLs count: {len(page_urls)}')
            print(f'Image URLs count: {len(image_urls)}')
        
        # 取得した商品一覧を表示
        print(f'\n=== 取得した商品一覧 ({min_count}件) ===')
        for i in range(min_count):
            print(f'{i+1:2d}: {names[i]:<40} - ¥{prices[i]:>5,} - {product_codes[i]}')
        
        # データを最小数に調整
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

        # APIリクエスト (テスト環境では実際に送信しない)
        form = {"productDiscounts": product_discounts}

        try:
            # テスト環境の場合は実際にAPIに送信しない
            api_url = os.getenv("REMIX_APP_URL")
            if api_url and "test.example.com" in api_url:
                print("Test environment detected - skipping API request")
                print(f"Would send {len(product_discounts)} products to API")
                print("Sample data:", product_discounts[0] if product_discounts else "No data")
            else:
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