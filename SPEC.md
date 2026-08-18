# Spec: Senties Chauvet — Sitio Público

> **Estado**: describe el sitio tal como está publicado, a 2026-08-18.
> **Fuente de verdad**: `index.html`, `styles.css`, `script.js`. Si este documento
> y el código difieren, gana el código y este documento está en deuda.
> El plan del rediseño original quedó archivado en `TASKS.md`.

---

## Purpose

Sitio estático vanilla HTML/CSS/JS para Senties Chauvet, agente afianzador.
El posicionamiento comercial apunta al ecosistema de data centers en México y
promueve SAI (Supplier Analysis) como metodología propia. La membresía en MEXDC
se presenta como credencial verificable, **no** como origen de las cifras de
trayectoria de la firma.

Sin build step, sin framework, sin dependencias de runtime salvo Font Awesome y
Google Fonts por CDN.

---

## Site Structure

Orden real de `<section>` dentro de `<main class="page">`:

| # | Sección | `id` | Clases | Notas |
|---|---------|------|--------|-------|
| 1 | Hero | — | `panel panel--media` | Video ambiental de fondo |
| 2 | Credibilidad | `credibilidad` | `panel credibility` | 3 cifras acumuladas + enlace MEXDC |
| 3 | SAI | `sai` | `panel panel--dark sai` | Metodología propia |
| 4 | Servicios | `servicios` | `panel services` | 3 tarjetas |
| 5 | Afianzadoras | — | `panel partners` | Marquee de 11 logos |
| 6 | Contacto | `contacto` | `panel panel--dark contact` | 4 canales |

Fuera de `<main>`: `<header>` fijo, `<div class="mobile-menu">`, `<footer>` y un
botón flotante de WhatsApp.

**Ritmo visual**: los paneles oscuros (`panel--dark`) son SAI y Contacto. Ese
alternado es intencional — Contacto cierra la página con el mismo peso con el
que SAI la ancla a la mitad.

---

## Requirements

### REQ-NAV: Navegación

Los enlaces del nav de escritorio y del menú móvil deben ser idénticos y apuntar
únicamente a secciones existentes: `#sai`, `#servicios`, `#contacto`.

#### Scenario: Todo ancla resuelve
- GIVEN el visitante hace clic en cualquier enlace del nav
- WHEN el destino es un `href="#..."`
- THEN existe un elemento con ese `id` en el documento
- AND la página hace scroll suave (vía `scroll-behavior: smooth`, sin JS)

#### Scenario: El menú móvil se cierra al navegar
- GIVEN el menú móvil está abierto
- WHEN el visitante hace clic en cualquier enlace interno o presiona `Escape`
- THEN el menú se cierra y el foco regresa al botón que lo abrió

---

### REQ-HERO: Hero

**Badge**: "Partner MEXDC · Agente Afianzador Certificado" con `fa-circle-check`.
Es un sello de credencial, no un enlace.
**H1**: "El agente afianzador que entiende el ecosistema MEXDC" — "ecosistema
MEXDC" en `<em>` con color accent.
**CTAs**: "Solicitar fianza" (primary, a `#contacto`) y "Conocer SAI" (ghost, a `#sai`).
**Glass stat**: `$57,200 MDP` — "Monto afianzado en 2025".
**Fondo**: `assets/senties-hero.mp4`, en bucle, silenciado, sin controles.

#### Scenario: La cifra del hero declara su periodo
- GIVEN el visitante ve el glass stat del hero
- WHEN lee la etiqueta
- THEN dice explícitamente "en 2025"
- AND esa cifra no aparece en ninguna otra parte del sitio

#### Scenario: El video no consume CPU fuera de pantalla
- GIVEN el visitante hace scroll más allá del hero
- WHEN el hero sale del viewport
- THEN el video se pausa, y se reanuda al volver

---

### REQ-CREDIBILIDAD: Trayectoria

Sección que presenta la trayectoria acumulada de la firma.

