# स्वचालित टेस्ट — कैसे चलाएँ

## आवश्यकताएँ
- Python 3.10+ (जाँच 3.13.18 पर हुई)
- `pip install playwright==1.63.0`
- Chrome/Chromium (जाँच Google Chrome for Testing 153.0.8010.12 पर हुई)। `python3 -m playwright install chromium` भी चलेगा — तब `--chrome` में उसका पथ दें।

## कमांड (repo की जड़ से)
```bash
python3 tests/run_tests.py --chrome /usr/bin/google-chrome
# 3D स्रोत से 3d.html का पुनरुत्पादन जाँचना:
cd source/3d && npm ci && cd ../.. && python3 source/build_3d_page.py --check
```
- परिणाम: `tests/results/results.json` (हर टेस्ट: PASS/FAIL, प्रकार, सबूत) व `tests/results/screens/*.png`
- कोई टेस्ट FAIL होने पर exit code = FAIL की संख्या।

## टेस्ट किस चीज़ पर चलते हैं — साफ़ भेद
| प्रकार | अर्थ |
|---|---|
| `SIM` | कंप्यूटर पर headless Chrome। "मोबाइल" = Chrome mobile **emulation** (viewport, touch, mobile user-agent) — **असली फ़ोन नहीं** |
| `LOCAL` | स्थानीय फ़ाइल का माप (gzip-9 अनुमान) — असली नेटवर्क ट्रांसफ़र नहीं |
| `results/network_live_main.json` | **असली नेटवर्क** माप, लेकिन लाइव `main` (PR से पहले वाला) संस्करण का — PR ब्रांच deploy नहीं है |
| असली iPhone / Android | **NOT TESTED** |
| असली डिवाइस पर FPS | **NOT TESTED** (SwiftShader सॉफ़्टवेयर WebGL की FPS असली GPU का संकेत नहीं देती) |

## RERA टेस्ट के बारे में
R10–R12 में `index.html` की **प्रति** में (route interception से, फ़ाइल बदले बिना) `TEST-ONLY-0000`, `example.invalid` जैसे स्पष्ट नकली मान डाले जाते हैं, ताकि "पंजीकरण मिलने के बाद" वाला व्यवहार जाँचा जा सके। ये मान repo की किसी फ़ाइल में नहीं हैं; स्क्रीनशॉट में दिखने वाले `TEST-…` मान असली नहीं हैं।

## RERA की तीन अवस्थाएँ (R25–R29, हिंदी व English दोनों)
- R25 `UNREGISTERED` · R26 `UNREGISTERED` + मालिक-पुष्टि · R27 `REGISTERED_MARKETING_OFF` (पूरे विवरण, स्वीकृति false) · R28 `REGISTERED_MARKETING_OFF` (केवल संख्या) · R29 `REGISTERED_MARKETING_ON`
- हर अवस्था में पूरे पेज के दिखने वाले पाठ में विरोधी वाक्य (जैसे पंजीकृत होने पर "अभी प्राप्त नहीं") न होने की जाँच।

## WebGL विफलता टेस्ट
- R21: मुख्य canvas पर WebGL context न मिलने का अनुकरण (init script से `getContext` → `null`) — renderer बनना विफल।
- R22: चालू 3D में `WEBGL_lose_context.loseContext()` — context lost।
- R23: `--disable-webgl --disable-3d-apis` के साथ Chrome — WebGL पूरी तरह बंद।
