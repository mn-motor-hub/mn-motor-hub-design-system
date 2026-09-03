# MN Motor Hub — Guía de Marca

> Guía para producir contenido (redes sociales, fotos de producto, piezas gráficas) alineado
> al mismo sistema visual que usan la tienda web y el ERP interno.
>
> **La paleta y la tipografía de abajo son generadas desde `tokens/tokens.json`.**
> Si un valor cambia ahí, cambia acá en el próximo `npm run build`. No copiar hex a mano.

---

## 1. La identidad en una línea

**Oswald en mayúsculas con `letter-spacing: 0.05em`, naranja `#FF571A` sobre negro `#131313`.**

Eso es MN Motor Hub. Está verificado en el código: la combinación se repite en 32 lugares
del sitio. Cualquier pieza que respete esas tres cosas se lee como nuestra; cualquier pieza
que las rompa, no.

**Personalidad:** técnico, directo, sin adornos. Somos repuestos, no lifestyle. El naranja es
señalización industrial, no "energía juvenil". El negro es taller, no lujo.

---

## 2. Tokens

<!-- tokens:start -->
> Generado desde `tokens/tokens.json` v2.0.0. No editar a mano.

### Paleta

| Token | HEX | RGB | Rol |
|---|---|---|---|
| `--color-background` | `#131313` | `19, 19, 19` | Fondo de pagina. |
| `--color-surface` | `#201F1F` | `32, 31, 31` | — |
| `--color-surface-lowest` | `#0E0E0E` | `14, 14, 14` | Fondo hundido. Base de overlays sobre foto. |
| `--color-surface-low` | `#1C1B1B` | `28, 27, 27` | Seccion alternada. |
| `--color-surface-container` | `#201F1F` | `32, 31, 31` | Card, panel, modal. |
| `--color-surface-high` | `#2A2A2A` | `42, 42, 42` | Elemento elevado. Hover de card. |
| `--color-surface-variant` | `#353534` | `53, 53, 52` | Separador, fondo de input. |
| `--color-primary` | `#FF571A` | `255, 87, 26` | Naranja de accion. CTAs, precios, acentos. El color de la marca. |
| `--color-primary-hover` | `#D63F00` | `214, 63, 0` | Naranja en hover/pressed. |
| `--color-primary-dim` | `#FFB59E` | `255, 181, 158` | Durazno. Texto e iconos de acento sobre fondo oscuro. Nunca como fondo de boton. |
| `--color-primary-dim-hover` | `#E6A08C` | `230, 160, 140` | Durazno en hover. |
| `--color-on-primary` | `#521300` | `82, 19, 0` | Marron oscuro. Unico color de texto aprobado sobre el naranja. |
| `--color-on-surface` | `#E5E2E1` | `229, 226, 225` | Texto principal. |
| `--color-on-surface-variant` | `#E6BEB2` | `230, 190, 178` | Texto secundario, de tono calido. |
| `--color-outline` | `#AD897E` | `173, 137, 126` | Borde visible, texto atenuado. |
| `--color-outline-variant` | `#5C4037` | `92, 64, 55` | Borde sutil. |
| `--color-success` | `#4CAF7D` | `76, 175, 125` | Confirmado, en stock, pagado. |
| `--color-warning` | `#F0A845` | `240, 168, 69` | Stock bajo, pendiente. |
| `--color-danger` | `#F05252` | `240, 82, 82` | Error, sin stock, anulado. |
| `--color-danger-hover` | `#C53030` | `197, 48, 48` | Rojo en hover/pressed de acciones destructivas. |
| `--color-on-danger` | `#2E0000` | `46, 0, 0` | Unico color de texto aprobado sobre el rojo solido (5.5:1). Marron oscuro, no negro puro, para no cortar con la paleta calida. |
| `--color-info` | `#4DA6FF` | `77, 166, 255` | Informativo, neutro. |
| `--color-bg` | `#131313` | `19, 19, 19` | — |
| `--color-accent` | `#FFB59E` | `255, 181, 158` | — |
| `--color-accent-hover` | `#E6A08C` | `230, 160, 140` | — |
| `--color-border` | `#5C4037` | `92, 64, 55` | — |
| `--color-text` | `#E5E2E1` | `229, 226, 225` | — |
| `--color-text-muted` | `#AD897E` | `173, 137, 126` | — |