**Section label**: "Credibilidad"
**H2**: "Nuestra trayectoria completa como agente afianzador"
**Copy**: debe declarar que las cifras son acumuladas de toda la operación, en
todos los sectores, y que **no** se derivan de la membresía MEXDC ni se limitan
al ecosistema de data centers.
**Cifras** (grid de 3):

| Valor | Etiqueta |
|-------|----------|
| `+19,500` | Fianzas emitidas en total |
| `+200` | Programas corporativos |
| `+$130 MDP` | Recuperados en reclamaciones |

**Enlace**: pill "Ir a MEXDC →" a `https://asmexdc.com/socios-y-asociados/`,
en la misma pestaña.

#### Scenario: Ninguna cifra se atribuye a MEXDC
- GIVEN el visitante lee la sección Credibilidad
- WHEN interpreta las cifras
- THEN el encabezado y el copy las presentan como trayectoria total de la firma
- AND la membresía MEXDC aparece descrita como credencial independiente

#### Scenario: Cifras anuales y acumuladas no se mezclan
- GIVEN una cifra corresponde a un solo ejercicio
- WHEN se coloca en el sitio
- THEN va etiquetada con su periodo y **no** dentro del bloque de acumulados

---

### REQ-SAI: Sección SAI

**Section label**: "Metodología Propia"
**H2**: "SAI: el análisis que cambia cómo eligen sus afianzadoras"
**Diferenciadores** (4, con ícono): score de salud, indicadores de riesgo, datos
fiscales, concentración comercial.
**Callout**: bloque destacado sobre fondo translúcido, con acento naranja.

Panel oscuro: todo elemento hijo que defina color o fondo con tokens de tema
necesita override explícito bajo `.panel--dark` (ver REQ-THEME).

---

### REQ-SERVICES: Servicios

Exactamente 3 tarjetas, sin tarjeta de SAI (SAI tiene sección propia):

1. Emisión y administración de fianzas
2. Programas corporativos
3. Gestión jurídica y reclamaciones

Grid de 3 columnas en escritorio, 1 columna a ≤1024px.

---

### REQ-PARTNERS: Afianzadoras aliadas

**H2**: "Respaldados por las principales afianzadoras de México"
**Rail**: marquee horizontal continuo con 11 logos — Berkley, Dorama, Tokio
Marine, Insurgentes, Avanza Fianzas, Chubb, Mapfre, Atlas, Sofimex, Aserta, AVLA.

El markup lleva **un solo** `.logo-marquee-track`; `script.js` clona copias hasta
cubrir el ancho visible al menos dos veces. Un logo se agrega en un solo lugar.

#### Scenario: El rail no muestra huecos
- GIVEN el viewport es más ancho que el track original
- WHEN el marquee se inicializa
- THEN se clonan tracks hasta cubrir el doble del ancho visible

#### Scenario: Se respeta reduced-motion
- GIVEN el sistema declara `prefers-reduced-motion: reduce`
- WHEN carga la página
- THEN la animación del marquee no se ejecuta

---

### REQ-CONTACT: Contacto

Panel oscuro. **H2**: "Hablemos de tu proyecto".
**Copy**: "Cuéntanos sobre tu operación o proyecto. Nos pondremos en contacto lo antes posible."
**Canales** (grid de 2): teléfono, email, WhatsApp, LinkedIn.

El sitio **no** promete tiempos de respuesta en ninguna parte. Si se reintroduce
un SLA, debe existir una sección que lo sostenga.

---

### REQ-THEME: Tema claro / oscuro

El tema se controla con la clase `dark-theme` sobre `<body>`:

- Al cargar, `script.js` lee `localStorage`; si no hay preferencia guardada, usa
  `prefers-color-scheme`.
- El botón `#themeToggle` alterna y persiste la elección.

`:root` define la paleta clara completa; `body.dark-theme` redefine 19 tokens.

#### Scenario: Un componente entra a un panel oscuro
- GIVEN un componente define `color` o `background` con tokens de tema
- WHEN se coloca dentro de `.panel--dark`
- THEN necesita override explícito bajo `.panel--dark`
- BECAUSE los tokens siguen el tema claro/oscuro, no el panel

---

## Design Tokens

