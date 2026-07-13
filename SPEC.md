# Spec: Senties Chauvet Site Redesign

## Purpose
Rediseñar el sitio estático vanilla HTML/CSS/JS con posicionamiento centrado en el ecosistema MEXDC,
promoviendo SAI como metodología principal y separando afianzadoras de miembros MEXDC.

---

## Site Structure

| Section | Type | Order |
|---------|------|-------|
| Header | MODIFIED | 1 — nav links: SAI, Servicios, Niveles, Contacto |
| Hero | MODIFIED | 2 — nuevo badge, h1, CTAs |
| MEXDC Trust | NEW | 3 — logo grid + verificación |
| SAI — Supplier Analysis | PROMOTED | 4 — sección visualmente destacada |
| Services | MODIFIED | 5 — SAI sale, los otros 3 siguen |
| Afianzadoras aliadas | RENAMED | 6 — nombre + copy nuevos |
| Service Levels | KEPT | 7 — sin cambios estructurales |
| Contact | KEPT | 8 — sin cambios |
| Footer | MODIFIED | 9 — añade enlace MEXDC |

---

## Requirements

### REQ-HERO: Hero Section Redesign

**Badge**: "Partner MEXDC · Agente Afianzador Certificado" con ícono de verificación.
**H1**: "El agente afianzador que entiende el ecosistema MEXDC" — "MEXDC" en accent italic.
**CTAs**: "Solicitar fianza" (primary) + "Conocer SAI" (secondary/outline, scroll a #sai).
**Stats row**: sin cambios en datos, conserva estructura actual.
**Hero image**: se mantiene `assets/header-photo-2.jpg`.

#### Scenario: Visitante ve el nuevo posicionamiento
- GIVEN un visitante llega al sitio
- WHEN carga la página
- THEN ve el badge "Partner MEXDC · Agente Afianzador Certificado"
- AND el h1 incluye "ecosistema MEXDC" con MEXDC en accent
- AND el CTA secundario dice "Conocer SAI"

#### Scenario: CTA secundario navega a SAI
- GIVEN el visitante está en el hero
- WHEN hace clic en "Conocer SAI"
- THEN la página hace scroll a la sección #sai

### REQ-MEXDC: MEXDC Trust Section

Sección NUEVA entre Hero y SAI. Reemplaza la sección "Partners" actual.
Debe mostrar logos de miembros MEXDC reconocibles como señal de confianza.

**Section label**: "Credibilidad"
**H2**: "Miembro del ecosistema MEXDC"
**Copy**: texto breve explicando qué es MEXDC.
**Logo grid**: logos de Equinix, KIO, Schneider, Siemens, Microsoft (obtenidos del sitio público MEXDC). Layout: 5-columnas en desktop, scroll horizontal en mobile.
**Badge**: "Partner MEXDC" con enlace a `https://asmexdc.com/socios-y-asociados/` (target="_blank", rel="noopener").

#### Scenario: Visitante verifica membresía MEXDC
- GIVEN el visitante está en la sección MEXDC Trust
- WHEN hace clic en el badge "Partner MEXDC"
- THEN se abre `https://asmexdc.com/socios-y-asociados/` en nueva pestaña

#### Scenario: Logos visibles en mobile
- GIVEN el dispositivo tiene viewport < 768px
- WHEN el visitante ve la sección MEXDC Trust
- THEN los logos se muestran en scroll horizontal (no se cortan ni apilan verticalmente)

### REQ-SAI: SAI Promoted Section

SAI pasa de ser una tarjeta de servicio a sección propia con prominencia visual.

**Section label**: "Metodología Propia"
**H2**: "SAI: El análisis que cambia cómo eligen sus afianzadoras"
**Copy**: qué hace SAI (análisis financiero + riesgo de proveedores en ecosistema data centers).
**Diferenciadores**: score de salud, indicadores de riesgo, datos fiscales, concentración comercial — presentados como lista visual con íconos.
**Resultado destacado**: "Evaluación en 1 hora, no en semanas" — en tipografía grande y accent.
**Fondo**: distinto al resto — usar `var(--primary)` como fondo de sección (estilo levels) o `var(--bg-alt)` con borde accent lateral.

#### Scenario: SAI es la sección más visible
- GIVEN el visitante navega por el sitio
- WHEN llega a la sección SAI
- THEN el fondo es visualmente distinto a las secciones adyacentes
- AND "Evaluación en 1 hora, no en semanas" usa color accent y tamaño prominente

#### Scenario: Servicios ya no incluyen SAI como tarjeta
- GIVEN el visitante está en la sección Services
- WHEN observa las tarjetas de servicio
- THEN solo ve 3 tarjetas: Emisión de fianzas, Programas corporativos, Gestión jurídica
- AND SAI no aparece como cuarta tarjeta

### REQ-SERVICES: Services Reorganized

3 tarjetas (SAI fue extraído a sección propia):
1. Emisión y administración de fianzas
2. Programas corporativos
3. Gestión jurídica y reclamaciones

El layout pasa de 2×2 a 3-columnas en desktop.

#### Scenario: Grid de servicios con 3 columnas
- GIVEN el viewport es >= 769px
- WHEN el visitante ve la sección Services
- THEN las 3 tarjetas se muestran en un grid de 3 columnas (1fr cada una)

### REQ-AFIANZADORAS: Afianzadoras Section Renamed

**Nuevo título**: "Respaldados por las principales afianzadoras de México"
**Section label**: "Respaldo"
Se mantienen las 11 afianzadoras actuales sin cambios.
El propósito es diferenciar afianzadoras (insurers) del ecosistema MEXDC (operators/suppliers).

#### Scenario: Visitante distingue afianzadoras de miembros MEXDC
- GIVEN el visitante ve la sección MEXDC Trust (con logos de Equinix, KIO, etc.)
- WHEN llega a la sección Afianzadoras
- THEN entiende que son entidades distintas — las afianzadoras son las emisoras de las fianzas

### REQ-FOOTER: Footer Update

Añadir: "Miembro de MEXDC · asmexdc.com" con enlace verificable.
Mantener copyright y nota CNSF.

#### Scenario: Enlace MEXDC en footer
- GIVEN el visitante está en el footer
- WHEN hace clic en "asmexdc.com"
- THEN se abre `https://asmexdc.com/socios-y-asociados/` en nueva pestaña

---

## Design Tokens

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#fafaf8` | `#0f0f0f` |
| `--bg-alt` | `#f3f1ed` | `#161616` |
| `--surface` | `#ffffff` | `#1a1a1a` |
| `--primary` | `#002B49` | `#5a8aaa` |
| `--accent` | `#FF7530` | `#FF7530` |
| `--text` | `#1a1a1a` | `#e8e8e8` |
| `--text-secondary` | `#5a5a5a` | `#a0a0a0` |
| `--font-heading` | Playfair Display | — |
| `--font-body` | Inter | — |

**Nuevos tokens necesarios**:
- `--sai-bg`: fondo de sección SAI (sugerido: `var(--primary)` o gradiente sutil)
- `--accent-glow`: sombra/glow para elementos SAI destacados
- `--badge-mexdc-bg`: fondo del badge Partner MEXDC

---

## Assets Required

| Asset | Source | Notes |
|-------|--------|-------|
| `logo-senties.png` | Existing | Sin cambios |
| `header-photo-2.jpg` | Existing | Sin cambios |
| Logo Equinix | Sitio público MEXDC o brand assets | Para grid MEXDC Trust |
| Logo KIO | Sitio público MEXDC | Para grid MEXDC Trust |
| Logo Schneider | Sitio público MEXDC | Para grid MEXDC Trust |
| Logo Siemens | Sitio público MEXDC | Para grid MEXDC Trust |
| Logo Microsoft | Sitio público MEXDC | Para grid MEXDC Trust |
| Ícono verificación | Font Awesome `fa-circle-check` | Para badge Partner MEXDC |

---

## Key Copy Points

- Posicionamiento: "El agente afianzador para el ecosistema MEXDC"
- H1: "El agente afianzador que entiende el ecosistema MEXDC"
- SAI tagline: "El análisis que cambia cómo eligen sus afianzadoras"
- SAI resultado: "Evaluación en 1 hora, no en semanas"
- Afianzadoras: "Respaldados por las principales afianzadoras de México"
- MEXDC: "Miembro del ecosistema MEXDC" con verificación pública
- Footer: "Miembro de MEXDC · asmexdc.com"
