import requests

# リクエスト先の URL
url = "http://localhost:5173/api/insert-product-discount"

# 送信するデータ
data = {
    "name": "Sample Product",
    "price": "1000",
}

# POST リクエストを送信
response = requests.post(url, data=data)

# レスポンスの確認
print("Status Code:", response.status_code)
print("Response Body:", response.text)