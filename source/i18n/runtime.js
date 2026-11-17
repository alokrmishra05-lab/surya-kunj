(function () {
  var EN = __EN__;
  var KEY = 'sk-lang';
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function browserLang() {
    var ls = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < ls.length; i++) {
      var l = String(ls[i] || '').toLowerCase();
      if (l.indexOf('hi') === 0) return 'hi';
      if (l.indexOf('en') === 0) return 'en';
    }
    return 'en';
  }
  var norm = function (t) { return t.replace(/\s+/g, ' ').trim(); };
  var texts = [], attrs = [];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      var p = n.parentNode && n.parentNode.nodeName;
      if (p === 'SCRIPT' || p === 'STYLE') return NodeFilter.FILTER_REJECT;
      return EN[norm(n.nodeValue)] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  var n;
  while ((n = walker.nextNode())) {
    var v = n.nodeValue, k = norm(v);
    var lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0];
    texts.push({ n: n, hi: v, en: lead + EN[k] + trail });
  }
  ['alt', 'aria-label', 'title'].forEach(function (a) {
    document.querySelectorAll('[' + a + ']').forEach(function (el) {
      var k = norm(el.getAttribute(a));
      if (EN[k]) attrs.push({ el: el, a: a, hi: el.getAttribute(a), en: EN[k] });
    });
  });
  var imgs = [].slice.call(document.querySelectorAll('img[data-en-src]')).map(function (el) { return { el: el, hi: el.getAttribute('src'), en: el.getAttribute('data-en-src') }; });
  var links = [].slice.call(document.querySelectorAll('a[data-en-href]')).map(function (el) { return { el: el, hi: el.getAttribute('href'), en: el.getAttribute('data-en-href') }; });
  var titleHi = document.title;
  var btn = document.getElementById('langBtn');
  function apply(lang) {
    var en = lang === 'en';
    texts.forEach(function (t) { t.n.nodeValue = en ? t.en : t.hi; });
    attrs.forEach(function (t) { t.el.setAttribute(t.a, en ? t.en : t.hi); });
    links.forEach(function (t) { t.el.setAttribute('href', en ? t.en : t.hi); });
    imgs.forEach(function (t) { t.el.setAttribute('src', en ? t.en : t.hi); });
    document.title = en ? (EN[norm(titleHi)] || titleHi) : titleHi;
    document.documentElement.lang = en ? 'en' : 'hi';
    if (btn) {
      btn.textContent = en ? 'हिंदी' : 'English';
      btn.setAttribute('lang', en ? 'hi' : 'en');
      btn.setAttribute('aria-label', en ? 'हिंदी में देखें' : 'View in English');
    }
  }
  var lang = read(KEY) || browserLang();
  apply(lang);
  if (btn) btn.addEventListener('click', function () {
    lang = lang === 'en' ? 'hi' : 'en';
    store(KEY, lang);
    apply(lang);
  });

  // ---- theme (light / dark / auto)
  var grp = document.getElementById('themeGrp');
  if (grp) {
    var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
    var mode = read('sk-theme') || 'auto';
    var setTheme = function () {
      var dark = mode === 'dark' || (mode === 'auto' && mq && mq.matches);
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      grp.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === mode)); });
    };
    grp.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      mode = b.dataset.mode; store('sk-theme', mode); setTheme();
    });
    if (mq) { var f = function () { if (mode === 'auto') setTheme(); }; mq.addEventListener ? mq.addEventListener('change', f) : mq.addListener(f); }
    setTheme();
  }
})();
