"""
Comprehensive API Testing Script for Prompt Diary Backend
Tests all public and protected API endpoints.
"""

import httpx
import json
import sys
import io

# Fix Windows encoding — force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

BASE_URL = "http://127.0.0.1:8000"
API = f"{BASE_URL}/api/v1"

# Colors for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

results = []

def log_test(method, endpoint, status_code, success, response_preview="", note=""):
    icon = f"{GREEN}[PASS]{RESET}" if success else f"{RED}[FAIL]{RESET}"
    print(f"\n{BOLD}{icon} [{method}] {endpoint}{RESET}")
    print(f"   Status: {status_code}")
    if note:
        print(f"   Note: {YELLOW}{note}{RESET}")
    if response_preview:
        preview = response_preview[:300]
        print(f"   Response: {CYAN}{preview}{RESET}")
    results.append({
        "method": method,
        "endpoint": endpoint,
        "status": status_code,
        "success": success,
        "note": note
    })


def test_public_apis(client):
    print(f"\n{'='*60}")
    print(f"{BOLD}{CYAN}  TESTING PUBLIC APIs (No Auth Required){RESET}")
    print(f"{'='*60}")

    # 1. Health Check
    print(f"\n{BOLD}--- Health Check ---{RESET}")
    r = client.get(f"{BASE_URL}/")
    log_test("GET", "/", r.status_code, r.status_code == 200, r.text)

    # 2. App Info
    r = client.get(f"{BASE_URL}/info")
    log_test("GET", "/info", r.status_code, r.status_code == 200, r.text)

    # 3. GET /api/v1/articles
    print(f"\n{BOLD}--- Articles ---{RESET}")
    r = client.get(f"{API}/articles")
    log_test("GET", "/api/v1/articles", r.status_code, r.status_code == 200, r.text)
    articles_data = r.json() if r.status_code == 200 else {}

    # 3b. GET /api/v1/articles with filters
    r = client.get(f"{API}/articles", params={"category": "fundamentals"})
    log_test("GET", "/api/v1/articles?category=fundamentals", r.status_code, r.status_code == 200, r.text, "Filtered by category")

    r = client.get(f"{API}/articles", params={"difficulty": "beginner"})
    log_test("GET", "/api/v1/articles?difficulty=beginner", r.status_code, r.status_code == 200, r.text, "Filtered by difficulty")

    # 4. GET /api/v1/challenges
    print(f"\n{BOLD}--- Challenges ---{RESET}")
    r = client.get(f"{API}/challenges")
    log_test("GET", "/api/v1/challenges", r.status_code, r.status_code == 200, r.text)
    challenges_data = r.json() if r.status_code == 200 else {}

    # 4b. Challenges with filters
    r = client.get(f"{API}/challenges", params={"difficulty": "easy"})
    log_test("GET", "/api/v1/challenges?difficulty=easy", r.status_code, r.status_code == 200, r.text, "Filtered by difficulty")

    # 5. GET /api/v1/roadmaps
    print(f"\n{BOLD}--- Roadmaps ---{RESET}")
    r = client.get(f"{API}/roadmaps")
    log_test("GET", "/api/v1/roadmaps", r.status_code, r.status_code == 200, r.text)

    # 5b. Roadmaps with filters
    r = client.get(f"{API}/roadmaps", params={"level": "beginner"})
    log_test("GET", "/api/v1/roadmaps?level=beginner", r.status_code, r.status_code == 200, r.text, "Filtered by level")

    # 6. GET /api/v1/search
    print(f"\n{BOLD}--- Search ---{RESET}")
    r = client.get(f"{API}/search", params={"q": "prompt"})
    log_test("GET", "/api/v1/search?q=prompt", r.status_code, r.status_code == 200, r.text)

    r = client.get(f"{API}/search", params={"q": "prompt", "type": "articles"})
    log_test("GET", "/api/v1/search?q=prompt&type=articles", r.status_code, r.status_code == 200, r.text, "Filtered by type")

    # 7. GET /api/v1/playground/models
    print(f"\n{BOLD}--- Playground ---{RESET}")
    r = client.get(f"{API}/playground/models")
    log_test("GET", "/api/v1/playground/models", r.status_code, r.status_code == 200, r.text)

    # 8. POST /api/v1/playground/run
    r = client.post(f"{API}/playground/run", json={
        "prompt": "Explain what is machine learning in simple terms",
        "model": "gpt-4",
        "temperature": 0.7,
        "max_tokens": 500
    })
    log_test("POST", "/api/v1/playground/run", r.status_code, r.status_code == 200, r.text)

    return articles_data, challenges_data


