"""Quick end-to-end health check for the full stack."""
import httpx

BASE = "http://localhost:8000"
FRONT = "http://localhost:3000"

print("=" * 55)
print("  PROMPT DIARY — FULL STACK HEALTH CHECK")
print("=" * 55)

# Backend API
tests = [
    ("Backend Health", "/"),
    ("Articles API", "/api/v1/articles"),
    ("Challenges API", "/api/v1/challenges"),
    ("Roadmaps API", "/api/v1/roadmaps"),
    ("Auth Status API", "/api/v1/auth/status"),
]

all_ok = True
for name, path in tests:
    try:
        r = httpx.get(f"{BASE}{path}", timeout=5)
        data = r.json()
        if "total" in data:
            detail = f"{data['total']} items from Supabase DB"
        elif "status" in data:
            detail = data["status"]
        elif "authenticated" in data:
            detail = f"authenticated={data['authenticated']}"
        else:
            detail = "OK"
        status = "PASS" if r.status_code == 200 else "FAIL"
        print(f"  [{status}] {name:<20} -> {detail}")
    except Exception as e:
        print(f"  [FAIL] {name:<20} -> {e}")
        all_ok = False

# Frontend
print()
try:
    r = httpx.get(FRONT, timeout=5, follow_redirects=True)
    print(f"  [PASS] Frontend (Next.js)   -> {r.status_code} OK ({len(r.text)} bytes)")
except Exception as e:
    print(f"  [FAIL] Frontend (Next.js)   -> {e}")
    all_ok = False

# Frontend pages
for page in ["/login", "/signup", "/articles"]:
    try:
        r = httpx.get(f"{FRONT}{page}", timeout=5, follow_redirects=True)
        print(f"  [PASS] Page {page:<15} -> {r.status_code} OK")
    except Exception as e:
        print(f"  [FAIL] Page {page:<15} -> {e}")
        all_ok = False

print()
print("=" * 55)
if all_ok:
    print("  ALL SYSTEMS GO! Full stack is working perfectly.")
else:
    print("  SOME CHECKS FAILED - see above for details.")
print("=" * 55)
