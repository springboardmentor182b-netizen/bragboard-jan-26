import requests

API_URL = "http://localhost:8000/admin/reports"

def test_admin_reports():
    try:
        response = requests.get(API_URL)
        if response.status_code == 200:
            data = response.json()
            print(f"Fetched {len(data)} reports.")
            if len(data) > 0:
                first = data[0]
                print(f"Report ID: {first.get('id')}")
                print(f"Created At: {first.get('created_at')}")
                print(f"Reason: {first.get('reason')}")
                print(f"Reporter Name: {first.get('reported_by_name')}")
                print(f"Shoutout Content Present: {'shoutout' in first and first['shoutout'] is not None}")
                if first.get('shoutout'):
                    print(f"Shoutout Content: {first['shoutout'].get('content')}")
        else:
            print(f"Failed: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_admin_reports()
