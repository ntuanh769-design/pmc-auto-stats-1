import os
import requests
import time
from datetime import datetime
from bs4 import BeautifulSoup # Thư viện mới để đọc web

# --- LẤY KEY TỪ BIẾN MÔI TRƯỜNG (BẢO MẬT) ---
# Trên GitHub, chúng ta sẽ cấu hình các biến này trong phần Settings
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY") 
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SUPABASE_URL = "https://nlirpdbruambhkjjudoa.supabase.co"
PMC_CHANNEL_ID = "UCGRIV5jOtKyAibhjBdIndZQ"
PMC_SPOTIFY_ID = "4bOdW378KRs2Efn1CNWJgQ" # ID Spotify của Phương Mỹ Chi

# Danh sách Video cần theo dõi
TARGET_VIDEO_IDS = [
    "sZrIbpwjTwk", "V1ah6tmNUz8", "Jh6Xz1WD3C0", 
    "BmrdGQ0LRRo", "KGS6GU16Uqc", "cU1GSszAVi4", 
]

# --- HÀM 1: LẤY MONTHLY LISTENERS TỪ SPOTIFY (MỚI) ---
def get_spotify_listeners():
    print("   🎵 Đang ghé thăm nhà Spotify...")
    url = f"https://open.spotify.com/artist/{PMC_SPOTIFY_ID}"
    try:
        # Giả danh trình duyệt để Spotify không chặn
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        resp = requests.get(url, headers=headers)
        
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'html.parser')
            # Tìm thẻ meta chứa thông tin listeners
            # Thường có dạng: "Listen to Phương Mỹ Chi on Spotify. Artist · 540K monthly listeners."
            meta_tag = soup.find("meta", property="og:description")
            if meta_tag:
                content = meta_tag["content"]
                # Cắt chuỗi để lấy số
                if "monthly listeners" in content:
                    parts = content.split("·")[-1].replace("monthly listeners", "").strip()
                    # Xử lý số liệu (Ví dụ: 540K -> 540000)
                    number_str = parts.replace(",", "").replace(".", "")
                    if "K" in number_str:
                        value = float(number_str.replace("K", "")) * 1000
                    elif "M" in number_str:
                        value = float(number_str.replace("M", "")) * 1000000
                    else:
                        value = int(number_str)
                    
                    print(f"   ✅ Spotify Listeners: {int(value)}")
                    return int(value)
    except Exception as e:
        print(f"   ❌ Lỗi Spotify: {e}")
    return None

# --- HÀM 2: LẤY DỮ LIỆU YOUTUBE ---
def get_channel_stats():
    print("   📡 Đang lấy dữ liệu KÊNH YouTube...")
    if not YOUTUBE_API_KEY: return None
    url = f"https://www.googleapis.com/youtube/v3/channels?part=statistics&id={PMC_CHANNEL_ID}&key={YOUTUBE_API_KEY}"
    try:
        resp = requests.get(url).json()
        if "items" in resp: return resp["items"][0]["statistics"]
    except: pass
    return None

def get_video_stats():
    print(f"   🎥 Đang lấy dữ liệu {len(TARGET_VIDEO_IDS)} VIDEO...")
    if not YOUTUBE_API_KEY: return []
    ids = ",".join(TARGET_VIDEO_IDS)
    url = f"https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id={ids}&key={YOUTUBE_API_KEY}"
    try:
        resp = requests.get(url).json()
        if "items" in resp: return resp["items"]
    except: pass
    return []

# --- HÀM LƯU ---
def save_to_supabase(table, payload):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json", "Prefer": "return=minimal"}
    try:
        requests.post(url, headers=headers, json=payload)
    except Exception as e:
        print(f"Lỗi lưu {table}: {e}")

# --- CHẠY CHÍNH ---
if __name__ == "__main__":
    print(f"--- 🚀 Bắt đầu cập nhật: {datetime.now()} ---")
    
    # 1. YouTube Channel
    c_stats = get_channel_stats()
    if c_stats:
        save_to_supabase("pmc_stats", {"platform": "YouTube", "metric_type": "view_count", "value": int(c_stats["viewCount"])})
        save_to_supabase("pmc_stats", {"platform": "YouTube", "metric_type": "subscriber_count", "value": int(c_stats["subscriberCount"])})
        print("✅ YouTube Channel: OK")

    # 2. Spotify Listeners (MỚI)
    sp_listeners = get_spotify_listeners()
    if sp_listeners:
        save_to_supabase("pmc_stats", {"platform": "Spotify", "metric_type": "monthly_listeners", "value": sp_listeners})
        print("✅ Spotify: OK")

    # 3. YouTube Videos
    v_stats = get_video_stats()
    if v_stats:
        for item in v_stats:
            payload = {
                "video_id": item["id"],
                "title": item["snippet"]["title"],
                "view_count": int(item["statistics"].get("viewCount", 0)),
                "like_count": int(item["statistics"].get("likeCount", 0)),
                "comment_count": int(item["statistics"].get("commentCount", 0))
            }
            save_to_supabase("pmc_video_stats", payload)
        print("✅ Videos: OK")
        
    print("🏁 Hoàn tất!")