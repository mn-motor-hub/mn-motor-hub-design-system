# Plan de migración

Cómo llevar los dos repos consumidores a `@mn/design-system` sin romper producción.

**Orden deliberado:** primero el ERP, que es casi gratis, y después la web, que es la costosa.
Así el paquete queda validado en un consumidor real antes de tocar la tienda pública.

---

## Nomenclatura adoptada

Se adoptaron los nombres del **ERP** (funcionales). La web usaba nombres Material 3
heredados de Stitch (`*-container`), con solo 17 CSS Modules escritos contra ellos, contra
68 del ERP. La paleta física no cambia: **son los mismos colores con otro nombre.**

| Antes (web) | Antes (ERP) | Ahora | Valor |
|---|---|---|---|
| `--color-primary` | `--color-primary-dim` | `--color-primary-dim` | `#ffb59e` |
| `--color-primary-container` | `--color-primary` | `--color-primary` | `#ff571a` |
| `--color-on-primary-container` | `--color-on-primary` | `--color-on-primary` | `#521300` |
| `--color-surface` | `--color-background` | `--color-background` | `#131313` |
| — | `--color-surface` | `--color-surface` | `#201f1f` |
| `--spacing-base` | `--spacing-base` | `--space-sm` | `8px` |
| `--spacing-gutter` | `--spacing-gutter` | `--space-lg` | `24px` |
| `--spacing-section` | `--spacing-section` | `--layout-section` | `80px` |
| `--spacing-edge` | `--spacing-edge` | `--layout-edge` | `clamp(16px, 5vw, 72px)` |
| `--container-max` | `--container-max` | `--layout-container-max` | `1280px` |

⚠️ **`--color-primary` significa lo opuesto que antes en la web.** Un reemplazo textual
ingenuo produce un sitio con botones color durazno. Renombrar en dos pasos, con un nombre
temporal, o revisar cada uno de los 32 usos.

---

## Fase 1 — ERP (`mn-motor-hub-erp-frontend`) ✅ COMPLETADA

Rama `feat/design-system-tokens`, commit `a0e3873`. Build y typecheck en verde,
verificado en la app corriendo.

**Riesgo estimado: bajo.** Se cumplió, salvo por un hallazgo de contraste (ver 1.3).

1. `npm install github:mn-motor-hub/mn-motor-hub-design-system/archive/refs/tags/v1.3.0.tar.gz`
2. En `src/app/globals.css`, borrar el bloque `:root` completo y reemplazarlo por:
   ```css
   @import '@mn/design-system/tokens.css';
   @import '@mn/design-system/recipes.css';
   ```
3. Renombrar los 5 tokens de espaciado de la tabla de arriba.
4. Limpiar los hex hardcodeados. **Cero hex fuera del comprobante.**
5. Verificar visualmente.

### 1.1 Corrección al relevamiento — `comprobante.module.css`

El relevamiento contó 15 grises Zinc de este archivo como "paleta fría que se coló".
**Era un error.** El archivo abre con un comentario explícito: es un documento imprimible con
fondo blanco fijo a propósito, independiente del tema oscuro, y tiene su `@media print`.

Quedó **intacto**. Si algún día se quiere tokenizar, necesita su propio set de tokens de
impresión / light, no los tokens dark del paquete.

### 1.2 Tokens agregados al paquete durante la migración

Dos valores del ERP no tenían token. Se agregaron en la fuente, no en el consumidor:

| Token | Valor | Versión | Motivo |
|---|---|---|---|
| `--color-danger-hover` | `#c53030` | v1.1.0 | Hover del botón destructivo, hardcodeado |
| `--color-on-danger` | `#2e0000` | v1.2.0 | No había texto legible sobre el rojo sólido |

### 1.3 Contraste — el único cambio visual

El texto sobre los colores de marca era `#fff` hardcodeado en 8 lugares, y fallaba WCAG AA
en todos. Aprobado y aplicado:

| Par | Antes | Ahora |
|---|---|---|
| `Button.primary` sobre durazno `#ffb59e` | **1.70** | **8.51** |
| `Button.secondary` sobre naranja `#ff571a` | 3.17 | **4.57** |
| `Button.danger` sobre rojo `#f05252` | 3.26 | **5.41** |

