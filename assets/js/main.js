/* ============================================================
   QXO ROLL-UP STUDY | Shared JS
   Stock data via Yahoo Finance (unofficial public endpoint)
   ============================================================ */

'use strict';

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

/* ── Stock Price Fetcher ─────────────────────────────────── */
/*
  Uses Yahoo Finance v8 endpoint (CORS-accessible, no API key).
  Note: This is an unofficial/undocumented endpoint. If it stops
  working, replace with Alpha Vantage or Finnhub (both free tier).
  Endpoint: https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}
*/
async function fetchStockPrice(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2d`;
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) throw new Error('No result');
    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prev  = meta.chartPreviousClose || meta.previousClose;
    const change = price - prev;
    const pct    = (change / prev) * 100;
    return { price, change, pct, currency: meta.currency || 'USD' };
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
      tsEl.textContent = `As of ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })} · Yahoo Finance`;
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