def test_protected_apis_without_token(client):
    print(f"\n{'='*60}")
    print(f"{BOLD}{RED}  TESTING PROTECTED APIs (Without Token - Should Fail){RESET}")
    print(f"{'='*60}")

    # These should all return 401/403
    endpoints = [
        ("GET", f"{API}/auth/me"),
        ("GET", f"{API}/user-progress"),
        ("GET", f"{API}/user-progress/stats"),
    ]

    for method, url in endpoints:
        r = client.request(method, url)
        expected_fail = r.status_code in [401, 403]
        log_test(method, url.replace(BASE_URL, ""), r.status_code, expected_fail, r.text,
                 "Expected 401 - No auth token provided")

    # PUT /api/v1/auth/profile (should fail)
    r = client.put(f"{API}/auth/profile", json={"username": "test"})
    expected_fail = r.status_code in [401, 403]
    log_test("PUT", "/api/v1/auth/profile", r.status_code, expected_fail, r.text,
             "Expected 401 - No auth token provided")

    # POST /api/v1/user-progress/article (should fail)
    r = client.post(f"{API}/user-progress/article", json={"article_id": "test-123"})
    expected_fail = r.status_code in [401, 403]
    log_test("POST", "/api/v1/user-progress/article", r.status_code, expected_fail, r.text,
             "Expected 401 - No auth token provided")

    # POST /api/v1/user-progress/challenge (should fail)
    r = client.post(f"{API}/user-progress/challenge", json={"challenge_id": "test-123", "score": 80})
    expected_fail = r.status_code in [401, 403]
    log_test("POST", "/api/v1/user-progress/challenge", r.status_code, expected_fail, r.text,
             "Expected 401 - No auth token provided")

    # GET /api/v1/auth/status (should work even without token)
    r = client.get(f"{API}/auth/status")
    log_test("GET", "/api/v1/auth/status", r.status_code, r.status_code == 200, r.text,
             "Auth status works for both authenticated & unauthenticated")


def test_protected_apis_with_token(client, token, articles_data, challenges_data):
    print(f"\n{'='*60}")
    print(f"{BOLD}{GREEN}  TESTING PROTECTED APIs (With JWT Token){RESET}")
    print(f"{'='*60}")

    headers = {"Authorization": f"Bearer {token}"}

    # 1. GET /api/v1/auth/me
    print(f"\n{BOLD}--- Auth ---{RESET}")
    r = client.get(f"{API}/auth/me", headers=headers)
    log_test("GET", "/api/v1/auth/me", r.status_code, r.status_code == 200, r.text)

    # 2. GET /api/v1/auth/status (with token)
    r = client.get(f"{API}/auth/status", headers=headers)
    log_test("GET", "/api/v1/auth/status", r.status_code, r.status_code == 200, r.text,
             "Should show authenticated=true")

    # 3. PUT /api/v1/auth/profile
    r = client.put(f"{API}/auth/profile", headers=headers, json={
        "username": "test_user",
        "display_name": "Test User"
    })
    log_test("PUT", "/api/v1/auth/profile", r.status_code, r.status_code == 200, r.text)

    # 4. GET /api/v1/user-progress
    print(f"\n{BOLD}--- User Progress ---{RESET}")
    r = client.get(f"{API}/user-progress", headers=headers)
    log_test("GET", "/api/v1/user-progress", r.status_code, r.status_code == 200, r.text)

    # 5. GET /api/v1/user-progress/stats
    r = client.get(f"{API}/user-progress/stats", headers=headers)
    log_test("GET", "/api/v1/user-progress/stats", r.status_code, r.status_code == 200, r.text)

    # 6. POST /api/v1/user-progress/article
    article_id = None
    if isinstance(articles_data, list) and len(articles_data) > 0:
        article_id = articles_data[0].get("id")
    elif isinstance(articles_data, dict):
        items = articles_data.get("articles", articles_data.get("data", []))
        if items and len(items) > 0:
            article_id = items[0].get("id")

    if article_id:
        r = client.post(f"{API}/user-progress/article", headers=headers, json={
            "article_id": article_id
        })
        log_test("POST", "/api/v1/user-progress/article", r.status_code,
                 r.status_code == 200, r.text, f"article_id={article_id}")
    else:
        print(f"\n{YELLOW}⚠️  Skipping POST /user-progress/article - no article_id found{RESET}")

    # 7. POST /api/v1/user-progress/challenge
    challenge_id = None
    if isinstance(challenges_data, list) and len(challenges_data) > 0:
        challenge_id = challenges_data[0].get("id")
    elif isinstance(challenges_data, dict):
        items = challenges_data.get("challenges", challenges_data.get("data", []))
        if items and len(items) > 0:
            challenge_id = items[0].get("id")

    if challenge_id:
        r = client.post(f"{API}/user-progress/challenge", headers=headers, json={
            "challenge_id": challenge_id,
            "score": 80
        })
        log_test("POST", "/api/v1/user-progress/challenge", r.status_code,
                 r.status_code == 200, r.text, f"challenge_id={challenge_id}, score=80")
    else:
        print(f"\n{YELLOW}⚠️  Skipping POST /user-progress/challenge - no challenge_id found{RESET}")

    # 8. Verify stats updated after marking progress
    print(f"\n{BOLD}--- Verify Updated Stats ---{RESET}")
    r = client.get(f"{API}/user-progress/stats", headers=headers)
    log_test("GET", "/api/v1/user-progress/stats (after updates)", r.status_code,
             r.status_code == 200, r.text, "Check if stats updated after article/challenge completion")


