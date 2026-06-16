/* BLT チュートリアル動画のフレーム生成 (puppeteer-core + システムChrome)
 * 実際の blt.html を Chrome で開き、WAV読み込み→自動区切り→注釈→書き出し→分析…
 * の各シーンを字幕入りでスクリーンショットし frames/NN.png に保存する。
 * 通常は make_demo.sh から呼ばれる。
 *
 * 環境変数:
 *   CHROME    システムChromeのパス (既定: /Applications/Google Chrome.app/...)
 *   BLT_HTML  対象 blt.html の絶対パス (既定: リポジトリ直下の blt.html)
 *   DEMO_WAV  読み込ませるWAVの絶対パス (既定: このフォルダの demo.wav)
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BLT_HTML = process.env.BLT_HTML || path.resolve(__dirname, '..', '..', 'blt.html');
const WAV = process.env.DEMO_WAV || path.resolve(__dirname, 'demo.wav');
const OUTDIR = path.resolve(__dirname, 'frames');

for (const [label, p] of [['Chrome', CHROME], ['blt.html', BLT_HTML], ['WAV', WAV]]) {
  if (!fs.existsSync(p)) { console.error(`${label} が見つかりません: ${p}`); process.exit(1); }
}
fs.mkdirSync(OUTDIR, { recursive: true });
const wavB64 = fs.readFileSync(WAV).toString('base64');
const BLT_URL = 'file://' + BLT_HTML;
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--force-device-scale-factor=1']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await page.goto(BLT_URL, { waitUntil: 'networkidle0' });

  // 字幕バー + 上部進捗バーをページ内に焼き込む
  await page.evaluate(() => {
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:linear-gradient(transparent,rgba(10,18,35,.93) 38%);color:#fff;padding:46px 30px 22px;font-family:-apple-system,"Hiragino Sans",system-ui,sans-serif';
    const inner = document.createElement('div');
    inner.id = 'demoCapTxt';
    inner.style.cssText = 'border-left:4px solid #5a8fe0;padding-left:15px;max-width:1120px;font-size:23px;font-weight:600;line-height:1.5;letter-spacing:.01em';
    bar.appendChild(inner);
    document.body.appendChild(bar);
    const badge = document.createElement('div');
    badge.id = 'demoBadge';
    badge.style.cssText = 'position:fixed;top:0;left:0;width:0;height:4px;background:#5a8fe0;z-index:99999;transition:width .2s';
    document.body.appendChild(badge);
    window.__cap = t => { document.getElementById('demoCapTxt').innerHTML = t; };
  });

  let i = 0;
  const TOTAL = 7;
  const shot = async () => {
    i++;
    await page.evaluate(p => { document.getElementById('demoBadge').style.width = (p * 100) + '%'; }, i / TOTAL);
    await page.screenshot({ path: path.join(OUTDIR, `${String(i).padStart(2, '0')}.png`) });
  };
  const cap = t => page.evaluate(t => window.__cap(t), t);

  // Scene 1 — intro
  await page.evaluate(() => window.scrollTo(0, 0));
  await cap('BLT — ブラウザだけで完結する<br>フィールドデータ編集ツール');
  await wait(400); await shot();

  // Scene 2 — load WAV
  await page.evaluate(b64 => {
    const bin = atob(b64), arr = new Uint8Array(bin.length);
    for (let k = 0; k < bin.length; k++) arr[k] = bin.charCodeAt(k);
    const file = new File([arr], 'demo.wav', { type: 'audio/wav' });
    const dt = new DataTransfer(); dt.items.add(file);
    const inp = document.getElementById('wavInput');
    inp.files = dt.files;
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, wavB64);
  await page.waitForFunction(() => { const n = document.getElementById('wavName'); return n && /秒/.test(n.textContent); }, { timeout: 15000 });
  await wait(800);
  await cap('① 音声（WAV）を読み込むだけ');
  await wait(300); await shot();

  // Scene 3 — auto segmentation
  await page.evaluate(() => { if (typeof detect === 'function') detect(); });
  await page.waitForFunction(() => typeof segs !== 'undefined' && segs.length > 0, { timeout: 8000 });
  await wait(400);
  await page.evaluate(() => { const w = document.getElementById('waveCol'); if (w) w.scrollIntoView({ block: 'center' }); });
  await cap('無音を自動検出して、発話を区間に分割');
  await wait(300); await shot();

  // Scene 4 — annotate
  await page.evaluate(() => {
    const tb = document.getElementById('tb');
    const texts = ['mmja misin-nas-i-i', 'ka=tti u-i-ba=du', 'bookuugoo-gama=u=du', 'jaa=nu acca-gama=n', 'cɨff-i-utui'];
    const trans = ['それでミシンで作って', 'と言っていたので', '防空壕を', '家のお父さんに', '作っていた'];
    for (let r = 0; r < Math.min(5, tb.children.length); r++) {
      const row = tb.children[r], tc = row.children[4], rc = row.children[5];
      if (tc) { tc.textContent = texts[r]; tc.dispatchEvent(new Event('input', { bubbles: true })); }
      if (rc) { rc.textContent = trans[r]; rc.dispatchEvent(new Event('input', { bubbles: true })); }
    }
    const card = document.getElementById('wave').closest('.card') || document.getElementById('waveCol');
    if (card) { window.__wfcard = card; card.style.display = 'none'; }
    window.scrollTo(0, 0);
  });
  await wait(500);
  await page.evaluate(() => { const t = document.getElementById('tb').closest('table'); if (t) t.scrollIntoView({ block: 'center' }); });
  await wait(300);
  await cap('② 区間ごとに文字起こし・注釈・翻訳');
  await wait(200); await shot();

  // Scene 5 — export
  await page.evaluate(() => {
    if (window.__wfcard) window.__wfcard.style.display = '';
    const ex = document.getElementById('cardExport') || document.querySelector('[id^="cardExport"]');
    if (ex) ex.scrollIntoView({ block: 'center' }); else window.scrollTo(0, document.body.scrollHeight);
  });
  await wait(400);
  await cap('③ ELAN EAF / TSV / JSON で書き出し');
  await wait(200); await shot();

  // Scene 6 — analysis tab
  await page.evaluate(() => { const t = document.querySelector('[data-tab="analysis"]'); if (t) t.click(); });
  await wait(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await cap('分析・簡易辞書タブを内蔵');
  await wait(300); await shot();

  // Scene 7 — closing
  await page.evaluate(() => { const t = document.querySelector('[data-tab="anno"]'); if (t) t.click(); window.scrollTo(0, 0); });
  await cap('無料・オープンソース・DOI付き<br><span style="font-size:17px;font-weight:500;color:#cfe0ff">michinorishimoji.github.io/mshimoji.com/blt.html</span>');
  await wait(300); await shot();

  await browser.close();
  console.log('captured frames:', i, '->', OUTDIR);
})().catch(e => { console.error('ERR', e); process.exit(1); });
