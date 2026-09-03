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

## Fase 2 — Web (`mnmotorhub-web`)

**Riesgo: alto.** No es una migración visualmente neutra. Leer entero antes de empezar.

### 2.1 Decisiones que hay que tomar primero

Tres cosas cambian de valor, no solo de nombre. **No se pueden resolver por búsqueda y reemplazo.**

| # | Token | Web hoy | Paquete | Efecto |
|---|---|---|---|---|
| A | `--container-max` | `100%` | `1280px` | El sitio deja de ser full-width. **Muy visible en desktop.** |
| B | `--spacing-edge` | `clamp(24px, 5vw, 72px)` | `clamp(16px, 5vw, 72px)` | 8px menos de padding lateral en móvil |
| C | 7 tamaños off-scale | ver 2.2 | escala | Texto se corre hasta 4px |

**A** es la más importante. La web puso `100%` a propósito (commit `2252a9e`). Si el diseño
full-width es intencional, la web debe **sobrescribir el token localmente** después del import,
no cambiar el paquete — el ERP sí quiere 1280px:

```css
@import '@mn/design-system/tokens.css';

:root {
  --layout-container-max: 100%;   /* la tienda es full-width por decisión de diseño */
}
```

Ese patrón —importar y sobrescribir— es el mecanismo previsto para cualquier divergencia
legítima entre productos. Lo que no es aceptable es que diverjan *sin* que esté escrito por qué.

### 2.2 Tamaños de fuente off-scale

Los 20 tamaños hardcodeados de la web: 13 caen exacto en la escala, **7 no**. Para cada uno hay
que decidir hacia dónde redondear.

| px | Archivos | Opción baja | Opción alta | Sugerido |
|---|---|---|---|---|
| `11` | `AvailabilityBadge`, `Navbar` | `--text-2xs` (10) −1 | `--text-xs` (12) +1 | **`--text-xs`** — 10px es muy chico para móvil |
| `13` | `ProductListItem`, `CategoriaCard`, `ProductCard`, `contacto` | `--text-xs` (12) −1 | `--text-sm` (14) +1 | **`--text-sm`** — `CLAUDE.md` prohíbe <14px en móvil |
| `15` | `ProductListItem`, `Navbar` | `--text-sm` (14) −1 | `--text-base` (16) +1 | **`--text-base`** |
| `22` | `PageLayout` | `--text-xl` (20) −2 | `--text-2xl` (24) +2 | `--text-xl` |
| `26` | `PageLayout` | `--text-2xl` (24) −2 | `--text-3xl` (32) +6 | `--text-2xl` |
| `28` | `Categories`, `CTABanner`, `FeaturedProducts`, `WhyUs`, `producto` | `--text-2xl` (24) −4 | `--text-3xl` (32) +4 | **revisar a ojo** — son los H2 de sección, es el cambio más visible del sitio |
| `36` | `producto/[codigoInterno]` | `--text-3xl` (32) −4 | `--text-4xl` (40) +4 | `--text-3xl` |

⚠️ **`28px` aparece en 5 archivos y son todos títulos de sección.** Cualquiera de las dos
opciones mueve la jerarquía visual de la home. Mirarlo en el navegador antes de decidir, no
elegir de la tabla.

### 2.3 Pasos

1. `npm install github:mn-motor-hub/mn-motor-hub-design-system/archive/refs/tags/v1.3.0.tar.gz`
2. En `styles/globals.css`: reemplazar el `:root` por los `@import`, más los overrides
   justificados de 2.1.
3. **Renombrar los colores en dos pasos** (por la inversión de `--color-primary`):
   `--color-primary` → `--color-primary-dim`, y recién después
   `--color-primary-container` → `--color-primary`.
4. Reemplazar los 20 `font-size` en px por tokens, según 2.2.
5. Reemplazar los 10 `rgba()` sueltos por `--overlay-*`.
6. Reemplazar el `9999px` suelto por `--radius-full`.
7. Normalizar el espaciado: los off-scale son `3 6 10 12 20 36 40`.
   **`44px` no se toca** — es el mínimo táctil, ahora `--touch-min`.
8. Convertir las **7 media queries `max-width`** a `min-width`
   (6 × `max-width: 767px`, 1 × `max-width: 479px`). Violan la regla mobile-first de `CLAUDE.md`.
9. Mover `.section-accent` y `.soon-label` de `globals.css` a componentes o a `recipes.css`.
10. QA a 375px, 768px y 1280px. Verificar que no haya scroll horizontal y que los targets
    táctiles sigan ≥44px.

### 2.4 Colores semánticos

La web hoy no tiene ninguno. Con el paquete gana `success` / `warning` / `danger` / `info`.
`AvailabilityBadge` es el primer candidato obvio: hoy resuelve estados con colores propios.

---

## Fase 3 — Primitivas (`v2.0`)

Recién cuando las dos fases anteriores estén en `main`.

Extraer de `mn-motor-hub-erp-frontend/src/components/ui/` a `@mn/design-system/ui`:
`Button` (4 variantes × 3 tamaños + loading), `Badge` (5 variantes), `Input`, `Select`,
`Modal`, `Table`, `Pagination`, `StatCard`.

El primer beneficiario es la web: hoy tiene **el botón naranja reimplementado en 4 archivos**
(`Hero`, `Navbar`, `CTABanner`, `Catalog/Pagination`).

Pendiente de resolver antes: el ERP usa Radix (`@radix-ui/react-dialog`, `-dropdown-menu`,
`-select`). Si `Modal` y `Select` se extraen tal cual, Radix pasa a ser dependencia de la web,
que hoy no lo usa. Opciones: extraer primero solo las primitivas sin Radix (`Button`, `Badge`,
`Input`, `StatCard`), o aceptar Radix en la web.

---

## Checklist de cierre

- [x] Fase 1 — ERP consumiendo el paquete
- [x] Hex hardcodeados eliminados del ERP (salvo el comprobante, a propósito)
- [x] Contraste AA en el texto sobre colores de marca
- [x] Paleta de Chakra erradicada del ERP
- [x] ERP sin un solo valor de color, tamaño o radio fuera del sistema
- [ ] Decisión tomada sobre `--layout-container-max` en la web
- [ ] Decisión tomada sobre los `28px` de la web
- [ ] Fase 2 — web consumiendo el paquete
- [ ] `max-width` erradicados de la web
- [ ] Ningún hex hardcodeado en ninguno de los dos repos
- [ ] `npm run check` en CI de los tres repos
