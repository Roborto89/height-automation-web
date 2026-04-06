import requests
import os
import json

# Configuration
SUPABASE_URL = "https://yiuicndqkfjodrjjrkuo.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdWljbmRxa2Zqb2Ryampya3VvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzMDIyNiwiZXhwIjoyMDg5NTA2MjI2fQ.UA8CN2_GSq6UrkJJ111_jmj3WLYEhePE8Iyv9fNMp8c"

REQUIRED_USERS = [
    {"email": "joshsmith@heightautomation.com", "name": "Josh Smith", "role": "ADMIN"},
    {"email": "Shanehumphries@heightautomation.com", "name": "Shane Humphries", "role": "EMPLOYEE"},
    {"email": "justinmicallef@heightautomation.com", "name": "Justin Micallef", "role": "EMPLOYEE"},
    {"email": "baylinwehmeir@heightautomation.com", "name": "Baylin Wehmeir", "role": "EMPLOYEE"}
]

def sync_profiles():
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }

    print("Starting deep sync of live profiles...")

    # 1. Fetch all users from Auth
    print("\nFetching users from Auth...")
    auth_url = f"{SUPABASE_URL}/auth/v1/admin/users"
    auth_response = requests.get(auth_url, headers=headers)
    
    if auth_response.status_code != 200:
        print(f"Error fetching auth users: {auth_response.text}")
        return

    auth_users = auth_response.json().get('users', [])
    print(f"Found {len(auth_users)} users in Auth.")

    # 2. Sync each required user
    for req in REQUIRED_USERS:
        target = next((u for u in auth_users if u['email'].lower() == req['email'].lower()), None)
        
        if not target:
            print(f"Warning: User {req['email']} not found in Auth! Skipping profile sync.")
            continue

        user_id = target['id']
        email = req['email'].lower()
        print(f"\nSynchronizing: {email} ({user_id})")

        profile_data = {
            "id": user_id,
            "email": email,
            "name": req['name'],
            "role": req['role'],
            "must_change_password": True,
            "active": True
        }

        # Upsert into profiles
        profile_url = f"{SUPABASE_URL}/rest/v1/profiles"
        upsert_headers = headers.copy()
        upsert_headers["Prefer"] = "resolution=merge-duplicates"
        
        res = requests.post(profile_url, headers=upsert_headers, json=profile_data)
        
        if res.status_code in [200, 201, 204]:
            print(f"Successfully synchronized profile for {email}")
        else:
            # Try without must_change_password if first attempt fails
            print(f"Initial sync failed ({res.status_code}), retrying without security flags...")
            minimal_data = {
                "id": user_id,
                "email": email,
                "name": req['name'],
                "role": req['role'],
                "active": True
            }
            res_min = requests.post(profile_url, headers=upsert_headers, json=minimal_data)
            if res_min.status_code in [200, 201, 204]:
                print(f"Successfully synchronized minimal profile for {email}")
            else:
                 # Last resort: PATCH
                 patch_url = f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}"
                 patch_res = requests.patch(patch_url, headers=headers, json=minimal_data)
                 if patch_res.status_code in [200, 204]:
                     print(f"Successfully synchronized profile for {req['email']} (via PATCH)")
                 else:
                     print(f"Failed to sync profile for {req['email']}: {patch_res.text}")

    print("\nSync complete! Please check the User Management area in the terminal.")

if __name__ == "__main__":
    sync_profiles()
