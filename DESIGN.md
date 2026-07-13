# Design: Senties Chauvet Site Redesign

Practical implementation guide derived from `SPEC.md`. Targets `index.html`, `styles.css`; no changes to `script.js` (anchor scroll already covered by `scroll-behavior: smooth`).

---

## 1. CSS Architecture

**Principle**: extend the existing `:root` token system; never overwrite. The existing build already has clean tokens (`--bg`, `--bg-alt`, `--surface`, `--primary`, `--primary-light`, `--accent`, `--accent-light`, `--text*`, `--text-inverse`, `--radius-*`, `--shadow-*`, `--font-*`, `--max-width`, `--border`) and a `body.dark-theme` override block. New tokens go into `:root` and get mirrored in `body.dark-theme` where theme-sensitive.

### New tokens (add to `:root`)

```css
:root {
  /* ---Existing tokens unchanged, then:
       SAI section background (subtle gradient distinct from flat .levels) */
  --sai-bg: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  --sai-surface: rgba(255, 255, 255, 0.06);        /* panels inside SAI */
  --sai-surface-border: rgba(255, 255, 255, 0.10);

  /* Accent glow for SAI "1 hora" callout */
  --accent-glow: 0 0 0 1px rgba(255, 117, 48, 0.30), 0 4px 24px rgba(255, 117, 48, 0.25);

  /* MEXDC Partner badge pill */
  --badge-mexdc-bg: rgba(0, 43, 73, 0.08);
  --badge-mexdc-bg-hover: rgba(0, 43, 73, 0.14);
  --badge-mexdc-icon-bg: rgba(255, 117, 48, 0.12);

  /* MEXDC logo grid card surface (reuses --surface in light,
     slightly lifted border for white-on-white cards) */
  --mexdc-logo-card-border: 1px solid rgba(0, 0, 0, 0.05);
  --mexdc-logo-card-shadow: var(--shadow-sm);
  --mexdc-logo-card-shadow-hover: 0 8px 20px rgba(0, 0, 0, 0.08);

  /* Section spacing helper */
  --section-pad: 80px 24px;
}
```

### Dark-theme overrides (add inside `body.dark-theme` block)

```css
body.dark-theme {
  --badge-mexdc-bg: rgba(37, 70, 98, 0.18);
  --badge-mexdc-bg-hover: rgba(37, 70, 98, 0.28);
  --mexdc-logo-card-border: 1px solid rgba(255, 255, 255, 0.06);
}
```

### New section visual patterns

| Section | Background | Text | Pattern source |
|---------|-----------|------|----------------|
| `.mexdc-trust` | `var(--bg)` | dark | mirrors `.services` shell (light) |
| `.sai` | `var(--sai-bg)` gradient | `var(--text-inverse)` | new; parallels `.levels` but gradient for visual differentiation |
| `.partners` (renamed) | `var(--bg-alt)` | dark | unchanged from current |

**Why a gradient instead of flat `--primary` for SAI**: `.levels` (section 7) already uses flat `var(--primary)`. Two immediate neighbors showing the same flat navy would read as one continuous block. A 135° gradient `--primary → --primary-light` gives depth and clearly separates SAI from Levels while staying on-brand.

---

## 2. HTML Structure — Section by Section

### 2a. MEXDC Trust Section (NEW) — inserted after Hero, before SAI

```html
<section class="mexdc-trust" id="mexdc-trust" aria-labelledby="mexdc-trust-title">
  <div class="mexdc-trust-inner">
    <div class="section-header">
      <span class="section-label">Credibilidad</span>
      <h2 id="mexdc-trust-title">Miembro del ecosistema MEXDC</h2>
      <p class="section-desc">
        La Asociación Mexicana de Data Centers (MEXDC) reúne a operadores, proveedores
        y profissionais del ecosistema digital en México. Pertenecer al ecosistema es
        una señal de credibilidad verificable públicamente.
      </p>
    </div>

    <div class="mexdc-logo-grid" role="list">
      <div class="mexdc-logo-card" role="listitem">
        <img src="assets/mexdc/logo-equinix.png" alt="Equinix" loading="lazy">
      </div>
      <div class="mexdc-logo-card" role="listitem">
        <img src="assets/mexdc/logo-kio.png" alt="KIO" loading="lazy">
      </div>
      <div class="mexdc-logo-card" role="listitem">
        <img src="assets/mexdc/logo-schneider.png" alt="Schneider Electric" loading="lazy">
      </div>
      <div class="mexdc-logo-card" role="listitem">
        <img src="assets/mexdc/logo-siemens.png" alt="Siemens" loading="lazy">
      </div>
      <div class="mexdc-logo-card" role="listitem">
        <img src="assets/mexdc/logo-microsoft.png" alt="Microsoft" loading="lazy">
      </div>
    </div>

    <a href="https://asmexdc.com/socios-y-asociados/"
       class="mexdc-badge"
       target="_blank"
       rel="noopener">
      <span class="mexdc-badge-icon"><i class="fa-solid fa-circle-check"></i></span>
      <span class="mexdc-badge-text">Partner MEXDC</span>
      <i class="fa-solid fa-arrow-up-right-from-square mexdc-badge-ext" aria-hidden="true"></i>
    </a>
  </div>
</section>
```