### Escala tipografica

| Token | rem | px |
|---|---|---|
| `--text-2xs` | `0.625rem` | 10px |
| `--text-xs` | `0.75rem` | 12px |
| `--text-sm` | `0.875rem` | 14px |
| `--text-base` | `1rem` | 16px |
| `--text-lg` | `1.125rem` | 18px |
| `--text-xl` | `1.25rem` | 20px |
| `--text-2xl` | `1.5rem` | 24px |
| `--text-3xl` | `2rem` | 32px |
| `--text-4xl` | `2.5rem` | 40px |
| `--text-5xl` | `3rem` | 48px |
| `--text-6xl` | `4rem` | 64px |
| `--text-display` | `7.5rem` | 120px |
| `--text-title-page` | `clamp(2rem, 5vw, 3rem)` | NaNpx |
| `--text-title-section` | `clamp(1.75rem, 4vw, 2.5rem)` | NaNpx |
| `--text-3xl-alt` | `1.75rem` | 28px |

### Recetas tipograficas

- **`.mn-heading`** — Titulo de seccion. La firma visual de la marca.
  `font-family: 'Oswald', sans-serif · font-weight: 700 · letter-spacing: 0.05em · line-height: 1.1 · text-transform: uppercase`
- **`.mn-subheading`** — Titulo secundario, dentro de cards y bloques.
  `font-family: 'Oswald', sans-serif · font-weight: 600 · letter-spacing: 0.05em · line-height: 1.3 · text-transform: uppercase`
- **`.mn-label`** — Etiqueta pequena. Badges, overlines, estados.
  `font-family: 'Inter', sans-serif · font-size: 0.625rem · font-weight: 700 · letter-spacing: 0.1em · text-transform: uppercase`
- **`.mn-button`** — Texto de accion.
  `font-family: 'Inter', sans-serif · font-weight: 600 · letter-spacing: 0.08em · text-transform: uppercase`
- **`.mn-body`** — Texto corrido.
  `font-family: 'Inter', sans-serif · font-weight: 400 · letter-spacing: 0 · line-height: 1.6`
- **`.mn-price`** — Precio de producto. Siempre en naranja.
  `font-family: 'Oswald', sans-serif · font-weight: 700 · letter-spacing: 0 · color: #ff571a`
- **`.mn-data`** — Codigos de parte, SKU, cifras en tablas.
  `font-family: 'JetBrains Mono', monospace · font-weight: 500 · letter-spacing: 0`

<!-- tokens:end -->

---

## 3. Cómo usar el color

### Reglas duras

1. **El naranja `#FF571A` es para acción y precio.** Botones, precios, acentos. Nunca como
   fondo de un bloque grande — satura y pierde el valor de señal.
2. **Sobre naranja solo va marrón `#521300`.** Blanco sobre naranja no pasa contraste
   (ratio ~3.0:1). Está tokenizado como `--color-on-primary` justamente para que no se decida
   caso por caso.
3. **El durazno `#FFB59E` es texto, nunca fondo de botón.** Es el naranja "legible": se usa
   cuando el naranja saturado no tiene contraste suficiente sobre oscuro.
4. **Los grises salen de la escala de superficies.** Seis pasos, de `#0E0E0E` a `#353534`.
   No inventar grises intermedios y, sobre todo, **no usar grises fríos** (Zinc, Slate,
   Neutral de Tailwind). Nuestros grises son cálidos y neutros; los fríos se notan.

