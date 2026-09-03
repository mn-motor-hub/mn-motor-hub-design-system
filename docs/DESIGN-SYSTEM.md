# MN Motor Hub — Design System

> **Estado:** Relevamiento. Este documento describe lo que **hay hoy**, no lo que queremos.
> Ningún código fue modificado para producirlo.
>
> **Alcance:** `mn-motor-hub-web` (tienda pública) + `mn-motor-hub-frontend` (app interna) + marca / redes sociales.
> **Fecha del relevamiento:** 2026-09-02

---

## 0. Resumen ejecutivo

El design system **ya existe**, pero no está donde lo buscábamos.

`mn-motor-hub-frontend` (la app interna) tiene un sistema maduro: escala tipográfica completa, escala de espaciado, colores semánticos de estado, sombras, y **10 primitivas de UI** en `src/components/ui/`. Su adherencia es prácticamente perfecta: **301 declaraciones `font-size` vía token y 0 hardcodeadas**.

`mn-motor-hub-web` (esta app) tiene solo la capa de color. **20 tamaños de fuente hardcodeados, 0 tokens tipográficos, 0 primitivas.**

Y entre los dos hay un **conflicto semántico crítico**: el token `--color-primary` significa colores opuestos en cada repo.

**Conclusión:** la tarea no es *crear* un design system desde la web. Es **promover el de la app interna a paquete compartido, reconciliar el conflicto de nombres, y migrar la web hacia él.**

---

## 1. Hallazgo crítico — colisión de tokens entre repos

Estos tres nombres existen en ambos repos con valores **distintos**. Cualquier CSS compartido hoy rompería uno de los dos.

| Token | `web` | `frontend` (app interna) | Riesgo |
|---|---|---|---|
| `--color-primary` | `#ffb59e` durazno | `#ff571a` naranja | **Alto** — invertido |
| `--color-surface` | `#131313` casi negro | `#201f1f` gris carbón | **Alto** — invertido |
| `--container-max` | `100%` | `1280px` | Medio |
| `--spacing-edge` | `clamp(24px, 5vw, 72px)` | `clamp(16px, 5vw, 72px)` | Bajo |

Además, el mismo concepto tiene dos nombres:

| Concepto | `web` | `frontend` |
|---|---|---|
| Naranja de acción `#ff571a` | `--color-primary-container` | `--color-primary` |
| Durazno `#ffb59e` | `--color-primary` | `--color-primary-dim` |
| Marrón oscuro `#521300` | `--color-on-primary-container` | `--color-on-primary` |

**La paleta física es idéntica en ambos repos.** El problema es puramente de nomenclatura: la web heredó los nombres Material 3 de Stitch (`*-container`), la app adoptó nombres funcionales. Reconciliar es renombrar, no rediseñar — no hay cambio visual en juego.

**Recomendación:** adoptar la nomenclatura de la app interna (funcional, más corta, y con 68 CSS Modules ya escritos contra ella vs 17 en la web). El costo de migración cae del lado más barato.

---

## 2. Inventario de tokens

### 2.1 Color — superficies

Idénticas en ambos repos. Escala de 6 pasos, dark-only.

| Token | Valor | Uso observado |
|---|---|---|
| `--color-surface-lowest` | `#0e0e0e` | Fondos hundidos, overlays de imagen |
| `--color-background` | `#131313` | Fondo de página |
| `--color-surface-low` | `#1c1b1b` | Secciones alternadas |
| `--color-surface-container` | `#201f1f` | Cards, paneles |
| `--color-surface-high` | `#2a2a2a` | Elementos elevados, hover de card |
| `--color-surface-variant` | `#353534` | Separadores, inputs |

### 2.2 Color — marca

| Token (propuesto) | Valor | Rol |
|---|---|---|
| `--color-primary` | `#ff571a` | Naranja de acción. CTAs, precios, acentos |
| `--color-primary-hover` | `#d63f00` | Estado hover del naranja *(solo existe en app)* |
| `--color-primary-dim` | `#ffb59e` | Durazno. Texto/iconos sobre fondo oscuro |
| `--color-on-primary` | `#521300` | Texto sobre el naranja |

### 2.3 Color — texto y borde

| Token | Valor | Rol |
|---|---|---|
| `--color-on-surface` | `#e5e2e1` | Texto principal |
| `--color-on-surface-variant` | `#e6beb2` | Texto secundario, tono cálido |
| `--color-outline` | `#ad897e` | Bordes visibles, texto atenuado |
| `--color-outline-variant` | `#5c4037` | Bordes sutiles |

### 2.4 Color — estados semánticos