### 2b. SAI Section (PROMOTED) — new section between MEXDC Trust and Services

```html
<section class="sai" id="sai" aria-labelledby="sai-title">
  <div class="sai-inner">
    <div class="sai-content">
      <span class="section-label sai-label">Metodología Propia</span>
      <h2 id="sai-title">SAI: El análisis que cambia cómo eligen sus afianzadoras</h2>
      <p class="sai-desc">
        Supplier Analysis es nuestra plataforma propia de análisis financiero y de
        riesgo para proveedores del ecosistema de data centers. Convierte la
        evaluación de un fiado en datos accionables antes de comprometer una fianza.
      </p>

      <ul class="sai-differentiators">
        <li>
          <span class="sai-diff-icon"><i class="fa-solid fa-heart-pulse"></i></span>
          <div>
            <strong>Score de salud</strong>
            <span>Indicador sintético de solvencia del proveedor.</span>
          </div>
        </li>
        <li>
          <span class="sai-diff-icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
          <div>
            <strong>Indicadores de riesgo</strong>
            <span>Alertas tempranas sobre obligaciones y litigios.</span>
          </div>
        </li>
        <li>
          <span class="sai-diff-icon"><i class="fa-solid fa-file-invoice-dollar"></i></span>
          <div>
            <strong>Datos fiscales</strong>
            <span>Cumplimiento y situación ante el SAT.</span>
          </div>
        </li>
        <li>
          <span class="sai-diff-icon"><i class="fa-solid fa-layer-group"></i></span>
          <div>
            <strong>Concentración comercial</strong>
            <span>Dependencia de clientes y proveedores clave.</span>
          </div>
        </li>
      </ul>
    </div>

    <aside class="sai-highlight" aria-label="Resultado SAI">
      <span class="sai-callout-label">Resultado</span>
      <p class="sai-callout">Evaluación en <strong>1 hora</strong>, no en semanas</p>
      <span class="sai-callout-note">Mientras una evaluación manual toma de 2 a 4 semanas, SAI entrega el análisis del fiado en menos de 60 minutos con el expediente completo.</span>
    </aside>
  </div>
</section>
```

### 2c. Services Section (REORGANIZED) — 3 cards, SAI removed

```html
<section id="servicios" class="services">
  <div class="services-inner">
    <div class="section-header">
      <span class="section-label">Servicios</span>
      <h2>Soluciones de afianzamiento para el ecosistema de data centers</h2>
    </div>
    <div class="services-grid">
      <!-- 3 cards only: Emisión, Programas, Gestión jurídica. The SAI card is REMOVED. -->
      <div class="service-card">
        <div class="service-icon"><i class="fa-solid fa-file-signature"></i></div>
        <h3>Emisión y administración de fianzas</h3>
        <p>Fianzas de cumplimiento, anticipo y buena calidad para operadores de data centers y proveedores del ecosistema. Gestión integral desde la solicitud hasta la vigencia.</p>
      </div>
      <div class="service-card">
        <div class="service-icon"><i class="fa-solid fa-building"></i></div>
        <h3>Programas corporativos</h3>
        <p>Programas de afianzamiento a medida para operadores de data centers, proveedores de infraestructura tecnológica, conectividad y empresas del ecosistema digital.</p>
      </div>
      <div class="service-card">
        <div class="service-icon"><i class="fa-solid fa-scale-balanced"></i></div>
        <h3>Gestión jurídica y reclamaciones</h3>
        <p>Equipo legal especializado que acompaña desde la revisión contractual hasta el cobro de reclamaciones. Más de $130 MDP recuperados.</p>
      </div>
    </div>
  </div>
</section>
```

CSS change in `.services-grid`:

```css
.services-grid {
  grid-template-columns: repeat(3, 1fr); /* was repeat(2, 1fr) */
}
```

### 2d. Hero Updates (MODIFIED)

```html
<span class="hero-badge hero-badge--mexdc">
  <i class="fa-solid fa-circle-check hero-badge-check"></i>
  Partner MEXDC · Agente Afianzador Certificado
</span>
<h1>El agente afianzador que entiende el <em>ecosistema MEXDC</em></h1>
<p>Estructuramos programas corporativos de afianzamiento…</p>
<div class="hero-actions">
  <a href="#contacto" class="btn btn-primary">Solicitar fianza <i class="fa-solid fa-arrow-right"></i></a>
  <a href="#sai" class="btn btn-outline">Conocer SAI</a>
</div>
```