### Advertencia de contraste — leer antes de diseñar para redes

**La paleta es dark-only.** Fue construida para fondo `#131313` y nunca fue validada sobre claro.

| Combinación | Ratio | Veredicto |
|---|---|---|
| `#E5E2E1` sobre `#131313` | ~15.5:1 | Excelente |
| `#FFB59E` sobre `#131313` | ~9.6:1 | Excelente |
| `#FF571A` sobre `#131313` | ~4.8:1 | OK para texto grande y CTAs |
| `#521300` sobre `#FF571A` | ~5.9:1 | OK |
| `#FF571A` sobre blanco | **~3.2:1** | **Falla** para texto normal |
| `#FFB59E` sobre blanco | **~1.6:1** | **Falla** — invisible |

**Consecuencia práctica:** las piezas para redes van sobre fondo oscuro. Si una plataforma o
un formato obliga a fondo claro, el naranja solo puede usarse en bloques sólidos con texto
marrón encima, o en texto de 24px+ en bold. El durazno directamente no se usa sobre claro.

---

## 4. Cómo usar la tipografía

| Uso | Fuente | Peso | Tracking | Caso |
|---|---|---|---|---|
| Título de pieza | Oswald | 700 | 0.05em | MAYÚSCULAS |
| Subtítulo | Oswald | 600 | 0.05em | MAYÚSCULAS |
| Etiqueta / badge | Inter | 700 | 0.1em | MAYÚSCULAS |
| Cuerpo | Inter | 400 | 0 | Normal |
| Precio | Oswald | 700 | 0 | Normal, en naranja |
| Código de parte | JetBrains Mono | 500 | 0 | Normal |

Las tres son **Google Fonts gratuitas** y están disponibles en Canva, Figma, Illustrator y
Google Slides sin licenciamiento.

**Nunca:** Oswald en minúsculas para títulos · Inter para títulos de pieza · una cuarta fuente ·
tracking por defecto en un título Oswald (se ve apretado y deja de parecer nuestro).

### El acento de sección

Barra de **2px de alto × 64px de ancho**, degradado de `#FF571A` a transparente hacia la
derecha. Va arriba del título, separada por 24px. Es el único elemento decorativo del sistema
y funciona igual de bien en una pieza gráfica que en la web.

---

## 5. Fotografía de autopartes

Este es el punto más delicado: las fotos que llegan del proveedor vienen sobre fondo blanco,
con luz fría y sombras duras. Puestas sin tratar sobre nuestro fondo negro, se ven pegoteadas
y baratas.

### El objetivo

| Aspecto | Objetivo |
|---|---|
| Fondo | `#131313` a `#1C1B1B`, o degradado radial suave entre ambos |
| Luz principal | Cálida, desde arriba-izquierda, ~45° |
| Luz de acento | Naranja `#FF571A` muy tenue como rim light en un borde |
| Sombra | Suave, proyectada abajo, nunca dura ni recortada |
| Balance de blancos | Cálido — sin dominante azul |
| Encuadre | Pieza centrada, 15% de aire a cada lado |
| Saturación | Contenida. La pieza es gris/metálica; **el naranja lo aporta la marca, no el producto** |

### Regla que más se rompe

**No teñir la autoparte de naranja.** El naranja es de la marca: va en el fondo, en el rim
light, en el texto. Una pieza de motor teñida de naranja deja de leerse como el repuesto real
y el cliente no la reconoce. La foto tiene que seguir siendo una foto técnica fiel.

### Prompts para herramientas de IA

Los prompts van **en inglés** — los modelos de imagen responden bastante mejor, y los
términos técnicos de fotografía son más precisos. Reemplazar `[PIEZA]` por la descripción.

**Recortar y recomponer sobre fondo de marca**

