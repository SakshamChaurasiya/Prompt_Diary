"""Quick script to test Supabase connection and operations."""

from dotenv import load_dotenv
from supabase import create_client
import os

# Load .env from current directory
load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("=" * 50)
print("  SUPABASE CONNECTION TEST")
print("=" * 50)

# --- Check 1: Env variables loaded ---
print("\n[1] Checking environment variables...")
if not url or "your-" in url:
    print("    FAIL - SUPABASE_URL is missing or placeholder")
    exit(1)
else:
    print(f"    OK - SUPABASE_URL = {url}")

if not key or "your-" in key:
    print("    FAIL - SUPABASE_SERVICE_ROLE_KEY is missing or placeholder")
    exit(1)
else:
    print(f"    OK - SUPABASE_SERVICE_ROLE_KEY = {key[:20]}...")

# --- Check 2: Client creation ---
print("\n[2] Creating Supabase client...")
try:
    supabase = create_client(url, key)
    print("    OK - Client created successfully")
except Exception as e:
    print(f"    FAIL - {e}")
    exit(1)

# --- Check 3: Auth service ---
print("\n[3] Testing Auth service...")
try:
    users = supabase.auth.admin.list_users()
    print(f"    OK - Auth working! Found {len(users)} user(s)")
except Exception as e:
    print(f"    FAIL - {e}")

# --- Check 4: Database (list tables) ---
print("\n[4] Testing Database query...")
try:
    # Try querying a table - change 'articles' to any table you have
    response = supabase.table("articles").select("*").limit(1).execute()
    print(f"    OK - Database working! 'articles' table accessible")
except Exception as e:
    error_msg = str(e)
    if "does not exist" in error_msg or "404" in error_msg:
        print("    WARN - Connected but 'articles' table doesn't exist yet (that's fine)")
    else:
        print(f"    FAIL - {e}")

# --- Check 5: Storage service ---
print("\n[5] Testing Storage service...")
try:
    buckets = supabase.storage.list_buckets()
    print(f"    OK - Storage working! Found {len(buckets)} bucket(s)")
except Exception as e:
    print(f"    FAIL - {e}")

print("\n" + "=" * 50)
print("  ALL CHECKS COMPLETE!")
print("=" * 50)