Notes:
- `.hero-badge` keeps existing styles; the `--mexdc` modifier adds the inline check icon.
- The H1 italic accent (`em`) keeps the current styling `color: var(--accent)`.
- CTA2 `href` changes from `#servicios` → `#sai`; label from "Ver servicios" → "Conocer SAI"; arrow icon removed to keep it visibly secondary.

### 2e. Afianzadoras Section (RENAMED) — same `.partners` structure, new copy

```html
<section class="partners" id="afianzadoras" aria-labelledby="afianzadoras-title">
  <div class="partners-inner">
    <span class="section-label">Respaldo</span>
    <h2 id="afianzadoras-title">Respaldados por las principales afianzadoras de México</h2>
    <p>Las fianzas que emitimos cuentan con el respaldo de aseguradoras autorizadas por la CNSF. Emisoras, no operadoras: son las que asumen el riesgo afianzador.</p>
    <div class="partners-list">
      <!-- 11 spans unchanged -->
    </div>
  </div>
</section>
```

### 2f. Footer (MODIFIED)

```html
<footer class="footer">
  <div class="footer-inner">
    <p>&copy; 2026 Senties Chauvet · Fianzas y Garantías. Todos los derechos reservados.</p>
    <p class="footer-note">
      Agente afianzador certificado.
      <a href="https://asmexdc.com/socios-y-asociados/"
         target="_blank" rel="noopener">Miembro de MEXDC · asmexdc.com</a>.
      Fianzas respaldadas por compañías autorizadas por la CNSF.
    </p>
  </div>
</footer>
```

Add `--accent` link styling inside `.footer-note` so the MEXDC link stands out while staying understated.

### Header nav (MODIFIED)

Nav links become: `SAI` (`#sai`), `Servicios` (`#servicios`), `Niveles` (`#niveles`), `Contacto` (`#contacto`). Mobile menu mirrors the same set.

---

## 3. Responsive Strategy

| Section | Desktop (≥769px) | Mobile (≤768px) |
|---------|-----------------|-----------------|
| MEXDC logo grid | 5-col grid `repeat(5, 1fr)`, fixed-height logo cards | horizontal scroll, cards `minmax(140px, auto)`, `overflow-x: auto`, hide scrollbar |
| SAI section | 2-col grid `1.2fr 1fr` (content \| highlight) | single column, highlight stacks BELOW content |
| Services | 3-col `repeat(3, 1fr)` | single column (existing behavior) |
| Hero | existing grid `1fr 400px` | existing single-column behavior unchanged |
| Afianzadoras | existing centered flex-wrap | existing centered flex-wrap unchanged |
| Footer | centered single block | unchanged |

Breakpoint stays at the existing `768px` and `480px` pair to avoid introducing a new one.

### Mobile scroll-snap for MEXDC logos

```css
@media (max-width: 768px) {
  .mexdc-logo-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 12px;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
  }
  .mexdc-logo-card {
    flex: 0 0 140px;
    scroll-snap-align: start;
  }
  /* hide scrollbar but keep functional */
  .mexdc-logo-grid::-webkit-scrollbar { display: none; }
  .mexdc-logo-grid { scrollbar-width: none; }

  .sai-inner { grid-template-columns: 1fr; }
  .sai-highlight { order: 2; }
}
```

---

## 4. CSS Snippet Examples — Key New Patterns

### MEXDC logo grid (desktop)

```css
.mexdc-trust { padding: var(--section-pad); }
.mexdc-trust-inner { max-width: var(--max-width); margin: 0 auto; text-align: center; }

.mexdc-logo-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin: 40px 0 32px;
}
.mexdc-logo-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: var(--mexdc-logo-card-border);
  border-radius: var(--radius-md);
  padding: 24px 16px;
  height: 96px;
  box-shadow: var(--mexdc-logo-card-shadow);
  transition: transform 0.25s, box-shadow 0.25s;
}
.mexdc-logo-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--mexdc-logo-card-shadow-hover);
}
.mexdc-logo-card img {
  max-height: 48px;
  max-width: 100%;
  width: auto;
  object-fit: contain;
  filter: grayscale(0.4);
  opacity: 0.85;
  transition: filter 0.25s, opacity 0.25s;
}
.mexdc-logo-card:hover img { filter: grayscale(0); opacity: 1; }
```

### MEXDC Partner badge (pill with check icon + link)

