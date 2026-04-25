/* ============================================================
   QXO ROLL-UP STUDY | Shared JS
   Stock data via Finnhub (free tier, no credit card required)
   ============================================================ */

'use strict';

/* ── Scroll Fade-Up Animations ──────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  setTimeout(function () {
    const els = document.querySelectorAll('.fade-up');
    if (!els.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.dataset.delay || 0, 10);
          setTimeout(function () {
            e.target.classList.add('visible');
          }, delay * 150);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    els.forEach(function (el) { io.observe(el); });
  }, 100);

  /* ── Bar Chart Animation ──────────────────────────────── */
  setTimeout(function () {
    const bars = document.querySelectorAll('.bar-fill');
    if (!bars.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.transform = 'scaleX(1)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (b) { io.observe(b); });
  }, 100);

  /* ── Stock Price Fetcher ─────────────────────────────── */
  populateStockCards();
});

/* ── Finnhub Fetcher ─────────────────────────────────────── */
/*
  Finnhub free tier — https://finnhub.io
  Endpoint: https://finnhub.io/api/v1/quote?symbol={TICKER}&token={KEY}
  Returns: c (current price), o (open), pc (previous close), d (change), dp (change %)
*/
var FINNHUB_KEY = 'd7mjle9r01qngrvof0vgd7mjle9r01qngrvof100';

async function fetchStockPrice(ticker) {
  var url = 'https://finnhub.io/api/v1/quote?symbol=' + ticker + '&token=' + FINNHUB_KEY;
  try {
    var res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    var price = data.c;
    var change = data.d;
    var pct = data.dp;
    if (!price || price <= 0) throw new Error('Invalid price');
    return {
      price:  price,
      change: change,
      pct:    pct,
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
    var ticker  = card.dataset.ticker;
    var priceEl = card.querySelector('.stock-price');
    var changeEl = card.querySelector('.stock-change');
    var tsEl    = card.querySelector('.stock-ts');
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
