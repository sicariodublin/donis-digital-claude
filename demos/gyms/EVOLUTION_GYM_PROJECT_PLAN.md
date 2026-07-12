# Evolution Gym — Project Plan

Website for Evolution Gym, a fitness chain with 3 units in Itapema, SC, Brazil.
Built by FS.Digital (fsteyerdigital.com) as a client project.

**Client:** Joao Pedro
**Client email:** fabioast47@hotmail.com
**Client phone / WhatsApp:** +47 98955 2450 (same number for all 3 units)
**Business:** Evolution Gym — Saude & Bem-estar
**CNPJ:** 42.198.637/0001-19
**Target domain:** evolutiongym.com.br (client to register at Registro.br)
**Developer:** Fabio A. Steyer — FS.Digital
**Dev WhatsApp:** +353 87 066 4839
**Dev email:** hello@fsteyerdigital.com

---

## 1. Stack

| Layer   | Choice                                                          |
|---------|-----------------------------------------------------------------|
| Markup  | Plain HTML5, no framework, no build step                        |
| Styles  | Hand-written CSS, custom properties, mobile-first               |
| Scripts | Vanilla JS, defer-loaded                                        |
| Fonts   | Google Fonts — Bebas Neue (display), Barlow Condensed (labels), Inter (body) |
| Images  | Client photos (pending) + logo.png (provided)                   |
| Hosting | Cloudflare Pages — under FS.Digital account until domain is ready |
| Forms   | WhatsApp links (wa.me) — no server-side form needed             |

---

## 2. Repository layout

```
evolution-gym/
  index.html            Main single-page site
  style.css             All styles (source)
  style.min.css         Minified — this is what index.html loads
  script.js             Navbar scroll, hamburger, scroll reveal, smooth scroll (source)
  script.min.js         Minified — this is what index.html loads
  logo-transparent.png  Evolution Gym logo (used in navbar + footer)
  favicon.ico / favicon-512.png / apple-touch-icon.png
  og-image.jpg          1200x630 social share image (OG + Twitter Card)
  robots.txt / sitemap.xml
  *.webp                Client photos, in use across the site
  _source/               NOT deployed — original logo files, unused raw
                          photos (1-8*.png), and client proposal docs.
                          Kept for reference, excluded from Cloudflare Pages.
```

All files are separated (no inline styles or scripts in HTML).
When editing styles/behavior, edit `style.css` / `script.js` and re-run
the minifier (`npx terser script.js -c -m -o script.min.js`,
`npx clean-css-cli -o style.min.css style.css`) before deploying.

---

## 3. Design system

| Token         | Value           | Usage                          |
|---------------|-----------------|--------------------------------|
| --navy        | #0a0e1a         | Main background                |
| --navy-mid    | #0f1628         | Section alternating background |
| --navy-card   | #131c30         | Card backgrounds               |
| --navy-light  | #1a2540         | Placeholder image backgrounds  |
| --cyan        | #00d4ff         | Primary accent, CTA borders    |
| --cyan-dim    | #00aacc         | Hover states                   |
| --green       | #3ddc84         | Secondary accent, checkmarks   |
| --yellow      | #f5c842         | Plan badges and buttons        |
| --white       | #ffffff         | Headlines                      |
| --off-white   | #e8eaf0         | Body text                      |
| --muted       | #8896b0         | Secondary text, labels         |
| --border      | rgba(255,255,255,0.07) | Card and divider borders |

**Fonts:**
- Display / headings: Bebas Neue
- Section labels / buttons / nav: Barlow Condensed
- Body / paragraphs: Inter

---

## 4. Page structure (single page)

| Section           | ID            | Status        |
|-------------------|---------------|---------------|
| Navbar            | —             | Done          |
| Hero              | #home         | Done          |
| Venha Para (Plans)| #matricule    | Done          |
| Estrutura         | #estrutura    | Done (placeholders) |
| Modalidades       | #modalidades  | Done (placeholders) |
| Sobre Nos         | #sobre        | Done (placeholder)  |
| Encontrar Academia| #unidades     | Done          |
| Footer            | —             | Done          |
| WhatsApp Float    | —             | Done          |

### Navbar
- Logo (logo.png, 52px height)
- Links: Matricule-se (cyan CTA border), Sobre Nos, Encontrar Academia
- Scrolled state: dark glass background + blur
- Mobile: hamburger menu, full-width dropdown