`Table.thead`, `inventario` y 3 CTAs del flujo de importación siguen el mismo cambio.
Todas las acciones primarias del ERP pasan de texto blanco a marrón oscuro.

### 1.4 Paleta de Chakra UI filtrada — RESUELTA

El relevamiento original solo buscó hex en el ERP, no `rgba()`. Había **47 `rgba()` literales**,
y dentro de ellos **8 colores que no pertenecen a la paleta** — un carmín, dos azules marinos y
los verde/amarillo/rojo/azul/gris de Chakra UI.

Lo peor no era la cantidad sino dónde estaban: **`Badge` tenía las 5 variantes con fondo Chakra**
y el texto con el token correcto, y el focus ring de `Input` era carmín.

Resuelto en `d774dec`. Mapeo aplicado:

| Literal | Era | Ahora |
|---|---|---|
| `56, 161, 105` | verde Chakra | `--color-success-rgb` |
| `214, 158, 46` | amarillo Chakra | `--color-warning-rgb` |
| `229, 62, 62` | rojo Chakra | `--color-danger-rgb` |
| `49, 130, 206` | azul Chakra | `--color-info-rgb` |
| `113, 128, 150` | gris azulado Chakra | `--color-outline-rgb` |
| `233, 69, 96` | carmín | `--color-primary-rgb` |
| `26, 26, 46` | navy | `--color-surface-lowest-rgb` |
| `22, 33, 62` | navy 2 | `--color-surface-low-rgb` |

Los otros 35 ya eran colores de la paleta escritos a mano: se tokenizaron sin cambio visual.

Para que un token pudiera vivir dentro de `rgba()` hizo falta **v1.3.0**, que emite variantes
`-rgb` (`--color-primary-rgb: 255, 87, 26`) declaradas en `rgbVariants`.

### 1.5 Instalación — por qué tarball y no `github:`

El primer deploy a Vercel falló con `Permission denied (publickey)`. npm normaliza cualquier URL
de GitHub a `git+ssh://git@github.com/...`, y Vercel no tiene llave SSH de la organización.

Se resolvió haciendo el repo del design system **público** (son tokens de diseño y una guía de
marca: sin secretos, y los colores ya viajan en el CSS del sitio público) e instalando por
**tarball del tag**:

```
https://github.com/mn-motor-hub/mn-motor-hub-design-system/archive/refs/tags/v1.3.0.tar.gz
```

npm respeta ese URL literal y lo baja por HTTPS plano, sin git y sin auth. Es también el motivo
por el que `dist/` se commitea: el tarball no ejecuta `prepare`, así que el paquete tiene que
venir ya construido.

⚠️ **La Fase 2 debe usar la misma forma de instalación.** Un `npm install github:...` vuelve a
romper el deploy.

### 1.6 Estado final del ERP

Fuera de `comprobante.module.css`, que queda intacto a propósito:

| Métrica | Antes | Ahora |
|---|---|---|
| Hex hardcodeados | 19 | **0** |
| `rgba()` literales | 47 | **0** |
| `font-size` sin token | 8 | **0** |
| Contraste AA en texto sobre marca | falla en 8 | **cumple** |

---

## Fase 2 — Web (`mnmotorhub-web`) ✅ COMPLETADA

Commit `85b2099` en `main`. Build y typecheck en verde, verificado a 375px y 1920px.

Las dos decisiones abiertas se resolvieron **midiendo en el sitio real**, no eligiendo de una
tabla. Las dos veces el dato contradijo lo que este documento asumia.

### 2.1 Ancho de pagina — el token importaba menos de lo previsto

Este plan decia que `--container-max: 100%` hacia la web full-width. **Falso:** la home nunca
uso el token. Cada seccion va a ancho completo por su propio CSS; el token solo gobernaba
`PageLayout` y la pagina de producto.

Medido a 1920px con el estado anterior:

