# @mn/design-system

Design system de **MN Motor Hub**. Fuente única de color, tipografía, espaciado y forma para:

| Consumidor | Qué usa |
|---|---|
| [`mnmotorhub-web`](https://github.com/mn-motor-hub/mnmotorhub-web) — tienda pública | `tokens.css` · `recipes.css` |
| [`mn-motor-hub-erp-frontend`](https://github.com/mn-motor-hub/mn-motor-hub-erp-frontend) — ERP interno | `tokens.css` · `recipes.css` |
| Marca / redes / herramientas de IA | `docs/BRAND.md` · `dist/tokens.json` |

---

## Cómo funciona

```
tokens/tokens.json      ←  FUENTE DE VERDAD. Lo único que se edita a mano.
        │
        │  npm run build
        ▼
dist/tokens.css         →  :root con 90 CSS variables
dist/recipes.css        →  clases .mn-heading, .mn-label, .mn-price…
dist/tokens.json        →  mapa plano resuelto, con descripciones
dist/tokens.js + .d.ts  →  import tipado para lógica en JS/TS
docs/BRAND.md           →  guía de marca (paleta inyectada automáticamente)
```

**`dist/` es generado y está commiteado a propósito** — así los consumidores instalan por git
sin necesitar un paso de build. Nunca editarlo a mano: `npm run build` lo sobrescribe.

---

## Instalar en un proyecto

```bash
npm install github:mn-motor-hub/mn-motor-hub-design-system#v1.0.0
```

Fijar siempre un tag. Apuntar a `#main` significa que un cambio de token puede llegar a
producción sin que lo pidas.

### CSS

En el `globals.css` del proyecto, **antes** de cualquier otra regla:

```css
@import '@mn/design-system/tokens.css';
@import '@mn/design-system/recipes.css';  /* opcional */
```

Y a partir de ahí, en cualquier CSS Module:

```css
.cta {
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-size: var(--text-base);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  min-height: var(--touch-min);
}
```

### Recetas tipográficas

Para no repetir la combinación Oswald + uppercase + tracking en cada componente:

```tsx
<h2 className="mn-heading">Repuestos de motor</h2>
<span className="mn-price">$ 45,00</span>
```

### JS / TS

Cuando un valor tiene que existir fuera del CSS — un `<meta name="theme-color">`, un color de
serie de Recharts, un canvas:

```ts
import { tokens } from '@mn/design-system'

tokens['color.primary']       // '#ff571a'
tokens['breakpoint.md']       // '768px'
```

`TokenPath` es una unión literal de todas las rutas: un token mal escrito no compila.

---

## Reglas

1. **Ningún hex hardcodeado** en los repos consumidores. Si falta un color, se agrega acá.
2. **Ningún `font-size` en px** en CSS Modules. Sale de la escala `--text-*`.
3. **Breakpoints con `min-width`.** Los valores están en `--breakpoint-*` para leer desde JS,
   pero las media queries de CSS no aceptan `var()` — se escriben literales:
   `@media (min-width: 768px)`.
4. **`--touch-min` (44px) no es espaciado.** Es el mínimo de área táctil. No redondearlo a la
   escala de `--space-*`.

---

## Modificar un token

```bash
# 1. editar tokens/tokens.json
npm run build          # regenera dist/ y la paleta de docs/BRAND.md
git commit -am "feat(tokens): ..."
git tag v1.1.0
git push --follow-tags

# 2. en cada consumidor
npm install github:mn-motor-hub/mn-motor-hub-design-system#v1.1.0
```

`npm run check` regenera y falla si `dist/` quedó desincronizado del JSON — útil en CI para
evitar que alguien commitee una edición manual de `dist/`.

### Versionado

| Cambio | Bump |
|---|---|
| Token nuevo | minor |
| Cambio de valor de un token existente | **major** — es un cambio visual en ambos productos |
| Token eliminado o renombrado | **major** |
| Corrección de docs | patch |

---

## Documentación

| Archivo | Contenido |
|---|---|
| [`docs/BRAND.md`](docs/BRAND.md) | Guía de marca: paleta, tipografía, fotografía de autopartes, prompts de IA, formatos de redes |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Relevamiento del estado previo y decisiones de reconciliación |
| [`docs/MIGRATION.md`](docs/MIGRATION.md) | Plan de migración de los dos repos consumidores |

---

## Roadmap

- [x] **v1.0** — Tokens, recetas tipográficas, guía de marca
- [ ] **v1.1** — Migrar el ERP a consumir el paquete
- [ ] **v1.2** — Migrar la web (requiere decidir los 7 tamaños off-scale, ver `MIGRATION.md`)
- [ ] **v2.0** — `@mn/design-system/ui`: primitivas React extraídas del ERP (Button, Badge, Input, Select, Modal, Table)
- [ ] Paleta validada para fondo claro, si la marca la necesita para redes
