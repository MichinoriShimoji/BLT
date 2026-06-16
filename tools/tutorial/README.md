# BLT チュートリアル動画ジェネレータ

実際の `blt.html` を Chrome で自動操作し、無音＋日本語字幕のデモ動画
（1280×720・約28秒・MP4）を生成します。UIを変更したら作り直せます。

## 必要なもの

- Node.js
- ffmpeg（`brew install ffmpeg`）
- Google Chrome（システムにインストール済み。Chromium の追加DLは不要）
- ソース音声（WAV）— フィールド録音などを1本。リポジトリには含めません。

## 使い方

```bash
cd tools/tutorial
./make_demo.sh /path/to/source.wav        # 既定: 8秒地点から12秒を使用
./make_demo.sh /path/to/source.wav 30 15  # 30秒地点から15秒を使用
```

`blt_tutorial.mp4` がこのフォルダに出力されます（ローカルのみ。コミットしません）。

## 仕組み

1. `make_demo.sh` がソースWAVから `demo.wav` を切り出す（ffmpeg）。
2. `shoot.js` が Chrome で `../../blt.html` を開き、WAV読み込み→自動区切り→
   注釈入力→書き出し→分析タブ…の各シーンを字幕付きで `frames/NN.png` に保存
   （puppeteer-core + システムChrome、WAVはbase64で直接注入するためサーバ不要）。
3. `make_demo.sh` が `frames/*.png` を ffmpeg で MP4 に結合。

## カスタマイズ

- シーン・字幕: `shoot.js` の各 `Scene` ブロックを編集。
- 1シーンの長さ・解像度: `make_demo.sh` の ffmpeg 行（`-framerate 1/4` など）。
- パス上書き: 環境変数 `CHROME` / `BLT_HTML` / `DEMO_WAV`。

## 注意

`node_modules/`・`frames/`・`demo.wav`・`*.mp4` は `.gitignore` 済み
（生成物とソース音声はコミットしない）。