| Elemento | Antes | Ahora |
|---|---|---|
| Parrafo de seccion | 1761px — **~220 caracteres por linea** | 1136px — ~142 |
| Cards de producto | 422px cada una | 266px |
| Hero band de `PageLayout` | 1761px | 1280px |

Lo legible son 45–75 caracteres. El full-width no era una decision de diseno defendible, asi
que se adopto `1280px` **y ademas** se aplico el container a las 8 secciones que llevan el
padding de borde. Las grillas son `repeat(N, 1fr)`, no `auto-fill`: no se perdio ninguna columna.

Pendiente menor: 142 caracteres por linea sigue por encima del ideal. Los subtitulos de seccion
convendria que tengan su propia medida (`max-width` en `ch`), como ya hace el subtitulo del Hero.

### 2.2 Titulos — 28px no era redondeable

Este plan proponia redondear los 28px a `--text-2xl` (24) o `--text-3xl` (32). **Medido a 375px,
a 32px tres de los cuatro titulos de la home se parten en dos renglones.** Y 28px no era el
tamano de escritorio: era el override de movil de un par 40/28 escrito con `max-width`.

Se resolvio con tokens fluidos (v1.4.0), que conservan exactos los dos extremos y eliminan el
salto:

| Token | Valor | Reemplaza |
|---|---|---|
| `--text-title-page` | `clamp(2rem, 5vw, 3rem)` | 48px + override movil 32px |
| `--text-title-section` | `clamp(1.75rem, 4vw, 2.5rem)` | 40px + override movil 28px |

Verificado a 375px: dan 32px y 28px, identico al estado anterior.

### 2.3 Mobile-first

Las **7 media queries `max-width`** quedaron erradicadas. Cinco eran los saltos de titulo, que
los tokens fluidos hacen innecesarios; las otras dos (`.cardWide`, `.scheduleRow`) se invirtieron
a `min-width`.

### 2.4 Hallazgos no previstos

- **`not-found.tsx` era todo inline styles**, prohibidos por `CLAUDE.md`. Como el script de
  renombre solo recorria `.css`, su `var(--color-primary)` se habria dado vuelta en silencio de
  durazno a naranja. Convertido a CSS Module.
- **El area tactil manda sobre la escala de espaciado.** El boton de menu mobile tenia
  `padding: 10px` (44px de alto); normalizarlo a `--space-sm` (8px) lo dejaba en 40px. Lleva
  `min-height: var(--touch-min)`. Medido contra `main`, la cantidad de targets bajo 44px quedo
  igual que antes: **18, todas preexistentes**.
- `npm run lint` de la web esta roto de antes: el script es `next lint`, que Next 16 elimino.

### 2.5 Estado final de la web

| Metrica | Antes | Ahora |
|---|---|---|
| Hex hardcodeados | 10 | **0** |
| `rgba()` literales | 10 | **0** |
| `font-size` literales | 76 | **0** |
| Espaciado literal | 88 | **0** |
| Media queries `max-width` | 7 | **0** |
| Inline styles en TSX | 4 | **0** |

---

## Fase 3 — Primitivas (`v2.0.0`) ✅ COMPLETADA

ERP `3ee5abf`, web `e77c2dc`. Build y typecheck en verde en los dos.

Extraidas al subpath `@mn/design-system/ui`: **Button, Badge, Input, StatCard, Table,
Pagination**. `Modal`, `Select`, `InfoPopover` y `ScrollToBottomButton` se quedan en el ERP:
dependen de Radix y de portales que solo ese repo usa.

El paquete se distribuye como fuente, asi que cada consumidor necesita
`transpilePackages: ['@mn/design-system']` en su `next.config.ts`.

### 3.1 Correccion — la web no tenia "el boton naranja en 4 archivos"

Este documento afirmaba que la web reimplementaba el boton naranja cuatro veces. **Era falso**,
y el error venia de haber contado por `grep` de `background: var(--color-primary-container)`
sin mirar que elemento era cada uno:

| Archivo | Lo que realmente es |
|---|---|
| `Navbar` | El **badge del carrito** (18px, `position: absolute`). No es un boton. |
| `Hero` | Dos `<Link>` de marketing, Oswald display en mayusculas |
| `CTABanner` | Otro `<Link>` de marketing |
| `Catalog/Pagination` | Un control de paginacion — **este si** era un duplicado real |

