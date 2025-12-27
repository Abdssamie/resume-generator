
import os
import requests
import sys

API_URL = "http://localhost:8000"
API_SECRET = os.getenv("API_SECRET", "default-dev-secret")

def debug_print(msg):
    print(f"\033[94m[DEBUG] {msg}\033[0m")

def test_auth():
    # 1. Test Health (Should be public)
    try:
        debug_print("Testing /health ...")
        resp = requests.get(f"{API_URL}/health")
        if resp.status_code == 200:
            print("✅ /health accessible without auth")
        else:
            print(f"❌ /health failed: {resp.status_code}")
    except Exception as e:
        print(f"❌ /health connection failed: {e}")

    # 2. Test /generate WITHOUT key (Should fail)
    try:
        debug_print("Testing /generate WITHOUT auth...")
        resp = requests.post(f"{API_URL}/generate", json={"name": "Test"})
        if resp.status_code in [403, 401]:
             print(f"✅ /generate rejected without auth ({resp.status_code})")
        else:
             print(f"❌ /generate allowed without auth! Code: {resp.status_code}")
    except Exception as e:
         print(f"❌ Connection failed: {e}")

    # 3. Test /generate WITH WRONG key (Should fail)
    try:
        debug_print("Testing /generate WITH WRONG auth...")
        resp = requests.post(f"{API_URL}/generate", json={"name": "Test"}, headers={"X-API-Key": "wrong-key"})
        if resp.status_code in [403, 401]:
             print(f"✅ /generate rejected with wrong auth ({resp.status_code})")
        else:
             print(f"❌ /generate allowed with wrong auth! Code: {resp.status_code}")
    except Exception as e:
         print(f"❌ Connection failed: {e}")
         
    # 4. Test /generate WITH CORRECT key (Should fail validation but pass auth)
    # sending minimal data to pass pydantic validation if possible or expect 422
    try:
        debug_print("Testing /generate WITH CORRECT auth...")
        # minimal resume data
        data = {
            "name": "Test User",
            "social_networks": [],
            "experience": [],
            "education": [],
            "projects": [],
            "skills": [],
            "custom_sections": []
        }
        resp = requests.post(f"{API_URL}/generate", json=data, headers={"X-API-Key": API_SECRET})
        
        if resp.status_code == 200:
            print("✅ /generate accessible with correct auth")
        elif resp.status_code == 422:
             print("✅ /generate passed auth but failed validation (Expected)")
        else:
            print(f"❌ /generate failed with code: {resp.status_code}")
            print(resp.text)
    except Exception as e:
         print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_auth()
