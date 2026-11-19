#!/usr/bin/env python3
"""
Surya Kunj वेबसाइट — स्वचालित जाँच (Playwright + Chrome, सॉफ़्टवेयर WebGL)।

उपयोग (repo की जड़ से):
    pip install playwright==1.63.0
    python3 tests/run_tests.py [--chrome /path/to/chrome] [--out tests/results]

ध्यान दें:
  * ये सभी जाँच कंप्यूटर पर चलती हैं। "मोबाइल" जाँच = Chrome का mobile emulation (viewport, touch,
    user-agent का अनुकरण) — असली फ़ोन नहीं। असली डिवाइस पर जाँच = NOT TESTED (रिपोर्ट देखें)।
  * 3D के लिए SwiftShader (CPU पर चलने वाला WebGL) प्रयोग होता है; इसकी FPS असली GPU का संकेत नहीं।
  * RERA "sale mode" की जाँच के लिए पेज की प्रति में केवल परीक्षण हेतु नकली मान (TEST-ONLY) डाले
    जाते हैं — ये मान repo की किसी फ़ाइल में नहीं लिखे जाते।
"""
import argparse, asyncio, gzip, json, os, pathlib, platform, re, sys, time

from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument('--chrome', default=os.environ.get('CHROME', '/usr/bin/google-chrome'))
ap.add_argument('--out', default=str(ROOT / 'tests' / 'results'))
A = ap.parse_args()
OUT = pathlib.Path(A.out); (OUT / 'screens').mkdir(parents=True, exist_ok=True)
BASE = ROOT.as_uri() + '/'
GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
R = {}

TEST_RERA = """window.INFO = { rera: { number: 'TEST-ONLY-0000', qr: 'plan.png', authorityUrl: 'https://example.invalid/test-only',
  projectUrl: '', launchDate: 'TEST-01.01.2000', collection: { account: 'TEST-000000', ifsc: 'TEST0000000', bank: 'TEST BANK',
  branch: 'TEST BRANCH', branchAddress: 'TEST ADDRESS' }, agents: [] }, ownerApprovedMarketing: APPROVED, mapUrl: '' };"""


def res(k, ok, ev, kind='SIM'):
    R[k] = {'status': 'PASS' if ok else 'FAIL', 'kind': kind, 'evidence': ev}
    print(('PASS ' if ok else 'FAIL ') + k + ' :: ' + json.dumps(ev, ensure_ascii=False)[:240], flush=True)


def dist(a, b):
    return round(sum((x - y) ** 2 for x, y in zip(a, b)) ** .5, 3)


def watch(pg):
    errs = []
    pg.on('pageerror', lambda e: errs.append('pageerror:' + str(e)))
    pg.on('console', lambda m: errs.append('console:' + m.text) if m.type == 'error' else None)
    return errs


async def patched(ctx, approved, number_only=False):
    """index.html की प्रति में परीक्षण-मान डालकर खोलें (route interception, फ़ाइल नहीं बदलती)।"""
    src = (ROOT / 'index.html').read_text(encoding='utf-8')
    a = src.index('window.INFO = {'); b = src.index('};', a) + 2
    cfg = TEST_RERA.replace('APPROVED', 'true' if approved else 'false')
    if number_only:
        cfg = "window.INFO = { rera: { number: 'TEST-ONLY-0000' }, ownerApprovedMarketing: true, mapUrl: '' };"
    body = src[:a] + cfg + src[b:]
    await ctx.route('**/index.html', lambda r: r.fulfill(status=200, content_type='text/html; charset=utf-8', body=body))


async def patched_cfg(ctx, cfg):
    """index.html की प्रति में दिया गया INFO कॉन्फ़िग (केवल TEST-ONLY मान) डालें।"""
    src = (ROOT / 'index.html').read_text(encoding='utf-8')
    a = src.index('window.INFO = {'); b = src.index('};', a) + 2
    body = src[:a] + cfg + src[b:]
    await ctx.route('**/index.html', lambda r: r.fulfill(status=200, content_type='text/html; charset=utf-8', body=body))


