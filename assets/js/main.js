/* ============================================================
   QXO ROLL-UP STUDY | Shared JS
   Stock data via Finnhub free tier (finnhub.io)
   ============================================================ */

'use strict';

/* ── Scroll Fade-Up Animations ──────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  setTimeout(function () {
    var els = document.querySelectorAll('.fade-up');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var delay = parseInt(e.target.dataset.delay || 0, 10);
          setTimeout(function () { e.target.classList.add('visible'); }, delay * 150);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }, 100);

  /* ── Bar Chart Animation ──────────────────────────────── */
  setTimeout(function () {
    var bars = document.querySelectorAll('.bar-fill');
    if (!bars.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.transform = 'scaleX(1)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(function (b) { io.observe(b); });
  }, 100);

  populateStockCards();
});

/* ── Finnhub fetcher with timeout ────────────────────────── */
var FINNHUB_KEY = 'd7mjle9r01qngrvof0vgd7mjle9r01qngrvof100';

function fetchWithTimeout(url, ms) {
  var controller = new AbortController();
  var timer = setTimeout(function () { controller.abort(); }, ms);
  return fetch(url, { signal: controller.signal })
    .then(function (r) { clearTimeout(timer); return r; })
    .catch(function (e) { clearTimeout(timer); throw e; });
}

async function fetchStockPrice(ticker) {
  var url = 'https://finnhub.io/api/v1/quote?symbol=' + ticker + '&token=' + FINNHUB_KEY;
  try {
    var res = await fetchWithTimeout(url, 8000);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    if (!data.c || data.c <= 0) throw new Error('Invalid price');
    return {
      price:  data.c,
      change: data.d,
      pct:    data.dp,
      date:   new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  } catch (err) {
    return null;
  }
}

async function populateStockCards() {
  var cards = document.querySelectorAll('[data-ticker]');
  if (!cards.length) return;

  await Promise.all(Array.from(cards).map(async function (card) {
    var ticker   = card.dataset.ticker;
    var priceEl  = card.querySelector('.stock-price');
    var changeEl = card.querySelector('.stock-change');
    var tsEl     = card.querySelector('.stock-ts');
    if (!priceEl) return;

    var data = await fetchStockPrice(ticker);
    if (!data) {
      priceEl.textContent = '--';
      if (changeEl) { changeEl.textContent = 'data unavailable'; changeEl.className = 'stock-change'; }
      return;
    }
    priceEl.textContent = '$' + data.price.toFixed(2);
    if (changeEl) {
      var s = data.change >= 0 ? '+' : '';
      changeEl.textContent = s + data.change.toFixed(2) + ' (' + s + data.pct.toFixed(2) + '%)';
      changeEl.className = 'stock-change ' + (data.change >= 0 ? 'up' : 'down');
    }
    if (tsEl) tsEl.textContent = data.date + ' \u00b7 Finnhub';
  }));
}