### Hero
- Dark navy background with cyan + green radial gradients
- Giant Bebas Neue title: "Sua Evolucao Comeca Aqui"
- Eyebrow: "3 Unidades em Itapema SC"
- Sub: "Spinning · Musculacao · Funcional"
- CTAs: Matricule-se Agora (gradient) + Encontrar Academia (ghost)
- Unit finder buttons: Centro / Meia Praia / Morretes (smooth scroll to each)
- Hero background: currently CSS gradient — replace with real photo when client provides one

### Plans (Venha Para)
Four plan cards:
| Plan             | Type       | Price/installment | Total         |
|------------------|------------|-------------------|---------------|
| Mensal Start     | 1x a vista | R$230,00          | R$230,00      |
| Trimestral Start | 3x         | R$215,00          | R$645,00      |
| Semestral Start  | 6x         | R$190,00          | R$1.140,00    |
| Anual Start      | 12x        | R$175,00          | R$2.100,00    |

All plans include: Acompanhamento em sala, Aulas Coletivas, Treinos novos sem custo
Taxa de Matricula: R$99,00 on all plans

Each EU QUERO button links to WhatsApp with pre-filled message per plan.
Trimestral marked as "Mais Popular", Anual marked as "Melhor Valor".

### Estrutura (4 cards)
- Area de Musculacao
- Sala de Aulas Coletivas
- Vestiarios e Banheiros
- Recepcao

Each card: placeholder-img div (dashed border, dark bg) + text below.
Replace placeholder divs with <img> tags when client provides photos.

### Modalidades (3 cards)
- Spinning — tags: Cardio, Resistencia, Todos os niveis
- Musculacao (featured card, cyan border) — tags: Forca, Hipertrofia, Emagrecimento
- Funcional — tags: Condicionamento, Equilibrio, Alta intensidade

### Sobre Nos
- Two-column layout: photo (left) + content (right)
- Stats: 3 Unidades / 800+ Alunos Ativos / 3 Modalidades
- Photo: placeholder — replace when client provides image

### Encontrar Academia (3 unit cards)
| #  | Name        | Address                                      | CEP       |
|----|-------------|----------------------------------------------|-----------|
| 01 | Centro      | Av. Nereu Ramos, 690, Centro                 | 88220-000 |
| 02 | Meia Praia  | Av. Beira Mar, 7156, Orla Meia Praia         | 88220-000 |
| 03 | Morretes    | Rua 406 B, 250, Morretes                     | 88220-000 |

Each card: WhatsApp button + Google Maps link (pre-built search URL).
WhatsApp links pre-fill unit-specific messages.

### Footer (3 columns)
- Col 1: logo, tagline, phone/WhatsApp
  (social icons removed for launch — client hasn't created profiles yet;
  re-add once real Facebook/Instagram/X URLs exist, see Section 5)
- Col 2: A Academia (Sobre Nos, Modalidades, Estrutura, Encontrar Academia)
- Col 3: Planos (all 4 plan names, link to #matricule)
- Bottom bar: copyright, CNPJ 42.198.637/0001-19, FS.Digital credit link

Note: the old 4th column (Politica de Privacidade, Promocoes, Regulamentos)
was removed rather than shipped as dead `#` links — add it back once those
pages exist (see Section 5 / Section 9 Future).

### WhatsApp floating button
- Fixed bottom-right, 58px circle, #25D366 green
- Links to wa.me/5547989552450 with pre-filled message
- Hover: scale(1.1) + stronger shadow
- Always visible on all scroll positions

---

## 5. Pending items (awaiting client)

- [x] **Estrutura photos (4 images)** — done, `<img>` tags in place
      (musculacao.webp, sala-aulas.webp, vestiarios.webp, recepcao.webp)
- [x] **Modalidades photos (3 images)** — done (spinning.webp,
      musculacao-aula.webp, funcional.webp)
- [x] **Sobre Nos photo (1 image)** — done (sobre-nos.webp)

- [x] **Hero background photo** — done (2026-07-11). `hero-bg.webp` (converted
      from client-supplied `Background.png`, kept in `_source/hero-bg-source.png`)
      is a full hero graphic with the headline/eyebrow/subtext baked into the
      image itself, not a plain background plate. Because of that, the
      previously-visible `.hero-eyebrow` / `.hero-title` / `.hero-sub` markup
      was replaced with a single visually-hidden (`.sr-only`) `<h1>` carrying
      the same copy, so the page keeps one real heading for SEO/screen
      readers without duplicating the text on screen.
      It's rendered as a real in-flow `<img class="hero-bg-img">` (not a CSS
      background) at the top of `.hero`, full-bleed width with `height: auto`
      — so it always shows at its true 1717:916 aspect ratio and is never
      cropped by the viewport, at any width. `.hero-content` (the sr-only h1
      + CTA buttons) and `.hero-unit-finder` sit after it in normal document
      flow rather than being vertically centered over the image, which is
      what a `min-height: 100vh` + `justify-content: center` approach was
      doing before this fix — that setup vertically centered the button
      group independently of where the image's own baked-in text sat,
      so the CTAs ended up floating on top of "Começa Aqui" instead of below
      it. Verified with Playwright screenshots at 1440px, 390px, and 430px
      after actually rebuilding `style.min.css` (the source `style.css` edit
      alone doesn't affect the live page — `index.html` loads the minified
      file; re-run `npx clean-css-cli -o style.min.css style.css` after any
      style.css change).