Valores reales de `:root` (tema claro). `body.dark-theme` redefine un subconjunto.

| Token | Valor | Uso |
|-------|-------|-----|
| `--canvas` | `#ebe5db` | Fondo del shell, detrás de los paneles |
| `--surface` | `#ffffff` | Superficie de tarjetas |
| `--surface-sunken` | `#f5f2ec` | Tarjetas sobre panel claro |
| `--primary` | `#002B49` | Azul de marca |
| `--accent` | `#FF7530` | Naranja de marca |
| `--accent-light` | `#FF9A66` | Acento sobre fondo oscuro — **no** se redefine en dark |
| `--text` | `#14212b` | Texto principal |
| `--text-secondary` | `#5b6672` | Texto de apoyo |
| `--text-tertiary` | `#8b959e` | Etiquetas de cifras |
| `--panel-dark-bg` | `linear-gradient(140deg, …)` | Gradiente navy de `panel--dark` |
| `--radius-panel` | `32px` | Redondeo de panel flotante (24px a ≤768px) |
| `--max-width` | `1180px` | Ancho de `.panel-inner` |

**Tipografía** — sistema IBM Plex, cargado desde Google Fonts:

| Token | Familia |
|-------|---------|
| `--font-display` | `'IBM Plex Serif', Georgia, serif` |
| `--font-body` | `'IBM Plex Sans', system-ui, sans-serif` |
| `--font-ui` | `'IBM Plex Sans', system-ui, sans-serif` |

Tokens definidos pero sin uso actual: `--border-strong`, `--invert`,
`--radius-sm`, `--shadow-lg`.

---

## Breakpoints

| Media query | Efecto principal |
|-------------|------------------|
| `≤1024px` | SAI a 1 columna, servicios a 1 columna, glass stat reposicionado |
| `≤768px` | Nav oculto y menú móvil activo, cifras apiladas, contacto a 1 columna |
| `≤480px` | CTAs del hero a ancho completo |
| `(hover: none)` | Los logos no dependen de hover: se muestran a color |
| `prefers-reduced-motion` | Marquee y transiciones desactivados |

**Regla**: cambiar la cantidad de `.figure` obliga a revisar los tres
breakpoints de ancho. Un grid de N columnas con N−1 elementos deja una celda
huérfana que solo se ve en tablet.

---

## Assets

Todos en `assets/`. Verificados presentes:

| Asset | Uso |
|-------|-----|
| `senties-hero.mp4` | Video de fondo del hero (ignorado en git, ver `.gitignore`) |
| `logo-senties.png` | Header y footer |
| `logo-lazaro-cruz-768x610.png` | Footer |
| `favicon-32.png`, `cropped-Fav-icon-180x180.jpg` | Íconos |
| 11 logos de afianzadoras | Rail de partners |

`sofimex.png` y `avla-logo.svg` son marcas blancas sobre transparente: llevan
`.logo-card--invert` para que se lean sobre tarjeta clara.

**Íconos**: Font Awesome 6 por CDN. Todo `<i>` decorativo lleva `aria-hidden="true"`.

---

## Key Copy Points

- Posicionamiento: agente afianzador para el ecosistema de data centers
- H1: "El agente afianzador que entiende el ecosistema MEXDC"
- SAI: "el análisis que cambia cómo eligen sus afianzadoras"
- Afianzadoras: "Respaldados por las principales afianzadoras de México"
- Credibilidad: "Nuestra trayectoria completa como agente afianzador"
- Contacto: "Hablemos de tu proyecto"
- Footer: "Miembro de MEXDC · asmexdc.com"

---

## Restricciones de contenido

1. **Ninguna cifra sin periodo declarado** cuando conviva con cifras de otro
   periodo. Un mismo valor no puede aparecer dos veces con marcos distintos.
2. **Ninguna cifra atribuida a MEXDC.** La membresía es credencial, no origen.
3. **Ningún dato inventado.** Si no consta en fuente verificable, no se publica —
   con más razón en la sección llamada "Credibilidad".
4. **Ninguna promesa de tiempo de respuesta** sin sección que la sostenga.
