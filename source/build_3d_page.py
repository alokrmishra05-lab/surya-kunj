#!/usr/bin/env python3
"""3d.html को स्रोत से दोबारा बनाना (पुनरुत्पादन-योग्य)।
उपयोग (repo की जड़ से):  cd source/3d && npm ci && cd ../.. && python3 source/build_3d_page.py [--check]
--check: बनी फ़ाइल को repo की 3d.html से मिलाता है (बदलता नहीं)।"""
import json, pathlib, subprocess, sys
S = pathlib.Path(__file__).resolve().parent; ROOT = S.parent
subprocess.run([sys.executable, str(S / '3d' / 'build.py')], check=True)
EN = json.loads((S / 'i18n' / 'en.json').read_text(encoding='utf-8'))
rt = (S / 'i18n' / 'runtime.js').read_text(encoding='utf-8').replace('__EN__', json.dumps(EN, ensure_ascii=False))
t = (S / '3d' / 'dist' / 'index.html').read_text(encoding='utf-8')
a = '<p>बसने के बाद कैसा दिखेगा — 3D कॉन्सेप्ट · ग्राम सरेठी, अयोध्या</p>'
t = t.replace(a, a + '<p><a href="index.html" style="color:#F2C55C;font-weight:600">← वेबसाइट पर लौटें</a></p>', 1)
b = '<button id="info" aria-expanded="false" aria-controls="panel">विवरण</button>'
assert b in t
t = t.replace(b, b + '\n      <button id="langBtn" type="button" lang="en">English</button>')
t = t.replace('</body>', '<script>' + rt + '</script>\n</body>')
if '--check' in sys.argv:
    same = (ROOT / '3d.html').read_text(encoding='utf-8') == t
    print('3d.html पुनरुत्पादन:', 'मेल खाता है (IDENTICAL)' if same else 'अंतर है (DIFFERENT)'); sys.exit(0 if same else 1)
(ROOT / '3d.html').write_text(t, encoding='utf-8'); print('3d.html लिखी गई', len(t.encode()), 'bytes')
