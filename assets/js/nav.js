'use strict';

var IS_SUBPAGE = window.location.pathname.indexOf('/pages/') !== -1;
var ROOT = IS_SUBPAGE ? '../' : '';

var NAV_HTML = '<nav class="nav">'
  + '<div class="nav-inner">'
  + '<button class="nav-hamburger" id="nav-hamburger" aria-label="Open menu">'
  + '<span></span><span></span><span></span>'
  + '</button>'
  + '<a href="' + ROOT + 'index.html" class="nav-logo" style="text-decoration:none;">QXO <span>/ Roll-Up Study</span></a>'
  + '<div class="nav-links" id="nav-desktop-links">'
  + '<a href="' + ROOT + 'index.html">Overview</a>'
  + '<a href="' + ROOT + 'pages/jacobs.html">Brad Jacobs</a>'
  + '<a href="' + ROOT + 'pages/rollup.html">The Playbook</a>'
  + '<a href="' + ROOT + 'pages/timeline.html">QXO Timeline</a>'
  + '<a href="' + ROOT + 'pages/dashboard.html">Dashboard</a>'
  + '<a href="' + ROOT + 'pages/about.html">About</a>'
  + '</div>'
  + '</div>'
  + '</nav>'
  + '<div class="nav-mobile-menu" id="nav-mobile-menu">'
  + '<a href="' + ROOT + 'index.html">Overview</a>'
  + '<a href="' + ROOT + 'pages/jacobs.html">Brad Jacobs</a>'
  + '<a href="' + ROOT + 'pages/rollup.html">The Playbook</a>'
  + '<a href="' + ROOT + 'pages/timeline.html">QXO Timeline</a>'
  + '<a href="' + ROOT + 'pages/dashboard.html">Dashboard</a>'
  + '<a href="' + ROOT + 'pages/about.html">About</a>'
  + '</div>';

var FOOTER_HTML = '<footer>'
  + '<div class="footer-inner">'
  + '<div class="footer-top">'
  + '<div><div class="footer-disclaimer">This website is produced for educational and informational purposes only. It does not constitute investment advice, a solicitation to buy or sell any security, or the opinion of any employer, client, or affiliated organization. All deal terms, financial figures, and biographical facts are sourced from SEC EDGAR filings, official company investor relations materials, and credible financial reporting, and are cited inline throughout the site. Past performance of any company or executive does not guarantee future results.</div></div>'
  + '<div class="footer-attribution">'
  + '<div style="font-size:0.78rem;color:var(--linen);margin-bottom:0.5rem;">Ted Nawrocki</div>'
  + '<div><a href="https://linkedin.com/in/tednawrockinyc/" target="_blank" rel="noopener">linkedin.com/in/tednawrockinyc</a></div>'
  + '<div style="margin-top:0.5rem;color:rgba(255,255,255,0.2)">Senior Manager, Financial Services</div>'
  + '</div>'
  + '</div>'
  + '<div class="footer-bottom">'
  + '<span>QXO Roll-Up Study &mdash; Educational Content Only</span>'
  + '<span>Sources: SEC EDGAR &middot; QXO IR &middot; XPO IR &middot; GXO IR &middot; RXO IR</span>'
  + '</div>'
  + '</div>'
  + '</footer>';

document.addEventListener('DOMContentLoaded', function() {
  var navTarget    = document.getElementById('nav-target');
  var footerTarget = document.getElementById('footer-target');
  if (navTarget)    navTarget.outerHTML    = NAV_HTML;
  if (footerTarget) footerTarget.outerHTML = FOOTER_HTML;

  setTimeout(function() {
    /* Active link */
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(function(a) {
      var aFile = (a.getAttribute('href') || '').split('/').pop();
      if (aFile && aFile === filename) a.classList.add('active');
    });

    /* Hamburger toggle */
    var btn  = document.getElementById('nav-hamburger');
    var menu = document.getElementById('nav-mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = menu.classList.contains('open');
      if (isOpen) {
        menu.classList.remove('open');
        btn.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        menu.classList.add('open');
        btn.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    menu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        menu.classList.remove('open');
        btn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', function(e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('open');
        btn.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }, 50);
});
