#!/usr/bin/env bash
# BLT チュートリアル動画 (無音+字幕, 1280x720) を生成する。
#
# 使い方:
#   ./make_demo.sh <source.wav> [開始秒=8] [長さ秒=12]
#
# 例:
#   ./make_demo.sh ~/field/irabu_02.wav 8 12
#
# 必要: Node.js, ffmpeg, Google Chrome (システムにインストール済み)
# 出力: ./blt_tutorial.mp4  (ローカルのみ。リポジトリにはコミットしない)
set -euo pipefail
cd "$(dirname "$0")"

SRC="${1:?使い方: ./make_demo.sh <source.wav> [開始秒] [長さ秒]}"
START="${2:-8}"
DUR="${3:-12}"

command -v ffmpeg >/dev/null || { echo "ffmpeg が必要です (brew install ffmpeg)"; exit 1; }
command -v node   >/dev/null || { echo "Node.js が必要です"; exit 1; }

[ -d node_modules ] || { echo "==> puppeteer-core を導入"; npm install; }

echo "==> 1) デモWAVを切り出し (${START}s から ${DUR}s, mono 44.1k 16bit)"
ffmpeg -y -ss "$START" -t "$DUR" -i "$SRC" -ac 1 -ar 44100 -c:a pcm_s16le demo.wav

echo "==> 2) Chrome でBLTを操作してフレームをキャプチャ"
find frames -name '*.png' -delete 2>/dev/null || true
node shoot.js

echo "==> 3) ffmpeg で MP4 に結合 (各シーン4秒)"
ffmpeg -y -framerate 1/4 -i frames/%02d.png \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p,fps=30,fade=t=in:st=0:d=0.5" \
  -c:v libx264 -pix_fmt yuv420p -movflags +faststart blt_tutorial.mp4

echo "==> 完成: $(pwd)/blt_tutorial.mp4"