- [ ] **Social media profile URLs**
      Social icons were removed from the footer for launch (no dead `#`
      links). When client creates profiles, re-add the Facebook/Instagram/X
      SVG icon links to `.footer-brand` in index.html with real URLs, and
      restore the `.footer-social`/`.social-link` rules in style.css.

- [ ] **Privacy policy, Promocoes, Regulamentos pages**
      The 4th footer column (Politica de Privacidade, Promocoes,
      Regulamentos) was removed for launch rather than shipped as dead `#`
      links. Re-add the column (and adjust `.footer-grid` back to
      `grid-template-columns: 2fr 1fr 1fr 1fr`) once these pages exist.

- [ ] **og-image.jpg refresh** — currently a crop of the placeholder
      "8-Foto Evolution Gym.png" (kept in `_source/`). Swap for a proper
      1200x630 hero/brand photo once client provides final photography.

- [ ] **Domain DNS configuration**
      Once client registers evolutiongym.com.br at Registro.br:
      Point domain DNS to Cloudflare Pages deployment URL.

---

## 6. JavaScript features

- **Navbar scroll:** adds `.scrolled` class after 40px scroll
  (dark glass background + backdrop-filter blur)
- **Hamburger menu:** toggles `.open` on nav-links, closes on link click
- **Scroll reveal:** IntersectionObserver on all cards + section headers
  (fade up from 28px, threshold 0.12)
- **Smooth scroll:** all `a[href^="#"]` links, 80px offset for navbar height
- **Reduced motion:** CSS `prefers-reduced-motion` disables animations

---

## 7. WhatsApp links reference

All links use format: `https://wa.me/5547989552450?text=[encoded message]`

| Location              | Pre-filled message                                      |
|-----------------------|---------------------------------------------------------|
| Float button          | Ola! Vi o site da Evolution Gym e gostaria de mais informacoes. |
| Mensal Start button   | Ola! Tenho interesse no Plano Mensal Start da Evolution Gym. |
| Trimestral Start      | Ola! Tenho interesse no Plano Trimestral Start da Evolution Gym. |
| Semestral Start       | Ola! Tenho interesse no Plano Semestral Start da Evolution Gym. |
| Anual Start           | Ola! Tenho interesse no Plano Anual Start da Evolution Gym. |
| Unit Centro           | Ola! Gostaria de saber mais sobre a unidade Centro da Evolution Gym. |
| Unit Meia Praia       | Ola! Gostaria de saber mais sobre a unidade Meia Praia da Evolution Gym. |
| Unit Morretes         | Ola! Gostaria de saber mais sobre a unidade Morretes da Evolution Gym. |

---

## 8. Deployment

Site will be deployed to Cloudflare Pages under the FS.Digital account.

Steps when ready:
1. Create new Cloudflare Pages project — connect to GitHub repo
   OR upload files directly via Cloudflare Pages dashboard
2. Set custom domain to evolutiongym.com.br once client registers it
3. Cloudflare will handle SSL automatically

Hosting plan agreed with client: R$150/month (Hospedagem + Manutencao)
This covers: hosting, SSL, monthly backup, uptime monitoring, up to 1h content
updates per month, WhatsApp support.

---

## 9. Roadmap

### Immediate
- [x] Review index.html, style.css, script.js locally — confirm all sections render
- [x] SEO/launch hygiene pass (see Section 11 below): favicon, robots.txt,
      sitemap.xml, OG/Twitter tags, ExerciseGym JSON-LD, dead `#` links
      resolved, unreferenced source files moved out of the deploy root,
      CSS/JS minified