**Solo existen en la app interna.** La web no tiene ninguno — es una carencia real: no hay forma tokenizada de expresar "sin stock", "error de formulario" o "pedido confirmado" en la tienda.

| Token | Valor | Fondo asociado |
|---|---|---|
| `--color-success` | `#4caf7d` | `--color-success-dim` `rgba(76,175,125,.12)` |
| `--color-warning` | `#f0a845` | `--color-warning-dim` `rgba(240,168,69,.12)` |
| `--color-danger` | `#f05252` | `--color-danger-dim` `rgba(240,82,82,.12)` |
| `--color-info` | `#4da6ff` | `--color-info-dim` `rgba(77,166,255,.12)` |

### 2.5 Alphas / overlays — no tokenizados en ningún repo

La web tiene 10 `rgba()` sueltos. **Ninguno es un color nuevo**: todos son tokens existentes con transparencia. Es la única fuga de color del repo, y es sistemática, no accidental.

| `rgba()` encontrado | Es realmente | Ocurrencias |
|---|---|---|
| `rgba(255, 87, 26, .3)` | `--color-primary` @ 30% | 2 |
| `rgba(229, 226, 225, .08)` | `--color-on-surface` @ 8% | 2 |
| `rgba(255, 181, 158, .12 / .25 / .08)` | `--color-primary-dim` @ varios | 3 |
| `rgba(92, 64, 55, .3)` | `--color-outline-variant` @ 30% | 1 |
| `rgba(13, 13, 13, .95 / .6 / .4)` | `--color-surface-lowest` @ varios | 3 |

**Brecha:** faltan tokens de overlay. Los valores de alpha usados en la práctica son `.08 / .12 / .25 / .30 / .40 / .60 / .95` — una escala implícita que conviene formalizar.

### 2.6 Tipografía

**Familias** — idénticas en ambos repos.

| Token | Valor | Rol |
|---|---|---|
| `--font-oswald` | `'Oswald', sans-serif` | Headings, display, uppercase |
| `--font-inter` | `'Inter', sans-serif` | Body, labels, descripciones |
| `--font-mono` | `'JetBrains Mono', monospace` | Datos, códigos *(solo app)* |

**Escala** — existe solo en la app interna.

| Token | Valor | px |
|---|---|---|
| `--text-xs` | `0.75rem` | 12 |
| `--text-sm` | `0.875rem` | 14 |
| `--text-base` | `1rem` | 16 |
| `--text-lg` | `1.125rem` | 18 |
| `--text-xl` | `1.25rem` | 20 |
| `--text-2xl` | `1.5rem` | 24 |
| `--text-3xl` | `2rem` | 32 |

La escala **se corta en 32px**, porque la app interna es un dashboard y no necesita más. La web sí: usa 36, 40, 48, 64 y 120px. **La escala compartida necesita extenderse hacia arriba y un paso hacia abajo.**

**Extensión propuesta** (aditiva — no toca ningún valor existente, así que las 301 usos de la app no se ven afectados):

| Token nuevo | Valor | px | Necesario para |
|---|---|---|---|
| `--text-2xs` | `0.625rem` | 10 | Labels tipo "PRÓXIMAMENTE" |
| `--text-4xl` | `2.5rem` | 40 | H1 de sección en desktop |
| `--text-5xl` | `3rem` | 48 | Hero secundario |
| `--text-6xl` | `4rem` | 64 | Hero principal |
| `--text-display` | `7.5rem` | 120 | Números decorativos de fondo |

**Valores off-scale de la web que requieren decisión caso por caso** — no se pueden normalizar sin criterio, porque implican un corrimiento visible:

`11px` · `13px` · `15px` · `22px` · `26px` · `28px` · `36px`

Cada uno cae entre dos pasos de la escala. Redondearlos es un cambio visual real (hasta 4px). **No asumir que la migración tipográfica es visualmente neutra.**

**Pesos** — la web usa 3 (`500`, `600`, `700`), la app usa 5 (agrega `400` y `800`). Sin tokenizar en ninguno.

**Letter-spacing** — la web tiene un patrón claro y consistente, hoy repetido a mano en 20 lugares:

| Valor | Ocurrencias | Contexto |
|---|---|---|
| `0.05em` | 12 | Headings Oswald uppercase |
| `0.1em` | 5 | Labels pequeños uppercase |
| `0.08em` | 2 | Botones |
| `-0.02em` | 1 | Display grande |

**32 declaraciones `text-transform: uppercase`.** El uppercase es identidad de marca, no decoración — merece ser una receta tipográfica, no una propiedad suelta.

### 2.7 Espaciado

