// Architronica v2 — attribution pass-through, form loader, floating mobile CTA.
(function () {
  'use strict';

  var FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'ttclid', 'msclkid'];
  var KEY = 'arc_attr';

  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }
  var query = new URLSearchParams(location.search);
  FIELDS.forEach(function (f) { if (query.get(f)) saved[f] = query.get(f); });
  try { sessionStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* storage unavailable */ }

  function tag(href) {
    var u;
    try { u = new URL(href, location.href); } catch (e) { return href; }
    Object.keys(saved).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, saved[k]); });
    return u.toString();
  }

  // Internal page links keep attribution (thank-you, legal pages).
  document.querySelectorAll('a[href$=".html"]').forEach(function (a) { a.href = tag(a.getAttribute('href')); });

  // Load the GHL form with attribution in its URL; GHL maps matching query keys to hidden fields.
  document.querySelectorAll('iframe[data-src]').forEach(function (f) { f.src = tag(f.getAttribute('data-src')); });

  // Floating CTA: visible once the hero is gone, hidden while the form is in view.
  var float = document.querySelector('[data-arc-float]');
  var hero = document.querySelector('.arc-hero');
  var quote = document.getElementById('arc-quote');
  if (float && hero && quote && 'IntersectionObserver' in window) {
    var heroGone = false, quoteShown = false;
    var sync = function () { float.hidden = !(heroGone && !quoteShown); };
    new IntersectionObserver(function (e) { heroGone = !e[0].isIntersecting; sync(); }).observe(hero);
    new IntersectionObserver(function (e) { quoteShown = e[0].isIntersecting; sync(); }, { threshold: 0.1 }).observe(quote);
  }

  document.querySelectorAll('[data-arc-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