- [ ] Deploy to Cloudflare Pages with temporary URL for client preview
      (deploy only the repo root minus `_source/` — see Section 11)
- [ ] Send preview URL to Joao Pedro via WhatsApp for first review

### On receipt of remaining client photos
- [x] Estrutura, Modalidades, Sobre Nos photos — already replaced with real images
- [x] Update hero background from CSS gradient to real photo (done 2026-07-11)
- [ ] Replace `og-image.jpg` with a proper 1200x630 crop of final photography

### On client approval
- [ ] Collect second payment (R$1.250,00 saldo)
- [ ] Configure DNS once client registers evolutiongym.com.br
- [ ] Update social media links once client creates profiles
- [x] Add to FS.Digital demos section on fsteyerdigital.com (2026-07-12) --
  4th card in the `#demos` grid on both `index.html` and `pt/index.html`,
  linking to `/demos/gyms/`. Same tag/note pattern as the other three cards.
- [x] Take WebP screenshot for FS.Digital demo preview card (600x338px)
  (2026-07-12) -- `demos/gyms/preview.webp`, hero section, same crop
  convention as the other three demo previews.

### Future (client-requested additions)
- [ ] Privacy policy page
- [ ] Promocoes page
- [ ] Regulamentos page

---

## 10. SEO / launch hygiene (2026-07-10)

Implemented from a pre-launch audit:

- **Favicon** — `favicon.ico` (16/32/48/64) + `favicon-512.png` +
  `apple-touch-icon.png`, generated from `logo-transparent.png` padded onto
  a square navy (#0a0e1a) canvas. Regenerate from the same source if the
  logo changes.
- **robots.txt / sitemap.xml** — allow-all, single URL
  (`https://evolutiongym.com.br/`) since this is a one-page site.
- **Open Graph + Twitter Card** — `og-image.jpg` (1200x630) is a crop of
  the old `8-Foto Evolution Gym.png` placeholder photo; swap it for real
  brand photography when available (see Section 5).
- **JSON-LD** — one `ExerciseGym` entity per unit (Centro, Meia Praia,
  Morretes) in a single `@graph` block in `index.html`'s `<head>`.
  `openingHours` was intentionally omitted — not specified anywhere in
  this plan, and inventing hours would be inaccurate. Add it once the
  client confirms real hours per unit.
- **Dead `#` links removed** — footer social icons and the
  Privacy/Promocoes/Regulamentos column were removed rather than shipped
  as non-functional links. See Section 5 for how to reintroduce them.
- **Deploy root cleanup** — `_source/` now holds the original
  (non-web-optimised) logo files, the 8 raw numbered photos superseded by
  the `.webp` versions, and the two client proposal docs (`.docx`/`.pdf`).
  None of this was ever referenced by the site; keep it out of whatever
  gets pushed to Cloudflare Pages.
- **Minification** — `style.min.css` / `script.min.js` are what
  `index.html` actually loads. Source files (`style.css`, `script.js`)
  remain the ones to edit; re-minify before each deploy (commands in
  Section 2).

---

## 11. Resolved decisions

| Question | Decision |
|----------|----------|
| Single page or multi-page? | Single page (all sections on one HTML file) |
| Payment online? | No — WhatsApp only, no payment gateway needed |
| Contact form? | No form — WhatsApp links with pre-filled messages |
| Login / member portal? | Not in scope for this project |
| Mobile app? | Not in scope |
| Colour palette? | Dark navy + cyan + green matching logo |
| Display font? | Bebas Neue — energetic, fits gym brand |
| Social icons? | SVG inline — no external icon library dependency |
| WhatsApp number? | 5547989552450 (same for all 3 units) |
| Indexing while hosted under fsteyerdigital.com/demos/gyms/? | `<meta name="robots" content="noindex,follow">` added -- `canonical` still points to `evolutiongym.com.br` (the eventual real domain), so this temporary path doesn't compete with it in search results. Remove the noindex tag once the client's own domain is live and this page is retired to a pure preview link. |
| Hero background? | Real photo with headline baked in (`hero-bg.webp`), gradient kept as fallback layer only |
| Placeholder images? | Dashed-border divs — easy to swap with real img tags |
| FS.Digital credit? | Yes — small link in footer bottom bar |