```
Product photograph of [PIEZA], automotive spare part.
Remove the original background completely. Place the part on a deep near-black
background (#131313) with a subtle radial gradient toward #1C1B1B at the edges.
Warm key light from upper left at 45 degrees. Soft warm fill from the right.
Very subtle warm orange (#FF571A) rim light along one edge of the part, low intensity,
just enough to separate it from the background.
Soft diffused contact shadow beneath the part. No harsh shadows.
Keep the part's own colors and materials completely accurate and unmodified — do not
tint the part orange. Neutral-to-warm white balance, no blue cast.
Part centered, 15% padding on all sides. Sharp focus, high detail on textures.
Studio product photography, catalog quality, photorealistic.
```

**Mejorar una foto existente del proveedor**

```
Enhance this automotive part photograph for a premium dark catalog.
Replace the background with a deep near-black (#131313) studio backdrop.
Shift white balance warmer, remove any blue or green color cast.
Recover shadow detail, soften harsh highlights, increase micro-contrast on metal
and textured surfaces.
Add a subtle warm rim light along the top-left edge.
Preserve the part's true colors, markings, labels and part numbers exactly — this is a
technical reference image. Do not stylize, do not tint, do not remove text on the part.
```

**Fondo para pieza de redes (sin producto)**

```
Abstract dark industrial background for automotive brand social media.
Deep near-black (#131313) base with subtle darker vignette.
Faint diagonal geometric lines suggesting machined metal, very low contrast.
One narrow warm orange (#FF571A) accent streak in the lower third, soft glow, subtle.
No text, no logos, no vehicles, no parts. Clean negative space in the upper two thirds
for typography. Photorealistic, moody, industrial. Not neon, not cyberpunk.
```

**Ajustes finos que suelen hacer falta**

- Si el naranja sale demasiado protagonista: agregar `orange accent barely visible, 10% intensity`
- Si el fondo sale gris en vez de negro: agregar `background must be very dark, near black, not gray`
- Si la IA inventa detalles en la pieza: agregar `do not add or remove any features of the part`
- Si sale con look "render 3D": agregar `real photograph, not a 3D render, natural imperfections`

### Verificación antes de publicar

1. ¿El fondo es realmente `#131313`-`#1C1B1B`? (cuentagotas — la IA tiende a aclarar)
2. ¿La pieza conserva su color real, sin tinte naranja?
3. ¿Los números de parte y etiquetas siguen siendo legibles y correctos?
4. ¿El rim light naranja es sutil o gritón?
5. ¿Se ve bien en el modo oscuro **y** claro de la app donde se va a publicar?

---

## 6. Formatos de redes

| Formato | Tamaño | Uso |
|---|---|---|
| Cuadrado | 1080 × 1080 | Feed |
| Vertical | 1080 × 1350 | Feed (mejor alcance) |
| Story / Reel | 1080 × 1920 | Historias |

**Márgenes de seguridad:** 64px en todos los bordes. En stories, además **250px libres arriba
y 320px abajo** — ahí van los elementos de la interfaz de la plataforma.

**Estructura sugerida de una pieza de producto**

```
┌─────────────────────────┐
│  ▬▬▬  ← acento naranja  │
│  TÍTULO EN OSWALD       │
│                         │
│      [ foto de la       │
│        autoparte ]      │
│                         │
│  $ PRECIO (naranja)     │
│  Código · Inter mono    │
└─────────────────────────┘
```

---

## 7. Checklist final

- [ ] Fondo oscuro de la escala de superficies
- [ ] Títulos en Oswald, mayúsculas, tracking 0.05em
- [ ] Naranja reservado a precio, CTA y acento — no como fondo grande
- [ ] Sobre naranja, texto marrón `#521300`, nunca blanco
- [ ] Sin grises fríos
- [ ] La autoparte conserva su color real
- [ ] Códigos de parte legibles y correctos
- [ ] Márgenes de seguridad respetados
- [ ] Todos los hex salieron de `dist/tokens.json`, ninguno de memoria
