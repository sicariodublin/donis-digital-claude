# FS Digital — Project Plan

Marketing site for FS Digital, a Dublin-based web development practice, at
[fsteyerdigital.com](https://fsteyerdigital.com). Single-page main site plus
three industry demos, two legal pages, and a Formspree-backed contact form.

This document is the operator's manual: what exists, how it's deployed, and
what's still on the to-do list.

---

## 1. Stack

| Layer       | Choice                                                                |
|-------------|-----------------------------------------------------------------------|
| Markup      | Plain HTML5, no framework, no build step                              |
| Styles      | Hand-written CSS, custom-properties theming, mobile-first             |
| Scripts     | Vanilla JS (ES modules not required), `defer`-loaded                  |
| Fonts       | Google Fonts — Syne, DM Sans, JetBrains Mono (main); per-demo serifs  |
| Forms       | Formspree (`https://formspree.io/f/xrevpnzj` → `fabiosteyer@gmail.com`) |
| Hosting     | Cloudflare Worker (static assets) — `donis-digital-claude`            |
| Domain      | `fsteyerdigital.com`, registered at Blacknight, DNS on Cloudflare     |
| Email       | Cloudflare Email Routing (`hello@` → `fabiosteyer@gmail.com`)         |
| Repo        | [github.com/sicariodublin/donis-digital-claude](https://github.com/sicariodublin/donis-digital-claude) |

Deliberate non-choices: no analytics, no advertising cookies, no third-party
trackers. The cookie banner exists only to record the user's awareness in
`localStorage` — there is nothing to consent to beyond that today.

---

## 2. Repository layout

```
/
  donis-digital.html        Main marketing page (single-page site)
  donis-digital.css         Main stylesheet
  donis-digital.js          Smooth scroll, reveal-on-scroll, Formspree submit, cookie banner
  index.html                Meta-refresh redirect to donis-digital.html
  privacy.html              GDPR-aware privacy policy
  terms.html                Terms & conditions
  legal.css                 Shared stylesheet for privacy.html and terms.html
  robots.txt                Allows all, points at sitemap
  sitemap.xml               Main page + legal pages + 3 demos
  Print_Transparent.svg     Logo (active — circular FS mark, cyan/purple gradient)
  Logo.png                  Logo raster — unused, candidate for deletion
  README.md                 Short repo intro
  LICENSE                   Project licence

  demos/
    bella-roma/             Restaurant demo (Playfair Display + Cormorant Garamond)
      index.html, style.css, script.js
    church/                 St. Patrick's Community Church demo (EB Garamond + Cinzel)
      index.html, style.css, script.js
    accountancy/            Clarke & Associates demo (Fraunces + Inter)
      index.html, style.css, script.js
```

### Files to delete (decisions made)
The following files are confirmed legacy and should be removed in the next push
to slim the deploy and avoid confusion:

- `Print_Transparent_1.svg` (~354 KB) — old logo iteration, unreferenced
- `Print_Transparent_2.svg` — old logo iteration, unreferenced
- `logo-options.html` — colour comparison page used during design, unreferenced
- `netlify.toml` — legacy from abandoned Netlify Forms approach; Cloudflare is
  the confirmed host, Netlify is off the table
- `Logo.png` (87 KB) — raster logo, superseded by SVG; confirm unreferenced
  before deleting

---

## 3. Deployment

**Single source of truth:** the `main` branch of `donis-digital-claude` on GitHub.

```
local change → git push origin main → Cloudflare Worker auto-builds → live
```

The Worker is configured under **Cloudflare → Workers & Pages → donis-digital-claude**:
- Source: GitHub `sicariodublin/donis-digital-claude`, branch `main`
- Type: Static-assets Worker (no server code)
- Custom domain: `www.fsteyerdigital.com` (proxied)

DNS in Cloudflare:
- `fsteyerdigital.com` → CNAME → `www.fsteyerdigital.com` (apex flattening, proxied)
- `www.fsteyerdigital.com` → Worker `donis-digital-claude` (proxied)
- MX records → Cloudflare Email Routing
- TXT records → SPF + DKIM for outbound mail integrity

There is no GitHub Pages deploy. The repo's `CNAME` file has been removed.
The old `sicariodublin/donis-digital` repo on GitHub should be archived
(Settings → Danger Zone → Archive) to prevent accidental pushes there.

### Verifying a deploy
1. Push to `main`.
2. **Workers & Pages → donis-digital-claude → Deployments** — watch the new deployment go green.
3. Hard-reload (`Ctrl+Shift+R`) on `fsteyerdigital.com`. Cache-busting query strings
   (`?v=YYYYMMDDx`) on the CSS/JS link tags should already force a refresh; bump them
   manually when shipping a meaningful asset change.

---

## 4. Current state

### Live and working
- Main site, all sections render: hero, services, packages, process, demos, about, contact, footer.
- Three demos behind real URLs:
  - `/demos/bella-roma/`
  - `/demos/church/`
  - `/demos/accountancy/`
- Formspree contact form: POSTs via fetch, shows styled success/error panel below
  the submit button, resets on success. First submission requires a one-time
  email confirmation in the Formspree dashboard.
- Legal pages (`privacy.html`, `terms.html`) linked from the main footer.
- Cookie consent banner appears on first visit and persists choice in localStorage.
- robots.txt + sitemap.xml in place; demos marked `noindex,follow`.
- Open Graph + Twitter Card tags on main page; per-page meta descriptions and
  canonicals across the site.
- Cloudflare Email Routing delivers `hello@fsteyerdigital.com` to the personal inbox.
- Fictional businesses disclaimer added to the `#demos` section of the main page.

### Known cosmetic placeholders
- All demo "galleries" use emoji icons in gradient panels, not real photography.
  The Bella Roma gallery says so out loud at the bottom of the section.
- The "About" section on the main page describes the founder and stack; the logo
  uses a CSS transform/scale to fill its container. Replace if a better-fitted
  asset becomes available.
- Service-card icons on the main page are emoji. Intentional for now; replace
  with a custom icon set if/when budget allows.
- Demo footer "fictional businesses" disclaimer currently only appears on the
  main site's `#demos` section — not inside each individual demo footer (see roadmap).

---

## 5. Roadmap

Tasks are ordered by priority. Do not skip to "Content" or "Functionality"
items while "Immediate" items remain open.

### Immediate (next push — do these before showing the site to any client)

- [ ] **Delete legacy files:** `Print_Transparent_1.svg`, `Print_Transparent_2.svg`,
  `logo-options.html`, `netlify.toml`, `Logo.png` (confirm unused first).
- [ ] **Merge Cloudflare PR #1** (`cloudflare/workers-autoconfig`) — if it only
  adds `wrangler.toml`, merging is safe and pins build config in the repo.
- [ ] **Archive old repo** `sicariodublin/donis-digital` on GitHub to block
  accidental pushes.
- [ ] **Add fictional businesses disclaimer to each demo footer** — one line per
  demo, e.g. *"Bella Roma is a fictional business created for demonstration
  purposes by FS Digital."* Add to the `<footer>` of each demo's `index.html`.
- [ ] **Build a branded 404 page** (`404.html`) — the Worker currently serves a
  generic Cloudflare 404, which looks unprofessional. Keep it simple: logo,
  "Page not found", link back to the homepage.

### Soon (within 2–3 weeks)

- [ ] **Replace emoji demo previews with real screenshots** on the main page
  (`demos-grid` section in `donis-digital.html`). Take browser screenshots of
  each demo at ~1200px wide, crop to 16:9, save as WebP. Biggest single visual
  upgrade available right now.
- [ ] **Update `privacy.html` and `terms.html`** with the registered business
  address and company/sole trader number once formalised with Revenue/CRO.
- [ ] **Add Plausible analytics** once the site is being shown to clients —
  privacy-respecting, no cookie required, ~€9/month. Update `privacy.html`
  accordingly when added.

### Content (ongoing)

- [ ] Real photography for Bella Roma gallery; real parish photo for church demo;
  office/team photo for Clarke & Associates. Stock photos acceptable interim.
- [ ] Add 1–2 client testimonials to the main site once available.
- [ ] Consider a short blog or notes section if SEO becomes a priority — the site
  currently has zero indexed long-form copy.

### Functionality (when relevant)

- [ ] Wire church demo donate buttons to a real payment URL (Stripe Payment Link
  or similar) before showing this demo to a real parish client.
- [ ] Wire accountancy demo "Client Portal" link to a real portal URL before
  showing to a real accountancy client.
- [ ] Add rate limiting to the Formspree endpoint if spam becomes an issue
  (Cloudflare WAF → Rate Limiting rules on `POST /` to Formspree).

### Performance

- [ ] Audit demo CSS files for unused selectors — each is ~17–25 KB hand-written
  and likely has dead rules from iteration.
- [ ] Add `loading="lazy"` to all `<img>` tags once real images are added.
- [ ] Confirm `Logo.png` is truly unreferenced and delete it.

### Accessibility

- [ ] Run Lighthouse and axe-core audit once real content and images are in place.
- [ ] Verify focus order and keyboard reachability of the mobile nav menu on each
  demo (burger → open → tab through links → close).

---

## 6. Business operations

This section covers the non-technical side of running FS Digital.

### Legal & compliance checklist (sole trader setup, Ireland)
- [ ] Register business name "FS Digital" with the CRO at [cro.ie](https://cro.ie) — €20 online
- [ ] Register for self-assessment income tax with Revenue at [ros.ie](https://ros.ie)
- [ ] Get Professional Indemnity Insurance before first paid client
  (check Chill Insurance or AXA — typically €200–400/year for a solo developer)
- [ ] Contact Local Enterprise Office (LEO) about the **Trading Online Voucher**
  (up to €2,500 for online business costs — advertising, SEO tools, etc.)
  at [localenterprise.ie](https://localenterprise.ie)
- [ ] Register for VAT if/when annual turnover exceeds €37,500

### Client documents needed before first paid project
Both of the following should be ready before any client pays a deposit.
They do not need to be elaborate — clear and simple is better.

- [ ] **Proposal template** — one page covering: scope of work, deliverables,
  timeline, price, what's included, what's not included, revision rounds.
- [ ] **Client contract / service agreement** — covers: payment terms (50%
  deposit, 50% on completion is standard), IP ownership (client owns the site
  once paid in full), what happens if the client disappears mid-project,
  your liability limitation, and that fictional demo content belongs to you.

### Invoicing
- Use a simple tool like [Invoice Ninja](https://invoiceninja.com) (free) or
  [Bullet](https://bullethq.ie) (Irish, VAT-aware).
- Keep every receipt for business expenses — laptop, software subscriptions,
  hosting, insurance. These reduce your taxable profit.
- A laptop purchased for business use can be written off as a capital allowance
  under Revenue Section 32.

---

## 7. Infrastructure operations

### Where things live
| Concern                    | Where                                                   |
|----------------------------|---------------------------------------------------------|
| Source code                | `donis-digital-claude` repo, `main` branch              |
| Live deployments           | Cloudflare → Workers & Pages → `donis-digital-claude`   |
| DNS                        | Cloudflare → DNS → `fsteyerdigital.com`                 |
| Form submissions           | Formspree dashboard, form `xrevpnzj`                    |
| Inbound email              | Cloudflare → Email Routing                              |
| Domain renewal             | Blacknight account (set a calendar reminder)            |

### Common tasks
- **Change copy or styles:** edit the file locally, `git commit`, `git push`. Worker redeploys in under a minute.
- **Roll back a bad deploy:** Cloudflare → Workers & Pages → `donis-digital-claude` → Deployments → click an earlier successful deploy → "Rollback to this deployment".
- **Check form submissions:** Formspree dashboard or the forwarded email at `fabiosteyer@gmail.com`.
- **Add a new page:** create the `.html` file, add it to `sitemap.xml`, link from the main footer or nav.
- **Bump cache-busting strings:** when changing `donis-digital.css` or `donis-digital.js`, increment the `?v=` query string in `donis-digital.html` (e.g. `?v=20250601` → `?v=20250602`).

### Things not to touch without a reason
- The MX and TXT records in Cloudflare DNS — they keep email working.
- The cache-busting `?v=` query strings on CSS/JS in `donis-digital.html` — bump them, don't delete them.
- The `_next` and `_gotcha` hidden inputs in the contact form — Formspree relies on them.
- The Cloudflare orange-cloud (proxied) setting on the web DNS records — leave it on for DDoS protection and caching. If TLS or caching ever misbehaves, switching `www` to "DNS only" is the first diagnostic step.

---

## 8. Resolved decisions

Decisions that were open questions and are now closed.

| Question | Decision |
|----------|----------|
| Keep `netlify.toml`? | **Delete it.** Cloudflare is the confirmed host. |
| Delete unused SVG/logo files? | **Yes.** `Print_Transparent_1.svg`, `_2.svg`, `logo-options.html` are all legacy. |
| Fictional businesses disclaimer — main page only or per demo? | **Both.** Add a one-line disclaimer to each demo footer. |
| Replace service-card emoji with icon set? | **Not now.** Emoji stay until budget allows. |
| Cloudflare orange-cloud proxying — leave on? | **Yes.** Free DDoS protection and caching. Only disable to diagnose TLS issues. |
| Analytics? | **Plausible when ready.** No analytics until site is being actively shown to clients. |
| Contact form solution? | **Formspree** (`xrevpnzj`). Resend free tier is used by Add & Compare. |