| Token | Valor | Repo |
|---|---|---|
| `--space-xs` | `4px` | solo app |
| `--space-sm` | `8px` | solo app |
| `--space-md` | `16px` | solo app |
| `--space-lg` | `24px` | solo app |
| `--space-xl` | `32px` | solo app |
| `--space-2xl` | `48px` | solo app |
| `--spacing-base` | `8px` | ambos |
| `--spacing-gutter` | `24px` | ambos |
| `--spacing-section` | `80px` | ambos |
| `--spacing-edge` | `clamp(...)` | ambos, **valores distintos** |

Hay **dos sistemas de espaciado conviviendo** (`--space-*` y `--spacing-*`) con solapamiento: `--space-sm` y `--spacing-base` son ambos `8px`; `--space-lg` y `--spacing-gutter` son ambos `24px`. Consolidar.

La web usa 16 valores px distintos: `2 3 4 6 8 10 12 16 20 24 32 36 40 44 48 64`.
Sobre la escala de 8pt, quedan **off-scale**: `3 6 10 12 20 36 40 44`.

Notas:
- `44px` no es espaciado — es el **mínimo de touch target** de `CLAUDE.md`. Merece su propio token (`--touch-min`), no forzarlo a la escala.
- Falta `--space-3xl: 64px` para cubrir el uso real de la web.

### 2.8 Radios

Idénticos y con adherencia alta (20 de 21 usos vía token).

| Token | Valor |
|---|---|
| `--radius-sm` | `2px` |
| `--radius-md` | `4px` |
| `--radius-lg` | `8px` |
| `--radius-full` | `9999px` — **solo app**; la web tiene un `9999px` suelto |

### 2.9 Sombras — solo app

`--shadow-sm` `0 1px 4px rgba(0,0,0,.45)` · `--shadow-md` `0 4px 16px rgba(0,0,0,.55)` · `--shadow-lg` `0 8px 32px rgba(0,0,0,.65)`

### 2.10 Breakpoints

`CLAUDE.md` obliga a `min-width`. La web tiene **7 violaciones**:

| Query | Ocurrencias | Estado |
|---|---|---|
| `(min-width: 768px)` | 20 | Correcto |
| `(min-width: 1280px)` | 4 | Correcto |
| `(min-width: 480px)` | 1 | Correcto, pero breakpoint no declarado |
| `(max-width: 767px)` | 6 | **Viola la regla mobile-first** |
| `(max-width: 479px)` | 1 | **Viola la regla mobile-first** |

Los breakpoints tampoco están tokenizados — las media queries de CSS no aceptan `var()`, así que esto requiere convención documentada o build step.

---

## 3. Inventario de componentes

### 3.1 App interna — `src/components/ui/` (la biblioteca real)

| Componente | Variantes |
|---|---|
| **Button** | `primary` · `secondary` · `danger` · `ghost` × `sm` · `md` · `lg` + estado `loading` con spinner |
| **Badge** | `success` · `warning` · `danger` · `info` · `neutral` |
| Input · Select · Modal · Table · Pagination · StatCard · InfoPopover · ScrollToBottomButton | — |

Deuda menor: 14 `#fff` y una decena de grises Zinc (`#52525b`, `#18181b`, `#71717a`…) hardcodeados en los CSS Modules — **una paleta gris ajena a la marca** que se coló y no está en `:root`.

### 3.2 Web — sin biblioteca

12 componentes de sección (Navbar, Hero, Categories, ProductCard, Footer…), ninguna primitiva compartida.

**Duplicación confirmada:** el botón naranja está reimplementado desde cero en **4 archivos** — `Hero`, `Navbar`, `CTABanner`, `Catalog/Pagination`. La app interna ya tiene ese botón resuelto con 4 variantes y 3 tamaños.

`AvailabilityBadge` de la web y `Badge` de la app resuelven el mismo problema por separado.

---

## 4. Estrategia de distribución multi-repo

Los dos repos comparten stack (Next 16, React 19, TypeScript strict, CSS Modules, sin Tailwind), lo que hace el código realmente compartible. La restricción es que hoy son directorios hermanos sin monorepo ni registry privado.

### Capas propuestas

```
@mn/tokens      →  CSS variables + export TS/JSON. Cero dependencias.
                   Consumido por: web, app interna, y herramientas de marca.

@mn/ui          →  Primitivas React (Button, Badge, Input, Select, Modal…).
                   Depende de @mn/tokens.
                   Consumido por: web, app interna.

@mn/brand       →  Derivado de @mn/tokens. Paleta exportada, specs
                   tipográficas, plantillas para redes.
                   No es código de app.
```

**`@mn/tokens` es la pieza clave y la que menos cuesta.** Es un archivo CSS y un JSON. Resuelve el conflicto de nombres de una vez, y es lo único que la capa de marca necesita.

