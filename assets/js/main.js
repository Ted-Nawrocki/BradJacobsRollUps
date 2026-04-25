/* ============================================================
   QXO ROLL-UP STUDY | Shared JS
   Stock data via Stooq public CSV endpoint (no API key required)
   ============================================================ */

'use strict';

/* ── Scroll Fade-Up Animations ──────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* Small delay ensures browser has painted before we observe */
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

  /* ── Stock Price Fetcher (Stooq) ─────────────────────── */
  populateStockCards();
});

/* ── Stooq CSV Fetcher ───────────────────────────────────── */
/*
  Endpoint: https://stooq.com/q/l/?s={SYMBOL}.US&f=sd2t2ohlcv&h&e=csv
  Returns:  Symbol, Date, Time, Open, High, Low, Close, Volume
  No API key required. Change = Close minus Open (same-session proxy).
*/
async function fetchStockPrice(ticker) {
  const url = 'https://stooq.com/q/l/?s=' + ticker + '.US&f=sd2t2ohlcv&h&e=csv';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) throw new Error('No data row');
    const values = lines[1].split(',');
    const open  = parseFloat(values[3]);
    const close = parseFloat(values[6]);
    if (isNaN(close) || close <= 0) throw new Error('Invalid price');
    return {
      price:  close,
      change: close - open,
      pct:    ((close - open) / open) * 100,
      date:   values[1]
    };
  } catch (err) {
    return null;
  }
}

async function populateStockCards() {
  const cards = document.querySelectorAll('[data-ticker]');
  if (!cards.length) return;

  await Promise.all(Array.from(cards).map(async function (card) {
    const ticker  = card.dataset.ticker;
    const priceEl = card.querySelector('.stock-price');
    const changeEl = card.querySelector('.stock-change');
    const tsEl    = card.querySelector('.stock-ts');
    if (!priceEl) return;

    const data = await fetchStockPrice(ticker);
    if (!data) {
      priceEl.textContent = '--';
      if (changeEl) { changeEl.textContent = 'data unavailable'; changeEl.className = 'stock-change'; }
      return;
    }
    priceEl.textContent = '$' + data.price.toFixed(2);
    if (changeEl) {
      const s = data.change >= 0 ? '+' : '';
      changeEl.textContent = s + data.change.toFixed(2) + ' (' + s + data.pct.toFixed(2) + '%)';
      changeEl.className = 'stock-change ' + (data.change >= 0 ? 'up' : 'down');
    }
    if (tsEl) tsEl.textContent = data.date + ' \u00b7 Stooq';
  }));
}
