# QXO Roll-Up Study
**Author:** Ted Nawrocki | [linkedin.com/in/tednawrockinyc](https://linkedin.com/in/tednawrockinyc/)

An analyst-grade, multi-page website examining Brad Jacobs' roll-up acquisition strategy using QXO as a live case study. All content sourced from SEC EDGAR filings and official company IR materials.

---

## Site Structure

```
qxo-site/
├── index.html              ← Homepage / Overview
├── pages/
│   ├── jacobs.html         ← Brad Jacobs Profile + live QXO stock card
│   ├── rollup.html         ← Roll-Up Strategy Deep Dive
│   ├── timeline.html       ← QXO Acquisition Timeline (deal terms)
│   ├── dashboard.html      ← Live Stock Dashboard (all 5 Jacobs companies)
│   └── about.html          ← Sources, Methodology, Author
├── assets/
│   ├── css/style.css       ← Full design system
│   ├── js/main.js          ← Stock fetching, scroll animations
│   ├── js/nav.js           ← Shared nav + footer injection
│   └── images/             ← Place brad-jacobs.jpg here (see below)
└── README.md
```

---

## GitHub Pages Deployment — Step by Step

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository** (top right, green button)
3. Name it: `qxo-rollup-study` (or anything you prefer)
4. Set visibility: **Public** (required for free GitHub Pages)
5. Do NOT initialize with README — you'll push your own files
6. Click **Create repository**

### Step 2: Upload Your Files

**Option A — GitHub Web Interface (no Git required):**
1. On the new repo page, click **uploading an existing file**
2. Drag the entire `qxo-site/` folder contents (not the folder itself) to the upload area
3. Important: maintain the folder structure (pages/, assets/css/, assets/js/, assets/images/)
4. Commit the files

**Option B — Git Command Line:**
```bash
cd /path/to/qxo-site
git init
git add .
git commit -m "Initial commit — QXO Roll-Up Study"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/qxo-rollup-study.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. In your repository, go to **Settings** (gear icon, top right)
2. Scroll to the **Pages** section in the left sidebar
3. Under **Source**, select:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**
5. Wait 1-3 minutes for the first build

### Step 4: Access Your Live Site

Your site will be live at:
```
https://YOUR-USERNAME.github.io/qxo-rollup-study/
```

GitHub will show the URL in the Pages settings section once deployed.

---

## Adding Brad Jacobs' Photo

The Jacobs profile page has a placeholder. To add his photo:

1. Source a licensed image from one of these official locations:
   - **QXO Investor Relations:** https://investors.qxo.com (press releases often include headshots)
   - **Jacobs Private Equity:** https://www.jpe.com
   - **Business Wire / PR Newswire:** Search "Brad Jacobs QXO" for press kit images
   - **Getty Images** (if you have a license)

2. Save the image as: `assets/images/brad-jacobs.jpg`

3. In `pages/jacobs.html`, find the comment block that reads:
   ```
   <!-- PHOTO PLACEMENT INSTRUCTIONS -->
   ```
   
4. Replace the placeholder `div` block with:
   ```html
   <img src="../assets/images/brad-jacobs.jpg" alt="Brad Jacobs, Chairman and CEO of QXO" />
   ```

---

## Stock Price Data

The Dashboard and Jacobs Profile page fetch prices using Stooq's public CSV endpoint:
```
https://stooq.com/q/l/?s={TICKER}.US&f=sd2t2ohlcv&h&e=csv
```

No API key required. Returns end-of-day OHLCV data as a CSV. The change figure compares close vs. open for the current session (same-day proxy for daily change).

If Stooq's endpoint changes, fallback options:

**Option 1 — Finnhub (free tier):**
```
https://finnhub.io/api/v1/quote?symbol={TICKER}&token=YOUR_FREE_KEY
```
Register free at finnhub.io

**Option 2 — Alpha Vantage (free tier):**
```
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={TICKER}&apikey=YOUR_KEY
```
Register free at alphavantage.co

To switch API, edit the `fetchStockPrice()` function in `assets/js/main.js`.

---

## Updating Content

All content is in plain HTML files. To update:
- **New acquisition announced:** Edit `pages/timeline.html` — add a new `.tl-deal` block following the existing pattern
- **Deal closes:** Change `pending-badge` to `deal-pill-closed` and update the closed date in the terms grid
- **New stock card:** Add a `<div class="dash-card" data-ticker="TICKER">` block in `pages/dashboard.html`

---

## Disclaimer

Educational and informational purposes only. Not investment advice. Not the opinion of any employer. All facts sourced from SEC EDGAR and official IR materials as cited throughout the site.
