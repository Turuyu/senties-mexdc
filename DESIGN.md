# Design: Senties Chauvet — Sitio Público

> **Estado**: documenta la implementación publicada, a 2026-08-18.
> **Fuente de verdad**: `styles.css` y `script.js`. Los fragmentos de código de
> este documento son ilustrativos; si divergen del archivo real, gana el archivo.
> Los requisitos viven en `SPEC.md`. El plan del rediseño original quedó
> archivado en `TASKS.md`.

---

## 1. Sistema de layout — paneles flotantes

El sitio no usa secciones a sangre completa. Usa un *shell* con padding
uniforme del que cuelgan paneles redondeados independientes:

```
<div class="page">        padding + gap = --shell-pad (14px)
  <main class="stack">    columna flex, mismo gap
    <section class="panel">          --radius-panel (32px), overflow hidden
      <div class="panel-inner">      max-width 1180px, padding --panel-pad
```

El fondo del shell es `--canvas` (`#ebe5db`), un crudo cálido. Los paneles son
`--surface` (blanco) y flotan sobre él. Ese contraste crudo/blanco es lo que da
la sensación de tarjetas separadas sin necesidad de bordes ni sombras.

`--panel-pad` es `clamp(32px, 5.5vw, 84px)`: el respiro interior escala con el
viewport sin necesitar breakpoints propios.

### Variante oscura

```css
.panel--dark {
    background: var(--panel-dark-bg);   /* gradiente navy 140deg */
    color: var(--text-inverse);
}
.panel--dark h2, .panel--dark h3 { color: #fff; }
.panel--dark p { color: rgba(255, 255, 255, 0.65); }
.panel--dark .tone-soft { color: rgba(255, 255, 255, 0.42); }
.panel--dark .section-label { color: var(--accent-light); }
```

Paneles oscuros actuales: **SAI** y **Contacto**.

> **La trampa de `panel--dark`.** Esas reglas cubren `h2`, `h3`, `p`,
> `.tone-soft` y `.section-label`. **Nada más.** Cualquier componente que defina
> su propio `color` o `background` con tokens de tema seguirá pintándose para el
> tema claro/oscuro, no para el panel. Los tokens siguen el **tema**; el panel es
> otro eje.
>
> Por eso `.contact-item` necesitó overrides explícitos al pasar Contacto a
> oscuro: sus tiles `--surface-sunken` crema con texto `--text` oscuro habrían
> quedado flotando sobre el gradiente navy, con un borde `rgba(0,0,0,0.06)`
> invisible.

**Convención para elementos sobre panel oscuro** (la establece `.sai-highlight`
y la siguen `.sai-diff-icon` y `.panel--dark .contact-item`):

```css
background: rgba(255, 255, 255, 0.07);   /* superficie */
border:     1px solid rgba(255, 255, 255, 0.12);
color:      var(--accent-light);          /* íconos */
```

`--accent-light` (`#FF9A66`) **no** se redefine en `body.dark-theme`, así que
rinde el mismo naranja en ambos temas sobre el navy. Es intencional: la
combinación ya estaba probada en SAI antes de reutilizarse en Contacto.

---

## 2. Sistema de tema

Clase sobre `<body>`, no media query:

```js
// script.js — initTheme()
localStorage.getItem('theme')                       // 1. preferencia guardada
  ?? window.matchMedia('(prefers-color-scheme: dark)')  // 2. preferencia del SO
document.body.classList.toggle('dark-theme')        // 3. botón #themeToggle
```

`:root` define la paleta clara completa (33 tokens). `body.dark-theme` redefine
19. El resto se hereda — por eso `--accent` y `--accent-light` son idénticos en
ambos temas.

Overrides puntuales de tema fuera del bloque de tokens (`body.dark-theme .X`):
header al hacer scroll, logo del header y del footer (invertidos a blanco),
`.btn-primary`, `.theme-toggle` y el separador del footer.

---

## 3. Secciones — patrones visuales

### Hero (`panel panel--media`)

`--panel-pad` se anula (`.panel--media { padding: 0 }`): el video ocupa el panel
completo y el contenido va sobre él con su propio padding.

Capas: `<video>` → `.hero-scrim` (degradado para legibilidad) → `.hero-body`.
El `.glass-stat--hero` se posiciona absoluto sobre el video en escritorio y
pasa a `position: static` dentro del flujo a ≤768px, para que no colisione.

### Credibilidad (`panel credibility`)

`.figures` es un grid de **4 columnas** con `border-top`/`border-bottom`, que lo
convierte en una banda horizontal. `margin-bottom: 56px` es lo único que separa
las cifras del pill de MEXDC — no hay elemento intermedio.

> Cambiar la cantidad de `.figure` obliga a revisar los tres breakpoints de
> ancho. Un grid de N columnas con N−1 elementos deja una celda huérfana que
> solo aparece en tablet.

### SAI (`panel panel--dark sai`)

`.sai-inner` es un grid de 2 columnas (contenido + `.sai-highlight`) que colapsa
a 1 a ≤1024px.

### Servicios (`panel services`)

3 tarjetas `--surface-sunken` sobre panel claro. Grid de 3 → 1 a ≤1024px.

### Afianzadoras (`panel partners`)

Rail marquee horizontal. Ver §4.

### Contacto (`panel panel--dark contact`)

Grid de 2×2 de `.contact-item`, a 1 columna en ≤768px. Panel oscuro: aplica todo
lo de §1.

