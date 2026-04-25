/* nav.js — injects shared navigation and footer, handles root and /pages/ subdirectory */
'use strict';

const IS_SUBPAGE = window.location.pathname.includes('/pages/');
const ROOT = IS_SUBPAGE ? '../' : '';

const NAV_HTML = `
<nav class="nav">
  <div class="nav-inner">
    <a href="${ROOT}index.html" class="nav-logo" style="text-decoration:none;">QXO <span>/ Roll-Up Study</span></a>
    <div class="nav-links">
      <a href="${ROOT}index.html">Overview</a>
      <a href="${ROOT}pages/jacobs.html">Brad Jacobs</a>
      <a href="${ROOT}pages/rollup.html">The Playbook</a>
      <a href="${ROOT}pages/timeline.html">QXO Timeline</a>
      <a href="${ROOT}pages/dashboard.html">Dashboard</a>
      <a href="${ROOT}pages/about.html">About</a>
    </div>
  </div>
</nav>
`;

const FOOTER_HTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="footer-disclaimer">
          This website is produced for educational and informational purposes only. It does not constitute investment advice, a solicitation to buy or sell any security, or the opinion of any employer, client, or affiliated organization. All deal terms, financial figures, and biographical facts are sourced from SEC EDGAR filings, official company investor relations materials, and credible financial reporting, and are cited inline throughout the site. Past performance of any company or executive does not guarantee future results.
        </div>
      </div>
      <div class="footer-attribution">
        <div style="font-size:0.78rem; color: var(--linen); margin-bottom:0.5rem;">Ted Nawrocki</div>
        <div><a href="https://linkedin.com/in/tednawrockinyc/" target="_blank" rel="noopener">linkedin.com/in/tednawrockinyc</a></div>
        <div style="margin-top:0.5rem; color:rgba(255,255,255,0.2)">Senior Manager, Financial Services</div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>QXO Roll-Up Study &mdash; Educational Content Only</span>
      <span>Sources: SEC EDGAR &middot; QXO IR &middot; XPO IR &middot; GXO IR &middot; RXO IR</span>
    </div>
  </div>
</footer>
`;

document.addEventListener('DOMContentLoaded', () => {
  const navTarget = document.getElementById('nav-target');
  const footerTarget = document.getElementById('footer-target');
  if (navTarget) navTarget.outerHTML = NAV_HTML;
  if (footerTarget) footerTarget.outerHTML = FOOTER_HTML;

  setTimeout(() => {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const filename = path.split('/').pop();
      const aFilename = href.split('/').pop();
      if (filename && aFilename && filename === aFilename) {
        a.classList.add('active');
      }
    });
  }, 10);
});
