import os
import requests
import time
from datetime import datetime

# --- LẤY KEY TỪ BIẾN MÔI TRƯỜNG (BẢO MẬT) ---
# Trên GitHub, chúng ta sẽ cấu hình các biến này trong phần Settings
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY") 
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SUPABASE_URL = "https://nlirpdbruambhkjjudoa.supabase.co"
PMC_CHANNEL_ID = "UCGRIV5jOtKyAibhjBdIndZQ"

# Danh sách Video cần theo dõi
TARGET_VIDEO_IDS = [
    "sZrIbpwjTwk", "BmrdGQ0LRRo", "V1ah6tmNUz8", 
    "SmXQf8_6bV4", "Z8JT5TNxmVE", "Jq3_WjV7tZk", 
    "4SFEYNJyYaE", "cU1GSszAVi4"
]

def get_channel_stats():
    print("   📡 Đang lấy dữ liệu KÊNH...")
    if not YOUTUBE_API_KEY:
        print("❌ Lỗi: Thiếu YOUTUBE_API_KEY")
        return None
        
    url = f"https://www.googleapis.com/youtube/v3/channels?part=statistics&id={PMC_CHANNEL_ID}&key={YOUTUBE_API_KEY}"
    try:
        resp = requests.get(url)
        data = resp.json()
        if "items" in data:
            return data["items"][0]["statistics"]
    except Exception as e:
        print("   ❌ Lỗi kênh:", e)
    return None

def get_video_stats():
    print(f"   🎥 Đang lấy dữ liệu {len(TARGET_VIDEO_IDS)} VIDEO...")
    if not YOUTUBE_API_KEY: return []
    
    ids_string = ",".join(TARGET_VIDEO_IDS)
    url = f"https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id={ids_string}&key={YOUTUBE_API_KEY}"
    try:
        resp = requests.get(url)
        data = resp.json()
        if "items" in data:
            return data["items"]
    except Exception as e:
        print("   ❌ Lỗi video:", e)
    return []

def save_channel_to_supabase(metric, value):
    url = f"{SUPABASE_URL}/rest/v1/pmc_stats"
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json", "Prefer": "return=minimal"}
    payload = {"platform": "YouTube", "metric_type": metric, "value": value}
    try:
        requests.post(url, headers=headers, json=payload)
    except Exception as e:
        print(f"Lỗi lưu channel: {e}")

def save_video_to_supabase(video_item):
    url = f"{SUPABASE_URL}/rest/v1/pmc_video_stats"
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json", "Prefer": "return=minimal"}
    stats = video_item["statistics"]
    snippet = video_item["snippet"]
    payload = {
        "video_id": video_item["id"],
        "title": snippet["title"],
        "view_count": int(stats.get("viewCount", 0)),
        "like_count": int(stats.get("likeCount", 0)),
        "comment_count": int(stats.get("commentCount", 0))
    }
    try:
        requests.post(url, headers=headers, json=payload)
        print(f"      -> Đã lưu: {snippet['title'][:20]}...")
    except Exception as e:
        print(f"      ❌ Lỗi lưu video: {e}")

# --- CHẠY 1 LẦN RỒI THOÁT (CHO GITHUB ACTIONS) ---
if __name__ == "__main__":
    print(f"--- 🚀 Bắt đầu cập nhật tự động: {datetime.now()} ---")
    
    # 1. Kênh
    c_stats = get_channel_stats()
    if c_stats:
        save_channel_to_supabase("view_count", int(c_stats["viewCount"]))
        save_channel_to_supabase("subscriber_count", int(c_stats["subscriberCount"]))
        print("✅ Kênh: OK")
    
    # 2. Video
    v_stats = get_video_stats()
    if v_stats:
        for item in v_stats:
            save_video_to_supabase(item)
        print("✅ Video: OK")
        
    print("🏁 Hoàn tất!")