---

## 4. Marquee de logos

El rail desplaza cada track exactamente el ancho de un track hacia la izquierda,
de modo que la copia siguiente aterriza donde empezó la anterior. Eso solo se lee
como continuo si los tracks juntos superan el ancho visible — por eso
`script.js` **clona hasta cubrir el doble del viewport**, en vez de asumir que
dos copias alcanzan siempre.

El markup lleva **un solo** `.logo-marquee-track`. Un logo se agrega en un único
lugar; el clonado es responsabilidad del script.

```css
.logo-marquee {
    --marquee-gap: 14px;
    display: flex;
    gap: var(--marquee-gap);
    padding: 18px 0;   /* aire vertical: si no, el lift de la tarjeta se recorta */
    overflow-x: auto;
    scrollbar-width: none;
}
```

`.logo-card--invert` existe para Sofimex y AVLA, que solo publican marcas blancas
sobre transparente: invertirlas las pinta en negro para que se lean sobre tarjeta
clara. Como no tienen color que revelar, su hover responde con opacidad, no con
`grayscale`.

Bajo `@media (hover: none)` todos los logos se muestran a color: en táctil el
hover nunca dispara y el efecto los dejaría en gris permanente.

---

## 5. Responsive

| Breakpoint | Cambios |
|------------|---------|
| `≤1024px` | `.sai-inner` y `.services-grid` a 1 columna; `.figures` a 2 columnas; `.glass-stat--hero` se ancla abajo |
| `≤768px` | `--radius-panel` a 24px; nav y CTA del header ocultos, `.mobile-toggle` visible; `.glass-stat--hero` a `position: static`; `.contact-info` a 1 columna; separador del footer oculto |
| `≤480px` | CTAs del hero a ancho completo; `.figures` a 1 columna; `.glass-stat strong` reducido |
| `(hover: none)` | Logos a color permanente |
| `prefers-reduced-motion` | Marquee detenido, transiciones anuladas |

Las cifras reparten 4 → 2×2 a ≤1024px → 1 columna a ≤480px. Ese escalonado solo
funciona con un número **par** de cifras: con 3 elementos el paso de 2 columnas
deja un huérfano, y hubo que saltárselo mientras la sección tuvo 3.

---

## 6. JavaScript

`script.js`, vanilla, sin dependencias. Cinco responsabilidades:

| Función | Qué hace |
|---------|----------|
| `initTheme()` | localStorage → `prefers-color-scheme` → toggle manual |
| `initMobileMenu()` | Abre/cierra, cierra al navegar, cierra con `Escape`, atrapa el foco y lo devuelve al botón |
| `initHeaderScroll()` | Añade `.scrolled` al header al pasar el umbral |
| `initHeroVideo()` | Reproduce silenciado en bucle; pausa cuando el hero sale del viewport (IntersectionObserver) |
| `initLogoMarquee()` | Clona tracks hasta cubrir 2× el ancho visible |

El video **debe** ir silenciado: los navegadores solo permiten autoplay sin
interacción en ese caso. Es un requisito del navegador, no una preferencia.

La navegación por anclas **no** usa JS: la resuelve `scroll-behavior: smooth`.

---

## 7. Accesibilidad

- Todo `<i>` decorativo lleva `aria-hidden="true"`.
- Las secciones con `id` referenciable llevan `aria-labelledby` apuntando al `id`
  de su `<h2>` (`credibility-title`, `sai-title`).
- El menú móvil gestiona `aria-expanded` y devuelve el foco al cerrar.
- El `<aside>` del hero lleva `aria-label` que **debe coincidir** con su texto
  visible. Si cambia la etiqueta, cambia el `aria-label`.
- Los tracks clonados del marquee reciben `aria-hidden="true"`: son los mismos
  logos otra vez, y anunciarlos haría leer la lista como si Senties tuviera el
  doble de afianzadoras aliadas.
- `prefers-reduced-motion` desactiva marquee y transiciones.

---

## 8. Convenciones de nombres

- Las clases de sección (`.credibility`, `.sai`, `.services`, `.partners`,
  `.contact`) son marcadores semánticos sin estilos propios. No las borres por
  "no usadas": identifican la sección en el markup.
- `.logo-card` la comparten el rail de partners y cualquier grid de logos futuro.
  Vive bajo el comentario `LOGO CARDS`, no bajo una sección concreta.
- Un nombre de clase que describe comportamiento debe seguir siendo cierto:
  `.mexdc-badge-ext` se renombró a `.mexdc-badge-arrow` cuando el enlace dejó de
  abrir pestaña nueva. Un `ext` en algo que ya no es externo es una mentira
  esperando a confundir a quien lo lea.

---

## 9. Deuda conocida

- Tokens definidos sin uso: `--border-strong`, `--invert`, `--radius-sm`,
  `--shadow-lg`. Preceden a los cambios recientes; se dejan por si el diseño los
  retoma.
- `.mexdc-badge-text`, `.sai-content` y `.sai-label` son ganchos sin regla CSS.
- `$57,200 MDP` aparece dos veces: en el glass stat del hero y como cuarta cifra
  de Credibilidad, ambas etiquetadas "en 2025". Es redundancia deliberada
  —Credibilidad necesitaba un dato monetario— no una contradicción. Cuando exista
  el monto acumulado histórico real, esa cuarta cifra debería pasar a ser el
  acumulado y el dato anual quedarse solo en el hero.