def test_invalid_token(client):
    print(f"\n{'='*60}")
    print(f"{BOLD}{YELLOW}  TESTING WITH INVALID TOKEN{RESET}")
    print(f"{'='*60}")

    headers = {"Authorization": "Bearer invalid-token-12345"}

    r = client.get(f"{API}/auth/me", headers=headers)
    expected_fail = r.status_code == 401
    log_test("GET", "/api/v1/auth/me (invalid token)", r.status_code, expected_fail, r.text,
             "Expected 401 - Invalid token")

    r = client.get(f"{API}/user-progress/stats", headers=headers)
    expected_fail = r.status_code == 401
    log_test("GET", "/api/v1/user-progress/stats (invalid token)", r.status_code, expected_fail, r.text,
             "Expected 401 - Invalid token")


def print_summary():
    print(f"\n{'='*60}")
    print(f"{BOLD}  TEST SUMMARY{RESET}")
    print(f"{'='*60}")

    total = len(results)
    passed = sum(1 for r in results if r["success"])
    failed = total - passed

    print(f"\n  Total Tests: {BOLD}{total}{RESET}")
    print(f"  {GREEN}Passed: {passed}{RESET}")
    print(f"  {RED}Failed: {failed}{RESET}")
    print(f"  Pass Rate: {BOLD}{(passed/total*100):.1f}%{RESET}\n")

    if failed > 0:
        print(f"{RED}Failed Tests:{RESET}")
        for r in results:
            if not r["success"]:
                print(f"  ❌ [{r['method']}] {r['endpoint']} -> {r['status']}  ({r['note']})")

    print(f"\n{'='*60}")


def main():
    token = None
    if len(sys.argv) > 1:
        token = sys.argv[1]

    client = httpx.Client(timeout=15.0)

    try:
        # Phase 1: Test Public APIs
        articles_data, challenges_data = test_public_apis(client)

        # Phase 2: Test Protected APIs without token (should fail with 401)
        test_protected_apis_without_token(client)

        # Phase 3: Test with invalid token
        test_invalid_token(client)

        # Phase 4: Test Protected APIs with valid token (if provided)
        if token:
            test_protected_apis_with_token(client, token, articles_data, challenges_data)
        else:
            print(f"\n{'='*60}")
            print(f"{YELLOW}  SKIPPING PROTECTED API TESTS (WITH TOKEN){RESET}")
            print(f"  Provide JWT token as argument: python test_all_apis.py <token>")
            print(f"{'='*60}")

        # Print Summary
        print_summary()

    finally:
        client.close()


if __name__ == "__main__":
    main()
