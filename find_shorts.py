"""
YouTube APIで動画情報を取得し、Shortsを特定するスクリプト

判定方法:
1. YouTube APIで snippet.publishedAt と contentDetails.duration を取得
2. 2021年以降に投稿された動画のみ対象（Shortsは2021年から）
3. 再生時間が3分（180秒）以下の動画をShorts候補として表示
4. さらに youtube.com/shorts/ID でアクセス可能かチェック（確実な判定）

使い方: cd ~/Downloads/tokai-battle && python3 find_shorts.py
"""
import re
import json
import urllib.request
import urllib.parse
import sys

API_KEY = "AIzaSyAz5fZkU4xYGU3TcjparorovDSuQTkXNnw"

# TokaiVote.jsxからVIDEO IDとYEARを抽出
with open("components/TokaiVote.jsx", "r") as f:
    content = f.read()

# id, title, year を抽出
video_entries = re.findall(
    r'id:\s*"([^"]+)",\s*title:\s*"([^"]*)"[^}]*year:\s*(\d{4})',
    content
)
print(f"Total videos in JSX: {len(video_entries)}")

# 年ごとのマップを作成
video_map = {}  # id -> (title, year)
for vid, title, year in video_entries:
    video_map[vid] = (title, int(year))

# 2021年以降の動画のみ対象
target_ids = [vid for vid, (title, year) in video_map.items() if year >= 2021]
print(f"Videos from 2021+: {len(target_ids)}")

# ============================================================
# Step 1: YouTube APIで duration を取得し、3分以下を候補に
# ============================================================
print("\n=== Step 1: YouTube API で再生時間チェック (3分以下) ===")
short_candidates = []  # (id, title, year, seconds)

for i in range(0, len(target_ids), 50):
    batch = target_ids[i:i+50]
    ids_str = ','.join(batch)
    url = (
        f"https://www.googleapis.com/youtube/v3/videos"
        f"?part=contentDetails,snippet"
        f"&id={ids_str}"
        f"&key={API_KEY}"
    )
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            for item in data.get("items", []):
                vid = item["id"]
                duration = item["contentDetails"]["duration"]
                # Parse ISO 8601 duration (PT1M30S, PT45S, PT2M, etc.)
                m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
                if m:
                    hours = int(m.group(1) or 0)
                    minutes = int(m.group(2) or 0)
                    seconds = int(m.group(3) or 0)
                    total_seconds = hours * 3600 + minutes * 60 + seconds
                    title, year = video_map.get(vid, ("?", 0))
                    if total_seconds <= 180:  # 3分以下
                        short_candidates.append((vid, title, year, total_seconds))
                        print(f"  候補 ({total_seconds}s, {year}年): {title}")
        sys.stdout.flush()
    except Exception as e:
        print(f"  Error at batch {i}: {e}")

print(f"\n3分以下の候補: {len(short_candidates)}本")

# ============================================================
# Step 2: youtube.com/shorts/ID でアクセスチェック
# Shortsなら200、通常動画ならリダイレクト
# ============================================================
print("\n=== Step 2: /shorts/ URL チェック ===")
confirmed_shorts = []

for vid, title, year, secs in short_candidates:
    try:
        url = f"https://www.youtube.com/shorts/{vid}"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        })
        # Don't follow redirects
        class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):
                return None  # Don't follow

        opener = urllib.request.build_opener(NoRedirectHandler)
        try:
            resp = opener.open(req)
            # 200 = Shortsページが表示された = Shorts確定
            if resp.status == 200:
                confirmed_shorts.append(vid)
                print(f"  ✅ SHORTS ({secs}s, {year}年): {title}")
            else:
                print(f"  ❌ 通常動画 ({secs}s, {year}年): {title}")
        except urllib.error.HTTPError as e:
            if e.code in (301, 302, 303, 307, 308):
                # リダイレクト = 通常動画
                print(f"  ❌ 通常動画 ({secs}s, {year}年): {title}")
            else:
                # 判断できないので候補に入れておく
                short_candidates_uncertain = True
                print(f"  ⚠️ 不明 ({secs}s, {year}年, HTTP {e.code}): {title}")
    except Exception as e:
        # URL チェック失敗 → durationベースで判定（60秒以下ならShorts扱い）
        if secs <= 60:
            confirmed_shorts.append(vid)
            print(f"  ⚠️ URL不可→60秒以下なのでShorts扱い ({secs}s, {year}年): {title}")
        else:
            print(f"  ⚠️ URL不可→スキップ ({secs}s, {year}年): {title}")

print(f"\n========================================")
print(f"確定Shorts: {len(confirmed_shorts)}本")
print(f"\n以下をTokaiVote.jsxのSHORTS_IDSに追加してください:")
print(f"========================================")

# Output as JS Set format
if confirmed_shorts:
    print("const SHORTS_IDS = new Set([")
    for i in range(0, len(confirmed_shorts), 5):
        batch = confirmed_shorts[i:i+5]
        line = '  "' + '","'.join(batch) + '",'
        print(line)
    print("]);")
else:
    print("Shortsは見つかりませんでした")

# Also output uncertain candidates for manual review
uncertain = [(vid, title, year, secs) for vid, title, year, secs in short_candidates
             if vid not in confirmed_shorts]
if uncertain:
    print(f"\n⚠️ 手動確認が必要な動画 ({len(uncertain)}本):")
    for vid, title, year, secs in uncertain:
        print(f"  {vid} ({secs}s, {year}年): {title}")
        print(f"    → https://www.youtube.com/shorts/{vid}")