Los CTA de marketing **no se migraron a propósito**. Son `<Link>` con tipografia display, no
botones de UI; forzarlos dentro de la primitiva los haria parecer botones de dashboard. Ya
consumian tokens correctamente desde la Fase 2.

La duplicacion real de la web era **una**, no cuatro: `Pagination`.

### 3.2 Button — renombre de variantes

En el ERP `primary` era el durazno y `secondary` el naranja, al reves de lo que espera una
tienda cuyo CTA principal es naranja.

| Ahora | Color | Antes en el ERP | Llamadas migradas |
|---|---|---|---|
| `primary` | naranja `#ff571a` | `secondary` | 3 |
| `accent` | durazno `#ffb59e` | `primary` (era el default) | 16 |
| `danger` | rojo | igual | — |
| `ghost` | transparente | igual | — |

Los colores no cambiaron, solo los nombres. **Cero cambio visual por el renombre.**

### 3.3 Touch target — el unico cambio visual

Los tamanos del Button venian de un dashboard de escritorio y estaban por debajo del minimo
que exige `CLAUDE.md`:

| Tamano | Antes | Ahora |
|---|---|---|
| `sm` | ~22px | ~22px — **unico que libera el minimo**, para tablas densas |
| `md` (default) | ~30px | **44px** |
| `lg` | ~50px | ~50px |

Los 35 botones `md`/`ghost` del ERP crecen 14px. Era necesario: la primitiva ahora es tambien
el boton de una tienda mobile-first.

### 3.4 Lo que atajo el type checker

El script que migro las variantes usaba una regex `variant="([a-z]+)"`, que no reconoce un
valor dinamico. En `ActivarDesactivarButton.tsx` habia
`variant={activo ? 'danger' : 'primary'}`, asi que le inyecto un segundo `variant="accent"`.

`tsc` lo marco como atributo duplicado antes de llegar a ningun lado. Corregido a mano, y el
ternario paso a `'accent'` para conservar el durazno.

**Leccion para la Fase 4:** una migracion por regex sobre JSX necesita `tsc` como red, no como
formalidad.

### 3.5 Ganancia de la web

- `Pagination` local (52 lineas + 42 de CSS) eliminada. La compartida trae paginas numeradas
  con elipsis, `rel="prev"` y preserva filtros con valores multiples.
- `AvailabilityBadge` pierde sus estilos propios y envuelve el `Badge` compartido. El badge de
  stock pasa de durazno a verde: el sistema define `--color-success` como "confirmado, en
  stock, pagado", asi que el durazno contradecia su propia semantica y el ERP ya usaba verde.

---

## Checklist de cierre

- [x] Fase 1 — ERP consumiendo el paquete
- [x] Hex hardcodeados eliminados del ERP (salvo el comprobante, a propósito)
- [x] Contraste AA en el texto sobre colores de marca
- [x] Paleta de Chakra erradicada del ERP
- [x] ERP sin un solo valor de color, tamaño o radio fuera del sistema
- [x] Fase 2 — web consumiendo el paquete
- [x] `max-width` erradicados de la web
- [x] Ningún hex hardcodeado en ninguno de los dos repos
- [x] Fase 3 — primitivas compartidas en `@mn/design-system/ui`
- [x] `Button` con mínimo táctil de 44px
- [ ] Medida (`ch`) en los subtítulos de sección de la home
- [ ] `Modal` y `Select` (esperan un segundo consumidor que necesite Radix)
- [ ] Los 18 touch targets bajo 44px de la web (preexistentes)
- [ ] `npm run lint` de la web (script `next lint`, eliminado en Next 16)
- [ ] Decisión tomada sobre `--layout-container-max` en la web
- [ ] Decisión tomada sobre los `28px` de la web
- [ ] Fase 2 — web consumiendo el paquete
- [ ] `max-width` erradicados de la web
- [ ] Ningún hex hardcodeado en ninguno de los dos repos
- [ ] `npm run check` en CI de los tres repos
