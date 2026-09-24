// Architronica funnel — script.js
// UTM capture + pass-through, form embed loader, sticky CTA, FAQ accordion.
(function () {
  'use strict';

  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'ttclid', 'msclkid'];
  var STORE = 'arc_utm';

  // ---------- UTM capture (sessionStorage) ----------
  function readStored() {
    try { return JSON.parse(sessionStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }

  function capture() {
    var params = new URLSearchParams(window.location.search);
    var stored = readStored();
    var changed = false;
    KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) { stored[k] = v; changed = true; }
    });
    if (changed) {
      try { sessionStorage.setItem(STORE, JSON.stringify(stored)); } catch (e) { /* storage blocked */ }
    }
    return stored;
  }

  function withParams(url, data) {
    var u;
    try { u = new URL(url, window.location.href); } catch (e) { return url; }
    Object.keys(data).forEach(function (k) {
      if (data[k] && !u.searchParams.has(k)) u.searchParams.set(k, data[k]);
    });
    return u.toString();
  }

  var utm = capture();

  // ---------- Append UTMs to internal links (landing -> thank-you, legal pages) ----------
  document.querySelectorAll('a[href$=".html"], a[href*=".html?"]').forEach(function (a) {
    a.href = withParams(a.getAttribute('href'), utm);
  });

  // ---------- Form embed: load iframe with UTMs appended ----------
  // GHL reads URL params into hidden fields whose Query Key matches the param name.
  // If a field is not mapped in GHL, the value is ignored (nothing breaks).
  document.querySelectorAll('iframe[data-src]').forEach(function (frame) {
    frame.src = withParams(frame.getAttribute('data-src'), utm);
  });

  // Redirect helper: if the form tool posts a "submitted" message instead of
  // redirecting itself, send the visitor to thank-you.html with UTMs kept.
  // Primary method is still the GHL form setting "On Submit -> Open URL".
  window.addEventListener('message', function (e) {
    if (!/leadconnectorhq\.com|msgsndr\.com/.test(e.origin || '')) return;
    var d = e.data;
    var str = typeof d === 'string' ? d : (d && (d.type || d.event || d.action)) || '';
    if (/form[-_ ]?submit|submitted/i.test(String(str))) {
      // CONVERSION: a lower-intent Lead event may fire here once the pixel is installed, e.g.
      // if (window.fbq) fbq('track', 'Lead');
      setTimeout(function () {
        if (!/thank-you\.html/.test(window.location.pathname)) {
          window.location.href = withParams('thank-you.html', utm);
        }
      }, 800);
    }
  });

  // ---------- Smooth scroll to form ----------
  var form = document.getElementById('quote');
  document.querySelectorAll('.js-to-form').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (!form) return;
      e.preventDefault();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---------- Sticky CTA: show after hero, hide while form is on screen ----------
  var sticky = document.querySelector('[data-sticky]');
  var hero = document.querySelector('.hero');
  if (sticky && hero && 'IntersectionObserver' in window) {
    var pastHero = false;
    var formVisible = false;
    var update = function () {
      var show = pastHero && !formVisible;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      sticky.querySelectorAll('a').forEach(function (a) { a.tabIndex = show ? 0 : -1; });
      document.documentElement.style.setProperty('--sticky-h', show ? '72px' : '0px');
    };
    new IntersectionObserver(function (entries) {
      pastHero = !entries[0].isIntersecting;
      update();
    }, { threshold: 0 }).observe(hero);
    if (form) {
      new IntersectionObserver(function (entries) {
        formVisible = entries[0].isIntersecting;
        update();
      }, { threshold: 0.15 }).observe(form);
    }
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll('[data-faq] .faq__q button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (panel) panel.hidden = open;
    });
  });

  // ---------- Footer year ----------
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
