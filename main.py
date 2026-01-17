import os
import requests
import json
import time

# --- CẤU HÌNH BẢO MẬT (Lấy từ "Két sắt" của GitHub) ---
YOUTUBE_API_KEY = os.environ.get("AIzaSyAueu53W-r0VWcYJwYrSSboOKuWYQfLn34") 
SUPABASE_KEY = os.environ.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5saXJwZGJydWFtYmhramp1ZG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1OTc3NjIsImV4cCI6MjA4NDE3Mzc2Mn0.bR3IodMstSurbxMBjJj1mZmJrD7bEdrwZU2ejhfGDLA")
SUPABASE_URL = "https://nlirpdbruambhkjjudoa.supabase.co" # URL này để công khai được
PMC_CHANNEL_ID = "UCGRIV5jOtKyAibhjBdIndZQ"

def get_stats_from_youtube():
    print("ang Đang gọi điện cho YouTube...")
    url = f"https://www.googleapis.com/youtube/v3/channels?part=statistics&id={PMC_CHANNEL_ID}&key={YOUTUBE_API_KEY}"
    
    try:
        resp = requests.get(url)
        data = resp.json()
        
        if "items" in data:
            stats = data["items"][0]["statistics"]
            print(f"✅ Đã lấy được: {stats['viewCount']} views | {stats['subscriberCount']} subs")
            return stats
        else:
            print("❌ Lỗi YouTube trả về:", data)
            return None
    except Exception as e:
        print("❌ Lỗi kết nối YouTube:", e)
        return None

def save_to_supabase(metric, value):
    url = f"{SUPABASE_URL}/rest/v1/pmc_stats"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    payload = {
        "platform": "YouTube",
        "metric_type": metric,
        "value": value
    }
    
    try:
        requests.post(url, headers=headers, json=payload)
        print(f"   -> Đã lưu {metric} vào Database.")
    except Exception as e:
        print(f"   -> Lỗi lưu {metric}: {e}")

# --- CHẠY CHƯƠNG TRÌNH ---
if __name__ == "__main__":
    stats = get_stats_from_youtube()
    
    if stats:
        print("💾 Đang lưu vào Supabase...")
        # Lưu View
        save_to_supabase("view_count", int(stats["viewCount"]))
        # Lưu Sub
        save_to_supabase("subscriber_count", int(stats["subscriberCount"]))
        # Lưu Số lượng video
        save_to_supabase("video_count", int(stats["videoCount"]))
        
        print("\n🎉 HOÀN TẤT! Dữ liệu của Phương Mỹ Chi đã được cập nhật.")
    else:
        print("\n⚠️ Không lấy được dữ liệu. Kiểm tra lại YouTube API Key.")