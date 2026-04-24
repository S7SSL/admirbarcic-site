// analytics.js — GDPR-friendly consent banner + GA4 loader.
//
// Behaviour:
//   • First visit: shows a small bottom banner asking for consent. GA4 does
//     NOT load until the user clicks Accept.
//   • After Accept: consent is stored in localStorage, GA4 loads on this
//     and every subsequent visit.
//   • After Decline: consent is stored as declined, banner does not reappear,
//     GA4 is not loaded.
//
// Swap MEASUREMENT_ID below for the real GA4 ID once the property is created
// (Admin → Data Streams → Web → Measurement ID, format: G-XXXXXXXXXX).
(function () {
  'use strict';
  var MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: replace with live GA4 Measurement ID
  var CONSENT_KEY = 'ab_analytics_consent';

  function loadGA4() {
    if (!/^G-[A-Z0-9]+$/.test(MEASUREMENT_ID)) return; // placeholder — no-op
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
  }

  function showBanner() {
    if (document.getElementById('ab-cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'ab-cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie consent');
    b.innerHTML =
      '<div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:space-between;">' +
        '<p style="flex:1;min-width:240px;margin:0;font-size:13px;line-height:1.5;color:#e8eaed;">' +
          'We use a single analytics cookie (Google Analytics) to understand how visitors use this site. ' +
          'See our <a href="/privacy.html" style="color:#c9a84c;text-decoration:underline;">Privacy Policy</a>.' +
        '</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
          '<button type="button" id="ab-consent-decline" style="background:transparent;color:#e8eaed;border:1px solid #1e2229;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">Decline</button>' +
          '<button type="button" id="ab-consent-accept" style="background:#c9a84c;color:#0b0c0e;border:0;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:700;">Accept</button>' +
        '</div>' +
      '</div>';
    b.style.cssText =
      'position:fixed;bottom:0;left:0;right:0;z-index:2147483000;' +
      'background:#111318;border-top:1px solid #1e2229;padding:14px 20px;' +
      'font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;' +
      'box-shadow:0 -4px 20px rgba(0,0,0,.4);';
    document.body.appendChild(b);

    document.getElementById('ab-consent-accept').addEventListener('click', function () {
      try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
      b.remove();
      loadGA4();
    });
    document.getElementById('ab-consent-decline').addEventListener('click', function () {
      try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch (e) {}
      b.remove();
    });
  }

  var choice;
  try { choice = localStorage.getItem(CONSENT_KEY); } catch (e) { choice = null; }

  if (choice === 'accepted') {
    loadGA4();
  } else if (choice !== 'declined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