```css
.mexdc-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--badge-mexdc-bg);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  transition: background 0.2s, transform 0.2s;
}
.mexdc-badge:hover {
  background: var(--badge-mexdc-bg-hover);
  transform: translateY(-1px);
}
.mexdc-badge-icon {
  display: inline-flex;
  width: 22px; height: 22px;
  align-items: center; justify-content: center;
  background: var(--badge-mexdc-icon-bg);
  color: var(--accent);
  border-radius: 50%;
  font-size: 0.7rem;
}
.mexdc-badge-ext { font-size: 0.65rem; opacity: 0.55; }
```

### SAI section (light text on gradient)

```css
.sai {
  padding: var(--section-pad);
  background: var(--sai-bg);
  color: var(--text-inverse);
}
.sai-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 56px;
  align-items: center;
}
.sai .sai-label,
.sai .section-label { color: rgba(255, 255, 255, 0.7); }
.sai h2 { color: #fff; margin-bottom: 16px; }
.sai-desc { color: rgba(255, 255, 255, 0.75); font-size: 1.05rem; }

.sai-differentiators {
  list-style: none;
  margin: 32px 0 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
.sai-differentiators li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.sai-differentiators strong { color: #fff; display: block; font-size: 0.95rem; }
.sai-differentiators span { color: rgba(255, 255, 255, 0.6); font-size: 0.85rem; }
.sai-diff-icon {
  width: 36px; height: 36px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--sai-surface);
  border: 1px solid var(--sai-surface-border);
  border-radius: var(--radius-sm);
  color: var(--accent);
  flex-shrink: 0;
}

/* The "1 hora" callout */
.sai-highlight {
  background: var(--sai-surface);
  border: 1px solid var(--sai-surface-border);
  border-radius: var(--radius-lg);
  padding: 40px 32px;
  text-align: center;
}
.sai-callout-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}
.sai-callout {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  line-height: 1.2;
  color: #fff;
  margin-bottom: 16px;
}
.sai-callout strong { color: var(--accent); font-weight: 500; }
.sai-callout-note {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.85rem;
}

/* Highlight accent halo on hover for the callout block */
.sai-highlight:hover .sai-callout strong {
  text-shadow: var(--accent-glow);
}
```

### Hero badge with check icon

```css
.hero-badge--mexdc {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.hero-badge-check { color: var(--accent); font-size: 0.85rem; }
```

### Footer MEXDC link

```css
.footer-note a {
  color: var(--accent);
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: rgba(255, 117, 48, 0.4);
  text-underline-offset: 2px;
}
.footer-note a:hover { text-decoration-color: var(--accent); }
```

### Services grid 3-col

```css
.services-grid {
  grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 768px) {
  .services-grid { grid-template-columns: 1fr; }
}
```

---

## 5. Assets to Download

All five MEXDC member logos must be obtained from the public MEXDC site or each brand's official press/brand asset page. Save into a new `assets/mexdc/` directory with the exact filenames referenced above.

| File | Brand | Source priority |
|------|-------|-----------------|
| `assets/mexdc/logo-equinix.png` | Equinix | MEXDC member listing or brand.equinix.com |
| `assets/mexdc/logo-kio.png` | KIO | MEXDC member listing |
| `assets/mexdc/logo-schneider.png` | Schneider Electric | MEXDC member listing or se.com brand |
| `assets/mexdc/logo-siemens.png` | Siemens | MEXDC member listing or siemens brand portal |
| `assets/mexdc/logo-microsoft.png` | Microsoft | MEXDC member listing or Microsoft Brand Central |

Constraints:
- PNG or SVG (preferred SVG for crispness; consistent extension across all 5).
- Transparent background.
- Honor each brand's "do not recolor" guideline — use the `grayscale(0.4)` idle / `grayscale(0)` hover filter from the snippet, not mono recolors.
- Resize to a max-height of ~48px in the card before committing.

Existing assets kept unchanged:
- `assets/logo-senties.png`
- `assets/header-photo-2.jpg`

No new JS dependencies. Font Awesome `fa-circle-check` is already available via the existing CDN bundle in `<head>`.

---

## 6. Document Order Summary (new `index.html` flow)

```
header
hero              (modified)
mexdc-trust       (NEW)
sai               (NEW — promoted from a service card)
services          (3 cards, SAI removed)
partners          (renamed: Afianzadoras)
levels            (kept)
contact           (kept)
footer            (modified)
```

## 7. Open Questions

- [ ] Confirm the exact logo asset format the MEXDC public site exposes (PNG vs SVG) — affects whether the grayscale filter needs adjustment for color SVGs.
- [ ] Confirm copy wording for the MEXDC Trust descriptive paragraph (placeholder above; SPEC calls for "texto breve explicando qué es MEXDC" without prescribing exact wording).
- [ ] Decide whether `#sai` CTA should also collapse the mobile menu — current `script.js` already closes the menu on any in-menu `a` click, but the hero CTA sits outside the menu so no script change is required.