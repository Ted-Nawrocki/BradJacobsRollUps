/* ============================================================
   QXO ROLL-UP STUDY | Shared JS
   Stock data via Stooq public CSV endpoint (no API key required)
   ============================================================ */

'use strict';

/* Mark JS as loaded — enables fade-up animations safely */
document.documentElement.classList.add('js-loaded');

/* ── Active Nav ─────────────────────────────────────────── */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
})();

/* ── Scroll Fade-Up Animations ──────────────────────────── */
(function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('visible'), delay * 150);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

/* ── Bar Chart Animation ────────────────────────────────── */
(function initBarCharts() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transform = 'scaleX(1)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => io.observe(b));
})();

/* ── Stock Price Fetcher (Stooq) ─────────────────────────── */
/*
  Stooq public CSV endpoint — no API key required, CORS-accessible.
  Format: Symbol.US for NYSE/Nasdaq listings (e.g. QXO.US, XPO.US)
  Endpoint: https://stooq.com/q/l/?s={SYMBOL}&f=sd2t2ohlcv&h&e=csv
  Returns CSV: Symbol,Date,Time,Open,High,Low,Close,Volume
  One row per request. Change = Close - Open (same-day proxy).
  Date format returned: YYYY-MM-DD
*/
async function fetchStockPrice(ticker) {
  const symbol = ticker + '.US';
  const url = `https://stooq.com/q/l/?s=${symbol}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    // CSV: header row + data row
    const lines = text.trim().split('\n');
    if (lines.length < 2) throw new Error('No data row');
    const values = lines[1].split(',');
    // Columns: Symbol, Date, Time, Open, High, Low, Close, Volume
    const open  = parseFloat(values[3]);
    const close = parseFloat(values[6]);
    if (isNaN(close) || close <= 0) throw new Error('Invalid price');
    const change = close - open;
    const pct    = (change / open) * 100;
    const date   = values[1]; // YYYY-MM-DD
    return { price: close, change, pct, date };
  } catch (err) {
    return null;
  }
}

async function populateStockCards() {
  const cards = document.querySelectorAll('[data-ticker]');
  if (!cards.length) return;

  const promises = Array.from(cards).map(async card => {
    const ticker = card.dataset.ticker;
    const priceEl  = card.querySelector('.stock-price');
    const changeEl = card.querySelector('.stock-change');
    const tsEl     = card.querySelector('.stock-ts');
    if (!priceEl) return;

    const data = await fetchStockPrice(ticker);
    if (!data) {
      priceEl.textContent = '--';
      if (changeEl) { changeEl.textContent = 'data unavailable'; changeEl.className = 'stock-change'; }
      return;
    }

    priceEl.textContent = `$${data.price.toFixed(2)}`;
    if (changeEl) {
      const sign = data.change >= 0 ? '+' : '';
      changeEl.textContent = `${sign}${data.change.toFixed(2)} (${sign}${data.pct.toFixed(2)}%)`;
      changeEl.className = `stock-change ${data.change >= 0 ? 'up' : 'down'}`;
    }
    if (tsEl) {
      tsEl.textContent = `${data.date} · Stooq`;
    }
  });
  await Promise.all(promises);
}

document.addEventListener('DOMContentLoaded', populateStockCards);

/* ── Mobile Nav Toggle ──────────────────────────────────── */
(function mobileNav() {
  const btn = document.getElementById('nav-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
})();
