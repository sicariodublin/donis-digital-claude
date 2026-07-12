# FS.Digital — Project Plan

Marketing site for FS.Digital, a Dublin-based web development practice, at
[fsteyerdigital.com](https://fsteyerdigital.com). Single-page main site plus
four industry demos, two legal pages, a Formspree-backed contact form, and a
Portuguese (pt-BR) localised version of the site at `/pt/`.

This document is the operator's manual: what exists, how it's deployed, and
what's still on the to-do list.

**Founder:** Fabio A. Steyer  
**Brand name:** FS.Digital (always with the dot)  
**Email:** hello@fsteyerdigital.com  
**Domain:** fsteyerdigital.com  

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
  index.html                Main marketing page (single-page site, EN)
  donis-digital.css         Main stylesheet (shared by EN and PT)
  donis-digital.js          Smooth scroll, reveal-on-scroll, Formspree submit,
                            cookie banner, language-preference persistence
  donis-digital.html        Meta-refresh redirect to / (noindex, kept for old
                            inbound links to the legacy /donis-digital.html URL)
  404.html                  Branded 404 page (served via wrangler.jsonc, see below)
  wrangler.jsonc            Worker config — assets directory + not_found_handling
  privacy.html              GDPR-aware privacy policy (EN)
  terms.html                Terms & conditions (EN)
  legal.css                 Shared stylesheet for privacy.html and terms.html (EN + PT)
  robots.txt                Allows all, points at sitemap
  sitemap.xml               Main page + legal pages + 3 demos + PT equivalents
  Print_Transparent.svg     Logo (active — circular FS mark, cyan/purple gradient)
  fs-digital-pt-br.md       PT-BR copy reference used to build /pt/
  README.md                 Short repo intro
  LICENSE                   Project licence

  pt/
    index.html              Portuguese (pt-BR) localised main page, loads the
                            shared donis-digital.css/.js from root
    privacy.html            Portuguese privacy policy (translation of root privacy.html)
    terms.html              Portuguese terms & conditions (translation of root terms.html)

  demos/
    bella-roma/             Restaurant demo (Playfair Display + Cormorant Garamond)
      index.html, style.css, script.js, preview.webp
    church/                 St. Patrick's Community Church demo (EB Garamond + Cinzel)
      index.html, style.css, script.js, preview.webp
    accountancy/            Clarke & Associates demo (Fraunces + Inter)
      index.html, style.css, script.js, preview.webp
    gyms/                   Evolution Gym -- real client project (Bebas Neue +
                            Barlow Condensed + Inter), shown as the 4th demo
                            card; see demos/gyms/EVOLUTION_GYM_PROJECT_PLAN.md
                            index.html, style.min.css, script.min.js,
                            preview.webp, plus client photos/logo
```

### Language switching (EN <-> PT)
- Nav on both `index.html` and `pt/index.html` has a `.lang-switch`
  with `EN` -> `/` and `PT` -> `/pt/`.
- `donis-digital.js` saves the choice to `localStorage['fs_lang']` (`'en'` or
  `'pt'`) whenever a switcher link is clicked, and automatically sets it to
  `'pt'` whenever a `/pt/*` page loads.
- On any non-`/pt/` page load, if `fs_lang` is `'pt'`, the script redirects to
  `/pt/` via `location.replace`. Default (no saved value, or `'en'`) never
  redirects.
- `pt/privacy.html` and `pt/terms.html` carry a small inline `<script>` doing
  the same `fs_lang` save + switcher click handling.

### Legacy files — cleaned up
`Print_Transparent_1.svg`, `Print_Transparent_2.svg`, `logo-options.html`,
`netlify.toml`, and `Logo.png` were all removed from the repo.

---

## 3. Deployment

**Single source of truth:** the `main` branch of `donis-digital-claude` on GitHub.

```
local change -> git push origin main -> Cloudflare Worker auto-builds -> live
```

The Worker is configured under **Cloudflare -> Workers & Pages -> donis-digital-claude**:
- Source: GitHub `sicariodublin/donis-digital-claude`, branch `main`
- Type: Static-assets Worker (no server code)
- Custom domain: `www.fsteyerdigital.com` (proxied)

DNS in Cloudflare:
- `fsteyerdigital.com` -> CNAME -> `www.fsteyerdigital.com` (apex flattening, proxied)
- `www.fsteyerdigital.com` -> Worker `donis-digital-claude` (proxied)
- MX records -> Cloudflare Email Routing
- TXT records -> SPF + DKIM for outbound mail integrity

The old `sicariodublin/donis-digital` repo on GitHub should be archived
(Settings -> Danger Zone -> Archive) to prevent accidental pushes there.

### Custom 404 handling
Workers with static assets do **not** auto-serve `404.html` the way Pages
does — it must be opted into explicitly. `wrangler.jsonc` in the repo root
sets `assets.not_found_handling: "404-page"`, which tells the Worker to
serve `404.html` (with a real `404` status) for any unmatched path. Note:
Cloudflare's bot-authored PR #2 (`cloudflare/workers-autoconfig`) also adds
a `wrangler.jsonc` without this setting — it will likely conflict with the
one now committed to `main`. Reconcile or close that PR, keeping
`not_found_handling: "404-page"`.

### Verifying a deploy
1. Push to `main`.
2. **Workers & Pages -> donis-digital-claude -> Deployments** -- watch the new deployment go green.
3. Hard-reload (`Ctrl+Shift+R`) on `fsteyerdigital.com`. Bump `?v=` query strings
   manually when shipping a meaningful asset change.

---

## 4. Current state

### Live and working
- Main site, all sections render: hero, services, packages, process, demos, about, contact, footer.
- Four demos behind real URLs:
  - `/demos/bella-roma/` -- restaurant: online menu, table reservations, gallery, hours, location
  - `/demos/church/` -- St. Patrick's: mass times, events calendar, news, donations, contact
  - `/demos/accountancy/` -- Clarke & Associates: services, team, client portal, testimonials, hours
  - `/demos/gyms/` -- Evolution Gym: real client project (3 units, membership
    plans, WhatsApp-first sign-up), shown in the same grid as the other three
- Formspree contact form: POSTs via fetch, shows styled success/error panel,
  resets on success. Delivers to `fabiosteyer@gmail.com`.
- Legal pages (`privacy.html`, `terms.html`) linked from footer (EN).
- Cookie consent banner persists choice in `localStorage`.
- robots.txt + sitemap.xml in place; demos marked `noindex,follow`.
- Open Graph + Twitter Card tags on main page; per-page meta descriptions and
  canonicals across the site.
- Cloudflare Email Routing delivers `hello@fsteyerdigital.com` to personal inbox.
- Fictional businesses disclaimer in main site `#demos` section AND in each
  individual demo footer.
- Branded `404.html` live and actually served by the Worker for unmatched
  paths (`wrangler.jsonc` -> `assets.not_found_handling: "404-page"`).
- **Portuguese (pt-BR) site at `/pt/`** -- full translation with own
  `pt/privacy.html` and `pt/terms.html`. EN <-> PT language switcher in both
  navs, choice persisted via `localStorage`. Demo links open in new tab.
- **WhatsApp** -- real number (`+353 87 066 4839`) live as a contact-link on
  both EN and PT contact sections, plus the floating button on `/pt/`.
  Pre-filled message text correct in both languages.
- Contact sections simplified to 4 items (WhatsApp, email, LinkedIn,
  location) on both EN and PT -- dropped the redundant self-referencing
  website link and the GitHub link (not relevant to prospective clients).
- **Hosting & Maintenance Plans** section live on both sites' services
  sections -- Basic/Hosting+Maintenance/Ad-hoc in euros on EN, Básico/
  Hospedagem+Manutenção/Avulsa in R$ on PT.
- Brand name and founder name consistent everywhere -- **FS.Digital** (with
  the dot, no more bare "FS Digital") and **Fabio A. Steyer** across all
  HTML pages and repo docs.
- **Real demo screenshots** live in the `#demos` grid on both EN and PT --
  `demos/{bella-roma,church,accountancy,gyms}/preview.webp`, lazy-loaded with
  explicit `width`/`height` to avoid layout shift, subtle zoom on hover.
- Contact form processor correctly described as **Formspree** (not Netlify)
  in both `privacy.html` and `pt/privacy.html`; hosting correctly described
  as Cloudflare.
- Legal-page body copy (`privacy.html`, `terms.html` and PT equivalents) and
  the main site's About-section paragraphs are justified
  (`text-align: justify` + `text-align-last: left`) for a cleaner block look.
- `hello@fsteyerdigital.com` confirmed working -- forwards to `fabiosteyer@gmail.com`.

### Known issues
- Business address and sole trader/company number not yet in legal pages --
  awaiting CRO registration.
- `terms.html` / `pt/terms.html` still say "e.g. Netlify hosting" in the
  third-party-services clause -- a generic example about client sites, not
  a claim about FS.Digital's own stack, but worth a look if fully scrubbing
  Netlify mentions from the legal pages.
- Cloudflare PR #2 (bot-authored `wrangler.jsonc`) will likely conflict with
  the `wrangler.jsonc` now committed directly to `main` for 404 handling --
  needs manual reconciliation in GitHub, not code.

### Known cosmetic placeholders
- All demo galleries use emoji icons in gradient panels, not real photography.
- Service-card icons on the main page are emoji. Intentional for now.
- Logo in About section uses CSS scale transform.

---

## 5. Roadmap

Tasks are ordered by priority.

### Immediate (next push)

- [ ] **Reconcile Cloudflare PR #2** (`cloudflare/workers-autoconfig`) --
  now conflicts with the `wrangler.jsonc` committed to `main` for custom
  404 handling. Close the PR or manually merge, keeping
  `not_found_handling: "404-page"`.
- [ ] **Archive old repo** `sicariodublin/donis-digital` on GitHub.

### Soon (within 2-3 weeks)

- [ ] **Update privacy.html and terms.html** with registered business address
  and sole trader number once CRO registration is complete.
- [ ] **Add Plausible analytics** once site is being actively shown to clients.
  Update `privacy.html` accordingly.

### Content (ongoing)

- [ ] Real photography for Bella Roma gallery; parish photo for church demo;
  office/team photo for Clarke & Associates. Stock photos acceptable interim.
- [ ] Add 1-2 client testimonials to the main site once available.
- [ ] Consider a blog/notes section if SEO becomes a priority.

### Functionality (when relevant)

- [ ] Wire church demo donate buttons to a real payment URL (Stripe Payment Link)
  before showing to a real parish client.
- [ ] Wire accountancy demo "Client Portal" link to a real portal URL before
  showing to a real accountancy client.
- [ ] Add rate limiting to Formspree if spam becomes an issue
  (Cloudflare WAF -> Rate Limiting).

### Performance

- [ ] Audit demo CSS files for unused selectors.
- [ ] Add `loading="lazy"` to all `<img>` tags once real images are added.

### Accessibility

- [ ] Run Lighthouse and axe-core audit once real content and images are in place.
- [ ] Verify focus order and keyboard reachability of mobile nav menus on demos.

---

## 6. Business operations

### Brand identity
- **Brand name:** FS.Digital (always with the dot -- never "FS Digital")
- **Founder name on documents:** Fabio A. Steyer (not full name)
- **Logo:** circular FS mark, cyan/purple gradient, transparent background SVG
- **Brand colours:** Cyan `#00e5ff`, Purple `#7c3aed` / `#a855f7`, Dark `#080b10`

### Legal & compliance checklist (sole trader setup, Ireland)
- [ ] Register business name "FS.Digital" with the CRO at cro.ie -- 20 euro online
- [ ] Register for self-assessment income tax with Revenue at ros.ie
- [ ] Get Professional Indemnity Insurance before first paid client
  (Chill Insurance or AXA -- typically 200-400 euro/year for a solo developer)
- [ ] Contact Local Enterprise Office (LEO) about the Trading Online Voucher
  (up to 2,500 euro for online business costs) at localenterprise.ie
- [ ] Register for VAT if/when annual turnover exceeds 37,500 euro

### Client documents -- ready to use
All four documents are built, branded with the FS.Digital logo (brightened,
transparent background), and Google Docs-compatible (columnWidths fix applied).
Upload to Google Drive for editing and sending to clients.

| Document | Language | File |
|----------|----------|------|
| Proposal Template | English | `FS.Digital_Proposal_Template.docx` |
| Service Agreement | English | `FS.Digital_Service_Agreement.docx` |
| Proposta Comercial | Portuguese (pt-BR) | `FS.Digital_Proposta_Comercial.docx` |
| Contrato de Prestacao de Servicos | Portuguese (pt-BR) | `FS.Digital_Contrato_de_Servicos.docx` |

**Usage flow:**
```
Discovery call -> Proposal (within 24h) -> Client approves ->
Service Agreement -> Deposit paid -> Work starts
```

Payment terms: 50% deposit upfront, 50% on completion.
EN invoices: bank transfer (IBAN). PT invoices: Pix, boleto, or bank transfer.

**EN pricing (euro):**
- Site Institucional / Small business site: 900 - 1,400 euro
- Landing page: from 800 euro
- E-commerce (small/medium): from 1,800 euro
- Monthly hosting basic: 50 euro/month
- Monthly hosting + maintenance: 100 euro/month
- Ad-hoc maintenance: 75 euro/hour

**PT-BR pricing (R$):**
- Site Institucional: R$ 1,500 - R$ 2,500
- Landing page: R$ 800 - R$ 1,500
- E-Commerce (pequeno/medio): R$ 2,800 - R$ 6,000
- Site para Restaurante: R$ 1,500 - R$ 2,200
- Site para Igreja / Comunidade: R$ 1,200 - R$ 1,800
- Hospedagem Basica: R$ 80/mes
- Hospedagem + Manutencao: R$ 150/mes
- Manutencao Avulsa: R$ 80/hora

### Client questionnaires -- ready to use
Two Google Forms for pre-discovery-call intake. Responses feed into linked
Google Sheets automatically. Send link to every new enquiry before the call.

| Form | Language | Status |
|------|----------|--------|
| New Client Questionnaire | English | Live and tested |
| Questionario de Novo Cliente | Portuguese (pt-BR) | In progress |

Each form: 20 questions across 5 sections:
1. About the business
2. Current online presence
3. What they need (features, logo, content, photos)
4. Budget & timeline
5. Final details / how they found us

### Invoicing
- Tool not yet chosen -- options: Invoice Ninja (free) or Bullet (Irish, VAT-aware).
- Keep every receipt for business expenses -- reduces taxable profit.
- Laptop purchased for business use: write off under Revenue Section 32.

### Marketing & outreach -- pending
- [ ] Update LinkedIn profile -- headline, about section, add FS.Digital as
  experience, pin fsteyerdigital.com in Featured section.
- [ ] First LinkedIn post -- show the site or a demo, invite feedback from network.
- [ ] First client outreach -- local businesses in Balbriggan/Dublin.
  Show the relevant demo on your phone. Walk in, talk to the owner.
- [ ] Confirm real WhatsApp number for Brazilian client contact.
- [ ] Complete PT-BR Google Form and test.

---

## 7. Infrastructure operations

### Where things live
| Concern                    | Where                                                        |
|----------------------------|--------------------------------------------------------------|
| Source code                | `donis-digital-claude` repo, `main` branch                   |
| Live deployments           | Cloudflare -> Workers & Pages -> `donis-digital-claude`      |
| DNS                        | Cloudflare -> DNS -> `fsteyerdigital.com`                    |
| Form submissions           | Formspree dashboard, form `xrevpnzj`                         |
| Inbound email              | Cloudflare -> Email Routing                                  |
| Domain renewal             | Blacknight account (set a calendar reminder)                 |
| Client questionnaires      | Google Forms -> linked Google Sheets                         |
| Client documents           | Local .docx files -- upload to Google Drive for use          |

### Common tasks
- **Change copy or styles:** edit locally, `git commit`, `git push`. Redeploys in under a minute.
- **Roll back a bad deploy:** Cloudflare -> Workers & Pages -> Deployments -> earlier deploy -> Rollback.
- **Check form submissions:** Formspree dashboard or `fabiosteyer@gmail.com`.
- **Check questionnaire responses:** Google Sheets linked to each Form.
- **Add a new page:** create `.html`, add to `sitemap.xml`, link from footer or nav.
- **Bump cache-busting strings:** increment `?v=` on CSS/JS in `index.html`.

### Things not to touch without a reason
- MX and TXT records in Cloudflare DNS -- they keep email working.
- The `?v=` cache-busting strings -- bump them, don't delete them.
- The `_next` and `_gotcha` hidden inputs in the contact form -- Formspree relies on them.
- Cloudflare orange-cloud proxying -- leave on for DDoS protection and caching.

---

## 8. Resolved decisions

| Question | Decision |
|----------|----------|
| Keep `netlify.toml`? | Deleted. Cloudflare is the confirmed host. |
| Delete unused SVG/logo files? | Done. All legacy files removed. |
| Fictional businesses disclaimer? | Both main page and each demo footer. Done. |
| Replace service-card emoji with icon set? | Not now. Emoji stay until budget allows. |
| Cloudflare orange-cloud proxying? | Leave on. Free DDoS protection and caching. |
| Analytics? | Plausible when ready. Not until site is actively shown to clients. |
| Contact form solution? | Formspree (xrevpnzj). |
| PT localisation approach? | Path: /pt/. Cleaner SEO than query param. |
| Language memory across visits? | localStorage fs_lang. |
| Brand name? | FS.Digital (with dot, always). |
| Founder name on documents? | Fabio A. Steyer (not full name). |
| Mobile apps / complex web systems? | No. Focus is small/medium businesses only. |
| Hosting model? | Managed by FS.Digital, charged monthly. Client registers own domain. |
| PT pricing? | R$ market-appropriate rates, not direct euro conversion. |
| Document format? | Google Docs-compatible .docx with columnWidths fix for table rendering. |
| Client intake process? | Google Forms (2 forms: EN + PT-BR) -> Google Sheets. |
| Custom 404 on a static-assets Worker? | `wrangler.jsonc` with `assets.not_found_handling: "404-page"`. Pages-style auto-detection doesn't apply to Workers. |
| Website/GitHub links in contact section? | Dropped both. Website link was redundant (already on the site); GitHub isn't relevant to prospective clients. |
| WhatsApp on the EN site? | Yes -- added as a contact-link (not a floating button, that stays PT-only). Real number: +353 87 066 4839. |
| Legal-page and About-section body text alignment? | Justified (`text-align: justify` + `text-align-last: left`) for a cleaner block look. |
| Bare "FS Digital" (no dot) anywhere in copy? | No. Scrubbed from every HTML page and repo doc -- always "FS.Digital". |
| Hosting plans on PT site? | Added -- Básico R$80/mês, Hospedagem + Manutenção R$150/mês, Avulsa R$80/hora, matching EN structure and CSS. |
| EN main page URL: `/donis-digital.html` or `/`? | Swapped to `/` (2026-07-08). The site previously served real content from `/donis-digital.html` with `/` as a meta-refresh stub -- this caused a canonical loop between apex, www, and `/donis-digital.html`, and left `/donis-digital.html` visible in the address bar after every visit. Content now lives in `index.html` at the root; `donis-digital.html` is the noindex redirect stub, kept only so old inbound links/bookmarks still resolve. |
