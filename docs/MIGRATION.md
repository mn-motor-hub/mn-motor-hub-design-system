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

## Fase 1 — ERP (`mn-motor-hub-erp-frontend`)

**Riesgo: bajo.** Ya usa esta nomenclatura. Solo cambian 5 nombres del grupo de espaciado.

1. `npm install github:mn-motor-hub/mn-motor-hub-design-system#v1.0.0`
2. En `src/app/globals.css`, borrar el bloque `:root` completo y reemplazarlo por:
   ```css
   @import '@mn/design-system/tokens.css';
   @import '@mn/design-system/recipes.css';
   ```
3. Renombrar los 5 tokens de espaciado de la tabla de arriba.
4. Limpiar la deuda detectada en el relevamiento: **14 `#fff` y ~10 grises Zinc**
   (`#52525b`, `#18181b`, `#71717a`, `#3f3f46`, `#e4e4e7`, `#d4d4d8`, `#f4f4f5`) hardcodeados
   en los CSS Modules. Son una paleta fría ajena a la marca. Mapear a la escala de superficies
   y a `--color-on-surface`.
5. Verificar visualmente el dashboard, inventario, ventas y finanzas.

**Resultado esperado: cero cambio visual**, salvo la corrección de los grises fríos.

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

1. `npm install github:mn-motor-hub/mn-motor-hub-design-system#v1.0.0`
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

- [ ] Fase 1 — ERP consumiendo el paquete, sin cambio visual
- [ ] Grises Zinc eliminados del ERP
- [ ] Decisión tomada sobre `--layout-container-max` en la web
- [ ] Decisión tomada sobre los `28px` de la web
- [ ] Fase 2 — web consumiendo el paquete
- [ ] `max-width` erradicados de la web
- [ ] Ningún hex hardcodeado en ninguno de los dos repos
- [ ] `npm run check` en CI de los tres repos
