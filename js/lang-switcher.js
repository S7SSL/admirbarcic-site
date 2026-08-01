// lang-switcher.js — cosmetic language switcher.
//
// Injects a small dropdown into the site nav. On selection, navigates to
// Google Translate's hosted translation of the current page (the
// *.translate.goog subdomain Google generates on the fly).
//
// This is a presentation aid — it does NOT create indexable foreign-language
// pages and does NOT improve SEO in those markets. For real Russian/German/
// Slovenian/Serbian/Bosnian search rankings, dedicated translated pages with
// hreflang annotations are required.
(function () {
  'use strict';

  var LANGS = [
    { code: 'ru', label: 'Русский' },
    { code: 'de', label: 'Deutsch' },
    { code: 'sr', label: 'Српски' },
    { code: 'sl', label: 'Slovenščina' },
    { code: 'bs', label: 'Bosanski' }
  ];

  function translatedUrl(targetLang) {
    var host = location.hostname.replace(/^www\./, '').replace(/\./g, '-') + '.translate.goog';
    var path = location.pathname + location.search;
    var sep = path.indexOf('?') === -1 ? '?' : '&';
    return 'https://' + host + path + sep +
      '_x_tr_sl=en&_x_tr_tl=' + targetLang + '&_x_tr_hl=en';
  }

  function inject() {
    if (document.getElementById('ab-lang-switcher')) return;
    if (location.hostname.indexOf('translate.goog') !== -1) return; // don't inject on translated pages

    var nav = document.querySelector('nav');
    if (!nav) return;
    var navRight = nav.querySelector('.nav-links') || nav.querySelector('div:last-child');
    if (!navRight) return;

    var wrap = document.createElement('div');
    wrap.id = 'ab-lang-switcher';
    wrap.style.cssText = 'position:relative;display:inline-block;font-family:Inter,sans-serif;';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Translate this page');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span style="margin-right:6px">&#127760;</span>EN <span style="margin-left:4px;font-size:9px">&#9660;</span>';
    btn.style.cssText = 'background:transparent;border:1px solid rgba(201,168,76,.4);color:#c9a84c;padding:7px 14px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.5px;line-height:1;display:inline-flex;align-items:center;font-family:inherit;';

    var menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    menu.style.cssText = 'position:absolute;top:calc(100% + 6px);right:0;background:#111318;border:1px solid #1e2229;border-radius:4px;min-width:170px;display:none;z-index:1000;box-shadow:0 6px 24px rgba(0,0,0,.5);overflow:hidden;';

    LANGS.forEach(function (lang) {
      var a = document.createElement('a');
      a.href = translatedUrl(lang.code);
      a.textContent = lang.label;
      a.setAttribute('role', 'menuitem');
      a.setAttribute('hreflang', lang.code);
      a.style.cssText = 'display:block;padding:11px 18px;color:#e8eaed;text-decoration:none;font-size:13px;border-bottom:1px solid rgba(30,34,41,.6);transition:background .15s;';
      a.onmouseover = function () { a.style.background = 'rgba(201,168,76,.08)'; a.style.color = '#c9a84c'; };
      a.onmouseout = function () { a.style.background = ''; a.style.color = '#e8eaed'; };
      menu.appendChild(a);
    });
    if (menu.lastChild) menu.lastChild.style.borderBottom = '0';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.style.display === 'block';
      menu.style.display = open ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('click', function () {
      menu.style.display = 'none';
      btn.setAttribute('aria-expanded', 'false');
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    navRight.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