FULL = TEST_RERA.replace('APPROVED', 'false')
STATE_JS = """() => { const vis = e => !!e && e.offsetParent !== null && getComputedStyle(e).display !== 'none';
  const t = document.body.innerText;
  return {state: window.__reraState.state, attr: document.body.getAttribute('data-rera-state'),
    preNote: vis(document.getElementById('preNote')), regNote: vis(document.getElementById('regNote')),
    regNoteText: vis(document.getElementById('regNote')) ? document.getElementById('regNote').innerText.replace(/\\s+/g,' ') : '',
    noBooking: vis(document.getElementById('noBookingStmt')), footerNone: vis(document.getElementById('reraNone')),
    footerNo: vis(document.getElementById('reraHas')) ? document.getElementById('reraNo').textContent : '',
    box: vis(document.getElementById('reraBox')), price: [...document.querySelectorAll('.pc .pr')].filter(vis).length,
    saleHero: [...document.querySelectorAll('[data-sale]')].filter(vis).length,
    saysNotObtained: /अभी प्राप्त नहीं|not yet been obtained|not yet obtained/i.test(t),
    saysRegistered: /UP RERA में पंजीकृत है|UP RERA पंजीकृत परियोजना|registered with UP RERA|UP RERA Registered Project/i.test(t),
    saysNoBooking: /अग्रिम राशि नहीं ली जाएगी|no advance payment will be taken/i.test(t),
    priceEls: document.querySelectorAll('.pc .pr').length, saysPrice: /मूल्य|Price:/.test(t),
    noteAtBottom: (() => { const n = document.querySelector('[data-rera-msg="' + window.__reraState.state + '"]'), f = document.querySelector('footer'), c = document.getElementById('contact');
      return !!n && n.nextElementSibling !== null && (n.nextElementSibling === f || n.nextElementSibling.matches('[data-rera-msg]')) && (c.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING) > 0; })(),
    saysNotPublished: /प्रकाशित नहीं किए गए|have not been published/i.test(t)}; }"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=A.chrome, args=GL)
        env = {'chrome': b.version, 'playwright': '1.63.0', 'python': platform.python_version(), 'os': platform.platform(),
               'webgl': 'SwiftShader (software)', 'date': time.strftime('%Y-%m-%d %H:%M:%S %z')}

        # ---------------- 1. viewports: overflow ----------------
        ov = {}
        for w in [320, 375, 390, 768, 1024, 1440]:
            for lang in ['hi-IN', 'en-US']:
                ctx = await b.new_context(viewport={'width': w, 'height': 820}, locale=lang, is_mobile=w < 800, has_touch=w < 800)
                pg = await ctx.new_page(); errs = watch(pg)
                await pg.goto(BASE + 'index.html'); await pg.wait_for_timeout(1000)
                d = await pg.evaluate('''() => {
                  const W = document.documentElement.clientWidth; const bad = [];
                  document.querySelectorAll('body *').forEach(e => { if (e.closest('#planBox') || e.closest('.ticker') || e.closest('table')) return;
                    const r = e.getBoundingClientRect(); if (r.width && r.right > W + 1 && getComputedStyle(e).position !== 'fixed') bad.push(e.tagName + '.' + (e.className||'') + ':' + Math.round(r.right)); });
                  window.scrollTo(300, window.scrollY); const sx = window.scrollX; window.scrollTo(0, window.scrollY);
                  return {sw: document.documentElement.scrollWidth, sx, W, bad: bad.slice(0, 6)}; }''')
                ov[f'{w}-{lang[:2]}'] = {**d, 'errs': errs}
                if lang == 'hi-IN' and w in (320, 390, 1440):
                    await pg.screenshot(path=str(OUT / 'screens' / f'site_{w}.png'))
                await ctx.close()
        res('R01 सभी viewport (320–1440, हिंदी/English) पर क्षैतिज overflow नहीं', all(v['sx'] == 0 and v['sw'] <= v['W'] + 1 and not v['bad'] and not v['errs'] for v in ov.values()),
            {k: [v['sw'], v['sx'], v['W'], v['bad']] for k, v in ov.items()})

        # ---------------- 2. site functional ----------------
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, locale='hi-IN', is_mobile=True, has_touch=True)
        pg = await ctx.new_page(); errs = watch(pg)
        await pg.goto(BASE + 'index.html'); await pg.wait_for_timeout(1000)
        stat = await pg.evaluate("[...document.querySelectorAll('.stat')].map(s=>s.innerText.replace(/\\s+/g,' '))")
        res('R02 मुख्य आँकड़े: 42 प्लॉट, 8278.63 वर्ग मी., 921–1500 वर्ग फ़ुट', any('42' in s for s in stat) and any('8278.63' in s for s in stat) and any('921–1500' in s for s in stat), stat)
        await pg.click('#menuBtn'); await pg.wait_for_timeout(200)
        links = await pg.evaluate("[...document.querySelectorAll('#mnav a')].map(a => a.getAttribute('href'))")
        missing = await pg.evaluate("[...document.querySelectorAll('#mnav a, header nav a')].map(a => a.getAttribute('href')).filter(h => h.startsWith('#') && h.length > 1 && !document.querySelector(h))")
        await pg.click('#mnav a[href="#plots"]'); await pg.wait_for_timeout(1800)
        closed = await pg.evaluate("document.getElementById('mnav').hidden")
        y = await pg.evaluate("Math.round(document.getElementById('plots').getBoundingClientRect().top)")
        res('R03 मोबाइल मेनू: 9 लिंक, सही जगह पहुँचता, क्लिक पर बंद', not missing and closed and -5 < y < 160 and len(links) == 9, {'links': links, 'missing': missing, 'closed': closed, 'plotsTop': y})
        await pg.click('#langBtn'); await pg.wait_for_timeout(300)
        en = await pg.evaluate("({lang: document.documentElement.lang, left: (()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode.nodeName;return (p==='SCRIPT'||p==='STYLE')?2:1}});const o=[];let n;while(n=w.nextNode()){const e=n.parentElement;if(e.closest('#langBtn')||e.closest('[hidden]')||getComputedStyle(e).display==='none')continue;if(/[\\u0900-\\u097F]/.test(n.nodeValue)&&n.nodeValue.trim())o.push(n.nodeValue.trim())}return o})(), plan: document.querySelector('#planBox img').getAttribute('src'), pre: document.getElementById('preNote').innerText})")
        await pg.click('#langBtn'); await pg.wait_for_timeout(300)
        hi = await pg.evaluate("({lang: document.documentElement.lang, plan: document.querySelector('#planBox img').getAttribute('src'), pre: document.getElementById('preNote').innerText})")
        res('R04 हिंदी ⇄ English (कोई दिखने वाला हिंदी पाठ English मोड में शेष नहीं)', en['lang'] == 'en' and not en['left'] and en['plan'] == 'plan-en.png' and 'UP RERA registration' in en['pre'] and hi['lang'] == 'hi' and 'पंजीकरण' in hi['pre'], {'en': en, 'hi': hi})
        th = []
        for mode in ['dark', 'light', 'auto']:
            await pg.click(f'[data-mode="{mode}"]'); await pg.wait_for_timeout(150)
            th.append(await pg.evaluate("[document.documentElement.dataset.theme, localStorage.getItem('sk-theme'), getComputedStyle(document.body).backgroundColor]"))
        res('R05 थीम लाइट/डार्क/ऑटो', th[0][0] == 'dark' and th[1][0] == 'light' and th[0][2] != th[1][2], th)
        await pg.evaluate("document.querySelector('#plots details').open = true"); await pg.wait_for_timeout(200)
        rows = await pg.evaluate("[...document.querySelectorAll('#plotTables tbody tr')].map(r => [...r.children].map(c => c.textContent))")
        tot = round(sum(float(r[1]) for r in rows), 2)
        sqft = {r[0]: r[2] for r in rows}
        res('R06 प्लॉट तालिका: 42 पंक्तियाँ, कुल 4750.44 वर्ग मी., प्लॉट 31 = 921.16, 32/33 = 1126.87/1126.79', len(rows) == 42 and tot == 4750.44 and sqft.get('31') == '921.16' and sqft.get('32') == '1126.87' and sqft.get('33') == '1126.79',
            {'rows': len(rows), 'total_sqm': tot, '31': sqft.get('31'), '32': sqft.get('32'), '33': sqft.get('33')})
        dm = await pg.evaluate("""[...document.querySelectorAll('#plotTables tbody tr')].map(r => { const c = r.querySelector('td.dim'); const [l, w] = c.dataset.m.split('x').map(Number);
            return {n: r.children[0].textContent, a: +r.children[1].textContent, l, w, ft: c.childNodes[0].textContent.trim()}; })""")
        bad = [d for d in dm if abs(d['l'] * d['w'] - d['a']) > 0.15]
        ftc = {d['n']: d['ft'] for d in dm}
        exp = {'1': '50′ × 20′', '2': '50′ × 30′', '8': '50′ × 30′', '9': '50′ × 25′', '18': '50′ × 26′10″', '22': '50′ × 20′', '25': '50′ × 20′6″', '29': '45′ × 25′', '31': '45′ × 20′6″', '32': '35′3″ × 32′', '33': '35′3″ × 32′', '42': '50′ × 20′6″'}
        res('R30 सभी 42 प्लॉट का नाप; लंबाई × चौड़ाई ≈ स्वीकृत क्षेत्रफल (±0.15 वर्ग मी.)', len(dm) == 42 and not bad and all(ftc.get(k) == v for k, v in exp.items()),
            {'rows': len(dm), 'mismatch': bad, 'checked': {k: ftc.get(k) for k in exp}, 'max_diff': max(round(abs(d['l'] * d['w'] - d['a']), 3) for d in dm)})
        vd = await pg.evaluate('''async () => { const v = document.querySelector('#video video'); const pre = v.getAttribute('preload'); v.muted = true; v.preload='auto'; try { await v.play(); } catch (e) { return 'play-error:' + e.message; }
          await new Promise(r => setTimeout(r, 1500)); const t = v.currentTime; v.pause(); return {preload: pre, t, w: v.videoWidth}; }''')
        res('R07 वीडियो (preload=none) दबाने पर चलता है', isinstance(vd, dict) and vd['preload'] == 'none' and vd['t'] > 0.3, vd)
        res('R08 वेबसाइट पर JS त्रुटि नहीं', not errs, errs)
        await ctx.close()

        # ---------------- 3. RERA gating ----------------
        ctx = await b.new_context(viewport={'width': 1366, 'height': 768}, locale='hi-IN')
        pg = await ctx.new_page(); errs = watch(pg)
        await pg.goto(BASE + 'index.html'); await pg.wait_for_timeout(800)
        st = await pg.evaluate('''() => { const vis = s => [...document.querySelectorAll(s)].filter(e => e.offsetParent !== null).length;
          return {preRera: document.body.classList.contains('pre-rera'), priceShown: vis('.pc .pr'), bookingShown: [...document.querySelectorAll('#contact h2')].filter(e=>e.offsetParent!==null).map(e=>e.textContent),
           preNote: vis('#preNote'), reraBox: vis('#reraBox'), footer: document.getElementById('reraNone').offsetParent !== null,
           text: document.body.innerText.includes('बुकिंग') ? document.body.innerText.match(/.{0,40}बुकिंग.{0,40}/g) : []}; }''')
        await pg.screenshot(path=str(OUT / 'screens' / 'rera_pre_1366.png'))
        res('R09 RERA न होने पर (डिफ़ॉल्ट): मूल्य/बुकिंग/बिक्री वाक्य छिपे, पूर्व-पंजीकरण सूचना दिखे', st['preRera'] and st['priceShown'] == 0 and st['bookingShown'] == ['परियोजना संबंधी जानकारी हेतु संपर्क'] and st['preNote'] == 1 and st['reraBox'] == 0 and st['footer'] and not errs, {**st, 'errs': errs})
        await ctx.close()
        for approved, numonly, key in [(False, False, 'R10'), (True, True, 'R11'), (True, False, 'R12')]:
            for vp in ([{'width': 1366, 'height': 768}, {'width': 390, 'height': 844}] if key == 'R12' else [{'width': 1366, 'height': 768}]):
                ctx = await b.new_context(viewport=vp, locale='hi-IN', is_mobile=vp['width'] < 800, has_touch=vp['width'] < 800)
                await patched(ctx, approved, numonly)
                pg = await ctx.new_page(); errs = watch(pg)
                await pg.goto(BASE + 'index.html'); await pg.wait_for_timeout(800)
                st = await pg.evaluate('''() => { const box = document.getElementById('reraBox'); const r = box.getBoundingClientRect(); const hero = document.querySelector('.hero').getBoundingClientRect();
                  const vis = s => [...document.querySelectorAll(s)].filter(e => e.offsetParent !== null).length;
                  const h1 = parseFloat(getComputedStyle(document.querySelector('.hero h1')).fontSize), bf = parseFloat(getComputedStyle(box).fontSize);
                  return {state: window.__reraState, preRera: document.body.classList.contains('pre-rera'), priceShown: vis('.pc .pr'), boxShown: !box.hidden,
                   boxTopRight: !box.hidden && r.right > innerWidth * 0.6 && r.top < hero.top + 40, boxInFirstScreen: !box.hidden && r.top >= 0 && r.bottom <= innerHeight,
                   fields: box.hidden ? null : box.innerText.replace(/\\s+/g,' '), qr: !document.getElementById('rbQr').hidden && Math.round(document.getElementById('rbQr').getBoundingClientRect().width) === 96 && getComputedStyle(document.getElementById('rbQr')).position === 'static', fieldsVisible: !box.hidden && document.getElementById('rbAcc').getBoundingClientRect().height > 0 && document.getElementById('rbAcc').getBoundingClientRect().bottom <= r.bottom, boxFont: bf, h1Font: h1, sw: document.documentElement.scrollWidth, W: innerWidth}; }''')
                tag = f"{key}_{vp['width']}"
                await pg.screenshot(path=str(OUT / 'screens' / f'rera_{tag}.png'))
                if key == 'R10':
                    ok = st['state']['regComplete'] and not st['state']['saleMode'] and st['preRera'] and st['priceShown'] == 0 and st['boxShown'] and st['boxTopRight']
                    res('R10 पंजीकरण विवरण पूरे, पर मालिक की स्वीकृति false → विवरण ऊपर-दाएँ दिखें, बिक्री हिस्से बंद रहें', ok and not errs, {**st, 'errs': errs})
                elif key == 'R11':
                    ok = not st['state']['regComplete'] and st['preRera'] and st['priceShown'] == 0 and not st['boxShown']
                    res('R11 केवल पंजीकरण संख्या + स्वीकृति true → अधूरे विवरण पर भी बिक्री हिस्से बंद', ok and not errs, {**st, 'errs': errs})
                else:
                    f = st['fields'] or ''
                    ok = (st['state']['saleMode'] and st['fieldsVisible'] and not st['preRera'] and st['priceShown'] == 0 and st['qr'] and all(x in f for x in ['TEST-ONLY-0000', 'example.invalid', 'TEST-01.01.2000', 'TEST-000000', 'TEST0000000', 'TEST BANK'])
                          and st['sw'] <= st['W'] + 1 and st['boxFont'] >= 16)
                    if vp['width'] > 800: ok = ok and st['boxTopRight'] and st['boxInFirstScreen']
                    res(f"R12 पूरा पंजीकरण + स्वीकृति → बिक्री हिस्से दिखें, RERA बॉक्स (QR, संख्या, वेबलिंक, लॉन्च तिथि, Collection Account) {'ऊपर-दाएँ' if vp['width'] > 800 else 'मोबाइल पर हीरो में'} @{vp['width']}", ok and not errs, {**st, 'errs': errs})
                await ctx.close()


        # ---------------- 3b. RERA की तीन अवस्थाएँ (V2.2) ----------------
        cases = [
            ('R25', 'UNREGISTERED (डिफ़ॉल्ट कॉन्फ़िग)', None),
            ('R26', 'सूचना पेज के नीचे (संपर्क के बाद, फ़ुटर से ठीक पहले), ऊपर नहीं; मूल्य हिस्सा नहीं', None),
            ('R27', 'REGISTERED_MARKETING_OFF (सभी विवरण, स्वीकृति false)', FULL),
            ('R28', 'REGISTERED_MARKETING_OFF (केवल संख्या, स्वीकृति true)', "window.INFO = { rera: { number: 'TEST-ONLY-0000' }, ownerApprovedMarketing: true, mapUrl: '' };"),
            ('R29', 'REGISTERED_MARKETING_ON (सभी विवरण + स्वीकृति)', TEST_RERA.replace('APPROVED', 'true')),
        ]
        for key, name, cfg in cases:
            for lang in ['hi-IN', 'en-US']:
                ctx = await b.new_context(viewport={'width': 1366, 'height': 768}, locale=lang)
                if cfg: await patched_cfg(ctx, cfg)
                pg = await ctx.new_page(); errs = watch(pg)
                await pg.goto(BASE + 'index.html'); await pg.wait_for_timeout(700)
                st = await pg.evaluate(STATE_JS)
                if lang == 'hi-IN': await pg.screenshot(path=str(OUT / 'screens' / f'state_{key}.png'))
                await ctx.close()
                common = st['state'] == st['attr'] and not errs
                if key == 'R25':
                    ok = (st['state'] == 'UNREGISTERED' and st['preNote'] and not st['regNote'] and st['footerNone'] and not st['footerNo'] and st['saysNotObtained']
                          and not st['saysRegistered'] and st['saysNoBooking'] and not st['box'] and st['price'] == 0 and st['saleHero'] == 0)
                elif key == 'R26':
                    ok = st['state'] == 'UNREGISTERED' and st['noteAtBottom'] and st['priceEls'] == 0 and not st['saysPrice']
                elif key in ('R27', 'R28'):
                    ok = (st['state'] == 'REGISTERED_MARKETING_OFF' and not st['preNote'] and st['regNote'] and 'TEST-ONLY-0000' in st['regNoteText']
                          and not st['saysNotObtained'] and not st['saysNoBooking'] and not st['footerNone'] and st['footerNo'] == 'TEST-ONLY-0000'
                          and st['saysRegistered'] and st['saysNotPublished'] and st['price'] == 0 and st['saleHero'] == 0 and st['box'] == (key == 'R27') and st['noteAtBottom'])
                else:
                    ok = (st['state'] == 'REGISTERED_MARKETING_ON' and not st['preNote'] and not st['regNote'] and not st['saysNotObtained'] and not st['saysNoBooking']
                          and not st['saysNotPublished'] and st['footerNo'] == 'TEST-ONLY-0000' and st['box'] and st['priceEls'] == 0 and not st['saysPrice'] and st['saleHero'] > 0)
                res(f'{key} {name} [{lang[:2]}]: संदेश आपस में मेल खाते', ok and common, {**st, 'errs': errs})

        # ---------------- 4. 3D desktop ----------------
        async def open3d(vp, mob, dpr=1, init=None, browser=None):
            ctx = await (browser or b).new_context(viewport=vp, locale='hi-IN', is_mobile=mob, has_touch=mob, device_scale_factor=dpr)
            if init: await ctx.add_init_script(init)
            pg = await ctx.new_page(); errs = watch(pg)
            pg.set_default_timeout(150000)  # SwiftShader at DPR 2 can take ~30 s per click on a slow CPU
            await pg.goto(BASE + '3d.html')
            return ctx, pg, errs
        cam = "[+window.__cam.position.x.toFixed(2), +window.__cam.position.y.toFixed(2), +window.__cam.position.z.toFixed(2)]"
        ctx, pg, e3 = await open3d({'width': 1366, 'height': 768}, False, dpr=2)
        await pg.evaluate("localStorage.setItem('sk-gfx','high')"); await pg.reload()
        await pg.wait_for_function('window.__ready===true', timeout=120000); await pg.wait_for_timeout(1200)
        init = await pg.evaluate("({w: document.querySelector('#c').width, fbHidden: document.getElementById('fb').hidden, dead: !!window.__glDead})")
        res('R13 3D शुरू होता है, fallback छिपा', init['w'] > 0 and init['fbHidden'] and not init['dead'], init)

        async def press(act, ms=500):
            await pg.evaluate(f"document.querySelector('[data-act=\"{act}\"]').dispatchEvent(new PointerEvent('pointerdown',{{bubbles:true,pointerId:1}}))")
            await pg.wait_for_timeout(ms)
            await pg.evaluate(f"document.querySelector('[data-act=\"{act}\"]').dispatchEvent(new PointerEvent('pointerup',{{bubbles:true,pointerId:1}}))")
            await pg.wait_for_timeout(250)
        out = {}
        for act in ['zoom-in', 'zoom-out', 'rot-l', 'rot-r', 'tilt-up', 'tilt-down', 'pan-f', 'pan-b', 'pan-l', 'pan-r']:
            a = await pg.evaluate(cam); await press(act); out[act] = dist(a, await pg.evaluate(cam))
        a = await pg.evaluate(cam); await pg.wait_for_timeout(600); out['after_release'] = dist(a, await pg.evaluate(cam))
        await pg.evaluate("document.querySelector('[data-act=\"rot-l\"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:2}))"); await pg.wait_for_timeout(200)
        await pg.evaluate("document.querySelector('[data-act=\"rot-l\"]').dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:2}))")
        a = await pg.evaluate(cam); await pg.wait_for_timeout(500); out['after_cancel'] = dist(a, await pg.evaluate(cam))
        await pg.evaluate("document.querySelector('[data-act=\"rot-r\"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:3}))"); await pg.wait_for_timeout(200)
        await pg.evaluate("window.dispatchEvent(new Event('blur'))")
        a = await pg.evaluate(cam); await pg.wait_for_timeout(500); out['after_blur'] = dist(a, await pg.evaluate(cam))
        ok = all(out[k] > 0.3 for k in ['zoom-in', 'zoom-out', 'rot-l', 'rot-r', 'tilt-up', 'tilt-down', 'pan-f', 'pan-b', 'pan-l', 'pan-r']) and max(out['after_release'], out['after_cancel'], out['after_blur']) < 0.05
        res('R14 सभी नियंत्रण + long-press: दबाए रखने पर चलता, छोड़ने/cancel/blur पर रुकता', ok, out)
        vv = {}
        for v in ['top', 'street', 'gate', 'park', 'aerial']:
            await pg.click(f'[data-view="{v}"]'); await pg.wait_for_timeout(2200); vv[v] = await pg.evaluate(cam)
        await pg.click('#night'); await pg.wait_for_timeout(1300); night = await pg.evaluate("document.querySelector('#night').getAttribute('aria-pressed')")
        await pg.click('#day'); await pg.wait_for_timeout(1300); day = await pg.evaluate("document.querySelector('#day').getAttribute('aria-pressed')")
        res('R15 पाँचों दृश्य अलग-अलग, दिन/रात स्विच', len(set(map(tuple, vv.values()))) == 5 and night == 'true' and day == 'true', {'views': vv, 'night': night, 'day': day})
        hiW = await pg.evaluate("document.querySelector('#c').width")
        await pg.click('#gfx'); await pg.wait_for_timeout(400)
        lo = await pg.evaluate("[document.querySelector('#c').width, document.querySelector('#gfx').getAttribute('aria-pressed'), localStorage.getItem('sk-gfx')]")
        await pg.click('#gfx'); await pg.wait_for_timeout(400)
        hi2 = await pg.evaluate("[document.querySelector('#c').width, document.querySelector('#gfx').getAttribute('aria-pressed'), localStorage.getItem('sk-gfx')]")
        res('R16 हल्का ग्राफ़िक्स: canvas रेज़ोल्यूशन घटता/लौटता (DPR 2 पर)', lo[0] < hiW and lo[1] == 'true' and lo[2] == 'low' and hi2[0] == hiW and hi2[2] == 'high', {'high_w': hiW, 'low': lo, 'back': hi2})
        await pg.click('#drainBtn'); await pg.wait_for_timeout(1800)
        d1 = await pg.evaluate("({on: document.querySelector('#drainBtn').getAttribute('aria-pressed'), panel: !document.getElementById('drainPanel').hidden})")
        await pg.click('[data-sys="sewer"]'); sw = await pg.evaluate("document.querySelector('[data-sys=sewer]').getAttribute('aria-pressed')"); await pg.click('[data-sys="sewer"]')
        sw2 = await pg.evaluate("document.querySelector('[data-sys=sewer]').getAttribute('aria-pressed')")
        await pg.click('#drainMin'); mn = await pg.evaluate("document.getElementById('drainPanel').classList.contains('min')")
        await pg.click('#drainMin'); rs = await pg.evaluate("!document.getElementById('drainPanel').classList.contains('min')")
        res('R17 ड्रेनेज: चालू, सिस्टम on/off, छोटा/बड़ा', d1['on'] == 'true' and d1['panel'] and sw == 'false' and sw2 == 'true' and mn and rs, {**d1, 'sewerOff': sw, 'sewerOn': sw2, 'min': mn, 'restore': rs})
        await press('home', 100); await pg.wait_for_timeout(2300)
        h = await pg.evaluate("({drain: document.querySelector('#drainBtn').getAttribute('aria-pressed'), panel: document.getElementById('drainPanel').hidden, view: document.querySelector('[data-view=aerial]').getAttribute('aria-pressed')})")
        hc = await pg.evaluate(cam)
        res('R18 Home: ड्रेनेज से बाहर निकलकर Aerial दृश्य', h['drain'] == 'false' and h['panel'] and h['view'] == 'true' and abs(hc[0] - vv['aerial'][0]) < 1.5, {**h, 'cam': hc, 'aerial': vv['aerial']})
        res('R19 3D (डेस्कटॉप) पर JS त्रुटि नहीं', not e3, e3)
        await ctx.close()

        # ---------------- 4b. design switch: traditional ⇄ modern ----------------
        ctx, pg, e = await open3d({'width': 1366, 'height': 768}, False)
        await pg.wait_for_function('window.__ready===true', timeout=120000); await pg.wait_for_timeout(600)
        st0 = await pg.evaluate("document.getElementById('styleSw').getAttribute('aria-checked')")
        await pg.click('#styleSw')
        await pg.wait_for_function("document.getElementById('styleSw').getAttribute('aria-busy')===null && document.getElementById('styleSw').getAttribute('aria-checked')==='true'", timeout=120000)
        await pg.wait_for_timeout(500)
        on = await pg.evaluate("({ls: localStorage.getItem('sk-style')})")
        await pg.click('#drainBtn'); await pg.wait_for_timeout(1200); await pg.click('#drainBtn'); await pg.wait_for_timeout(300)
        await pg.click('#night'); await pg.wait_for_timeout(1200); await pg.click('#day'); await pg.wait_for_timeout(300)
        await pg.click('#styleSw'); await pg.wait_for_timeout(500)
        off = await pg.evaluate("({sw: document.getElementById('styleSw').getAttribute('aria-checked'), ls: localStorage.getItem('sk-style')})")
        await pg.click('#styleSw'); await pg.wait_for_timeout(500)
        again = await pg.evaluate("document.getElementById('styleSw').getAttribute('aria-checked')")
        await pg.goto(BASE + '3d.html?design=traditional'); await pg.wait_for_function('window.__ready===true', timeout=120000); await pg.wait_for_timeout(400)
        q = await pg.evaluate("document.getElementById('styleSw').getAttribute('aria-checked')")
        await ctx.close()
        res('R31 डिज़ाइन स्विच: पारंपरिक ⇄ आधुनिक (ड्रेनेज/रात के साथ भी), पसंद याद रहती, कोई JS त्रुटि नहीं',
            st0 == 'false' and on['ls'] == 'modern' and off['sw'] == 'false' and off['ls'] == 'ayodhya' and again == 'true' and q == 'false' and not e,
            {'start': st0, 'modern': on, 'back': off, 'again': again, 'urlTraditional': q, 'errs': e})

        # ---------------- 5. 3D mobile (emulated) ----------------
        for vp in [{'width': 390, 'height': 844}, {'width': 844, 'height': 390}, {'width': 320, 'height': 640}]:
            ctx, pg, e = await open3d(vp, True)
            await pg.wait_for_function('window.__ready===true', timeout=120000); await pg.wait_for_timeout(1200)
            js = '''() => { const n0 = document.querySelector('.nav').getBoundingClientRect(), tg = document.getElementById('navTog').getBoundingClientRect(); const nav = {left: Math.min(n0.left, tg.left), right: Math.max(n0.right, tg.right), top: Math.min(n0.top, tg.top), bottom: Math.max(n0.bottom, tg.bottom)}; nav.width = nav.right - nav.left; nav.height = nav.bottom - nav.top; const hud = document.querySelector('.hud').getBoundingClientRect(); const W = innerWidth, H = innerHeight;
              const btns = [...document.querySelectorAll('.nav .nb')].filter(b => b.offsetParent !== null).map(b => b.getBoundingClientRect()).map(r => Math.round(Math.min(r.width, r.height)));
              const bar = [...document.querySelectorAll('.bar button')].map(b => b.getBoundingClientRect().height);
              return {navInView: nav.left >= 0 && nav.right <= W && nav.bottom <= H, navOverHud: !(nav.bottom <= hud.top || nav.top >= hud.bottom || nav.right <= hud.left || nav.left >= hud.right),
                minNavBtn: Math.min(...btns), minBarBtn: Math.round(Math.min(...bar)), coverPct: +(100 * nav.width * nav.height / (W * H)).toFixed(1), navWH: [Math.round(nav.width), Math.round(nav.height)], sw: document.documentElement.scrollWidth, W}; }'''
            full = await pg.evaluate(js)
            await pg.screenshot(path=str(OUT / 'screens' / f"3d_mob_{vp['width']}x{vp['height']}.png"))
            await pg.click('#navTog'); await pg.wait_for_timeout(200)
            mini = await pg.evaluate(js); mini['state'] = await pg.evaluate("[document.getElementById('nav').classList.contains('mini'), document.getElementById('navTog').getAttribute('aria-expanded'), localStorage.getItem('sk-nav')]")
            a = await pg.evaluate(cam); await pg.evaluate("document.querySelector('[data-act=\"zoom-in\"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1}))")
            await pg.click('[data-act="home"]'); await pg.wait_for_timeout(300)
            await pg.screenshot(path=str(OUT / 'screens' / f"3d_mob_{vp['width']}x{vp['height']}_mini.png"))
            await pg.click('#navTog'); await pg.wait_for_timeout(200)
            back = await pg.evaluate("document.getElementById('nav').classList.contains('mini')")
            await pg.click('#drainBtn'); await pg.wait_for_timeout(1500)
            await pg.click('#drainMin'); await pg.wait_for_timeout(200)
            dm = await pg.evaluate("(()=>{const p=document.getElementById('drainPanel').getBoundingClientRect(), n=document.querySelector('.nav').getBoundingClientRect();return {overlapNav: !(p.right<=n.left||p.left>=n.right||p.bottom<=n.top||p.top>=n.bottom), navShown:getComputedStyle(document.querySelector('.nav')).display!=='none'}})()")
            ok = (full['navInView'] and not full['navOverHud'] and full["minNavBtn"] >= 44 and full["minBarBtn"] >= 44 and full['sw'] <= full['W'] and mini['state'][0] and mini['state'][1] == 'false'
                  and mini['coverPct'] < full['coverPct'] and mini['minNavBtn'] >= 44 and not back and not dm['overlapNav'] and dm['navShown'] and not e)
            res(f"R20 3D मोबाइल (emulated) {vp['width']}x{vp['height']}: बटन ≥44px, overflow नहीं, toolbar न ढके, छोटा करने का विकल्प", ok,
                {'full': full, 'mini': mini, 'restored': not back, 'drainMin': dm, 'errs': e})
            await ctx.close()

        # ---------------- 6. WebGL failures ----------------
        # 6a: renderer creation fails (detection passes, main canvas returns no WebGL context)
        fail_init = """(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, o) {
            if (this.id === 'c' && /webgl/.test(t)) return null; return g.call(this, t, o); }; })();"""
        ctx, pg, e = await open3d({'width': 390, 'height': 844}, True, init=fail_init)
        await pg.wait_for_timeout(2500)
        f = await pg.evaluate("({shown: !document.getElementById('fb').hidden, reason: window.__fbReason, dead: !!window.__glDead, msg: document.getElementById('fbInit').hidden ? null : document.getElementById('fbInit').textContent, reload: !document.getElementById('fbReload').hidden, hud: getComputedStyle(document.querySelector('.hud')).display})")
        await pg.keyboard.press('ArrowLeft'); await pg.keyboard.press('+'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=str(OUT / 'screens' / '3d_fallback_init.png'))
        pe = [x for x in e if x.startswith('pageerror')]
        res('R21 WebGL renderer बनना विफल → fallback (वीडियो + दोबारा खोलें), कोई unhandled error नहीं', f['shown'] and f['reason'] == 'init' and f['dead'] and f['reload'] and f['hud'] == 'none' and not pe, {**f, 'pageerrors': pe, 'console': e})
        await ctx.close()
        # 6b: context lost after start
        ctx, pg, e = await open3d({'width': 1366, 'height': 768}, False)
        await pg.wait_for_function('window.__ready===true', timeout=120000); await pg.wait_for_timeout(800)
        has = await pg.evaluate("(() => { const gl = document.getElementById('c').getContext('webgl2') || document.getElementById('c').getContext('webgl'); const x = gl && gl.getExtension('WEBGL_lose_context'); if (!x) return false; x.loseContext(); return true; })()")
        await pg.wait_for_timeout(1200)
        f = await pg.evaluate("({shown: !document.getElementById('fb').hidden, reason: window.__fbReason, dead: !!window.__glDead, lostMsg: !document.getElementById('fbLost').hidden})")
        await pg.keyboard.press('ArrowLeft'); await pg.evaluate("window.__nav('zoom-in', 2)"); await pg.wait_for_timeout(400)
        await pg.screenshot(path=str(OUT / 'screens' / '3d_fallback_lost.png'))
        pe = [x for x in e if x.startswith('pageerror')]
        res('R22 WebGL context lost → render loop रुकता, fallback दिखता, कोई unhandled error नहीं', has and f['shown'] and f['reason'] == 'lost' and f['dead'] and f['lostMsg'] and not pe, {'extension': has, **f, 'pageerrors': pe, 'console': e[:5]})
        await ctx.close()
        await b.close()
        # 6c: WebGL disabled entirely
        b2 = await p.chromium.launch(executable_path=A.chrome, args=['--disable-webgl', '--disable-3d-apis'])
        ctx, pg, e = await open3d({'width': 390, 'height': 844}, True, browser=b2)
        await pg.wait_for_timeout(2000)
        f = await pg.evaluate("({noGL: window.__noWebGL, shown: !document.getElementById('fb').hidden, reason: window.__fbReason, video: !!document.querySelector('#fb video'), ready: !!window.__ready})")
        await pg.screenshot(path=str(OUT / 'screens' / '3d_fallback_nogl.png'))
        res('R23 WebGL बंद → bundle चलता ही नहीं, fallback वीडियो, कोई error नहीं', f['noGL'] and f['shown'] and f['reason'] == 'nogl' and f['video'] and not f['ready'] and not e, {**f, 'errs': e})
        await b2.close()

    # ---------------- 7. file sizes (local; gzip-9 approximation) ----------------
    sizes = {}
    for n in ['index.html', '3d.html', 'hero-gate.jpg', 'plan.png', 'walkthrough.mp4']:
        raw = (ROOT / n).read_bytes(); sizes[n] = {'raw_kb': round(len(raw) / 1024, 1), 'gzip_kb_approx': round(len(gzip.compress(raw, 9)) / 1024, 1)}
    res('R24 फ़ाइल आकार (स्थानीय माप; असली नेटवर्क ट्रांसफ़र नहीं)', True, sizes, kind='LOCAL')
    out = {'environment': env, 'results': R, 'summary': {'pass': sum(v['status'] == 'PASS' for v in R.values()), 'fail': sum(v['status'] == 'FAIL' for v in R.values())}}
    (OUT / 'results.json').write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
    print('SUMMARY', out['summary'], 'env', env)
    return out['summary']['fail']

sys.exit(asyncio.run(main()))
