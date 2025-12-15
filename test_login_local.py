import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def test_login_flow():
    # 1. Login
    login_url = f"{BASE_URL}/auth/login"
    payload = {
        "email": "user@test.com",
        "password": "user123"
    }
    
    print(f"Testing Login: {login_url}")
    try:
        response = requests.post(login_url, json=payload)
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.text}")
        
        if response.status_code != 200:
            print("Login failed!")
            return

        data = response.json()
        token = data.get('access_token')
        print(f"Token received: {token[:20]}...")
        
        # 2. Get Me
        me_url = f"{BASE_URL}/auth/me"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        print(f"\nTesting Get Me: {me_url}")
        print(f"Headers: {headers}")
        response = requests.get(me_url, headers=headers)
        print(f"Me Status: {response.status_code}")
        print(f"Me Response: {response.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login_flow()
