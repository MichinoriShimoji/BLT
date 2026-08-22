# press — announcement graphics

Banner images for announcing a BLT release, plus everything needed to rebuild them.

## Files

| File | What it is |
|---|---|
| `blt_release_16x9.png` | 1600×900 banner. Use this for X / Bluesky / Facebook link cards. |
| `blt_release_16x9@2x.png` | 3200×1800, same layout. For retina display or print. |
| `poster16x9.html` | The layout source. Edit this, then re-render (below). |
| `app_window.png` | Screenshot of the annotation screen, used by the layout. |
| `igt_zoom.png` | Crop of the interlinear gloss rows, used by the layout. |
| `tools/capture.mjs` | Renders any local page to PNG via headless Chrome (CDP). |
| `tools/demo-inject.html` | Script injected into `blt.html` to set up the screenshot state. |

The banner carries the **concept DOI** (`10.5281/zenodo.20707256`), which always
resolves to the latest archived version — so it does not need reprinting when a
new version goes to Zenodo.

## Rebuilding

Start headless Chrome once, then run the capture script against it:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --remote-debugging-port=9333 --user-data-dir=/tmp/bltchrome --no-first-run about:blank &
```

**Re-render the banner** after editing `poster16x9.html`:

```bash
STATIC=1 node tools/capture.mjs "file://$PWD/poster16x9.html" out@2x.png 1600 900 2
```

Then downscale `out@2x.png` to 1600×900 (Lanczos) for the 1× version — rendering at
2× and downscaling gives noticeably cleaner text than rendering at 1×.

**Re-take the app screenshot** (only needed when the UI changes). `tools/demo-inject.html`
loads the built-in demo audio, runs auto-segmentation, switches to the
`text＋morph＋gloss＋trans` tier preset and fills in example sentences, then sets
`document.title` to `SHOT-READY` so the capture script knows when to shoot:

```bash
python3 - <<'PY'
src = open('../blt.html', encoding='utf-8').read()
inj = open('tools/demo-inject.html', encoding='utf-8').read()
i = src.rfind('</body>')
open('/tmp/blt-shot.html', 'w', encoding='utf-8').write(src[:i] + inj + src[i:])
PY
node tools/capture.mjs "file:///tmp/blt-shot.html" /tmp/app_raw.png 1500 1200 2
```

Then crop `/tmp/app_raw.png` to `app_window.png` (the window, top through the third
gloss row) and `igt_zoom.png` (the first sentence's morph/gloss rows).

Do **not** edit `blt.html` to take the screenshot — the injection is kept separate so
the shipped file stays untouched.

## Example sentences

The sentences shown in the screenshot are Miyako (Ryukyuan) examples, following the
one built into the in-app tour. They are illustrative, not data from a published corpus.
