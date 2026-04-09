import requests

API_URL = "http://localhost:8000/admin/analytics"

def test_analytics():
    try:
        response = requests.get(API_URL)
        if response.status_code == 200:
            data = response.json()
            print("Successfully fetched analytics data:")
            print(f"Overview: {data.get('overview')}")
            print(f"Departments: {len(data.get('department_performance'))}")
            print(f"Top Contributors: {len(data.get('top_contributors'))}")
            print(f"Recent Activity: {len(data.get('recent_activity'))}")
        else:
            print(f"Failed to fetch data: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_analytics()