### Opciones de mecanismo

| Opción | Costo | Trade-off |
|---|---|---|
| **npm workspaces** (mover ambos repos bajo un monorepo) | Alto | Cambio estructural grande; los repos ya tienen historial y deploys independientes en Vercel |
| **Paquete git** (`npm i git+ssh://…/mn-design-system`) | **Bajo** | Sin registry, sin monorepo, versionado por tag. Funciona hoy. |
| **npm privado** (GitHub Packages) | Medio | Más limpio a largo plazo; requiere auth en CI y en Vercel |
| **Copiar y sincronizar a mano** | Nulo al inicio, creciente después | Es exactamente el estado actual, y es por qué los tokens divergieron |

**Recomendación: paquete git, versionado por tag.** Es el único que resuelve el problema sin reestructurar los deploys, y se puede migrar a npm privado después sin cambiar el código consumidor.

### Orden de trabajo sugerido

1. Reconciliar la nomenclatura de tokens (decisión de nombres — **bloquea todo lo demás**)
2. Extraer `@mn/tokens` desde el `globals.css` de la app interna + las extensiones de §2.6/2.7
3. Migrar la app interna a consumirlo (bajo riesgo: ya usa esos nombres)
4. Migrar la web (alto riesgo: 20 tamaños a normalizar, 7 valores off-scale con corrimiento visual)
5. Extraer `@mn/ui` desde `src/components/ui/`
6. Reemplazar las 4 implementaciones duplicadas de botón en la web

---

## 5. Capa de marca / redes sociales

Todo lo necesario ya está en los tokens; lo que falta es **exportarlo fuera del navegador**.

**Lo que ya está definido y es directamente utilizable:**

- **Paleta:** naranja `#ff571a` (acción), durazno `#ffb59e` (acento sobre oscuro), marrón `#521300` (texto sobre naranja), fondo `#131313`, texto `#e5e2e1`
- **Tipografías:** Oswald para títulos, Inter para cuerpo — ambas Google Fonts, disponibles gratis en Canva, Figma y Illustrator
- **Firma visual verificada en el código:** Oswald + uppercase + `letter-spacing: 0.05em` es la receta de heading que se repite en todo el sitio (32 usos de uppercase). Esa combinación **es** la identidad de MN Motor Hub.
- **Acento de sección:** barra de 2px × 64px con degradado de naranja a transparente (`.section-accent` en `globals.css`) — un elemento gráfico reutilizable directamente en piezas gráficas.

**Lo que falta definir** (no existe en ningún repo, es trabajo de diseño, no de relevamiento):

- Logo y sus variantes / área de resguardo
- Ratios de contraste verificados sobre fondo claro — **la paleta es dark-only**; el durazno `#ffb59e` y el naranja `#ff571a` no tienen contraste garantizado sobre blanco, y las redes muestran contenido en ambos modos
- Formatos y grillas por plataforma (1:1, 4:5, 9:16)
- Tratamiento fotográfico de producto

---

## 6. Deuda detectada

| # | Hallazgo | Repo | Severidad |
|---|---|---|---|
| 1 | `--color-primary` y `--color-surface` con valores invertidos entre repos | ambos | **Crítico** |
| 2 | 20 tamaños de fuente hardcodeados, sin escala | web | Alto |
| 3 | Botón naranja duplicado en 4 archivos | web | Alto |
| 4 | Sin colores semánticos de estado | web | Alto |
| 5 | 8 valores de espaciado off-scale | web | Medio |
| 6 | 7 media queries `max-width` (violan `CLAUDE.md`) | web | Medio |
| 7 | Grises Zinc ajenos a la marca hardcodeados | app | Medio |
| 8 | Dos sistemas de espaciado solapados (`--space-*` / `--spacing-*`) | ambos | Medio |
| 9 | 10 `rgba()` sin token de overlay | web | Bajo |
| 10 | `9999px` suelto en vez de `--radius-full` | web | Bajo |
| 11 | Pesos y letter-spacing sin tokenizar | ambos | Bajo |
| 12 | Breakpoint `480px` usado pero no declarado | web | Bajo |

---

## 7. Decisiones pendientes

1. **Nomenclatura de tokens** — ¿se adopta la de la app interna? Bloquea todo lo demás.
2. **Mecanismo de distribución** — paquete git vs monorepo vs npm privado.
3. **Valores off-scale de tipografía** — ¿se normalizan (con corrimiento visual de hasta 4px) o se agregan pasos intermedios a la escala?
4. **Modo claro** — ¿la marca necesita paleta para fondo claro? Afecta al plan de redes sociales.
