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
dist/tokens.css         →  :root con 106 CSS variables
dist/recipes.css        →  clases .mn-heading, .mn-label, .mn-price…
dist/tokens.json        →  mapa plano resuelto, con descripciones
dist/tokens.js + .d.ts  →  import tipado para lógica en JS/TS
docs/BRAND.md           →  guía de marca (paleta inyectada automáticamente)

ui/                     →  primitivas React (NO generadas, se editan a mano)
```

**`dist/` es generado y está commiteado a propósito** — así los consumidores instalan por git
sin necesitar un paso de build. Nunca editarlo a mano: `npm run build` lo sobrescribe.

---

## Instalar en un proyecto

```bash
npm install https://github.com/mn-motor-hub/mn-motor-hub-design-system/archive/refs/tags/v2.0.0.tar.gz
```

Se instala por **tarball del tag**, no por `github:` ni `git+ssh`. npm normaliza los URLs de
GitHub a SSH, y Vercel no tiene llave SSH: el deploy falla con `Permission denied (publickey)`.
El tarball baja por HTTPS plano, sin git y sin auth.

El tag va explícito en el URL. Apuntar a un branch significaría que un cambio de token puede
llegar a producción sin que lo pidas.

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

### Primitivas React

Requiere una línea en `next.config.ts` del consumidor, porque el paquete se distribuye como
fuente (`.tsx` + CSS Modules) y Next no transpila `node_modules` por defecto:

```ts
const nextConfig: NextConfig = {
  transpilePackages: ['@mn/design-system'],
}
```

Después:

```tsx
import { Button, Badge, Input, Table, Thead, Tbody, Tr, Th, Td, Pagination, StatCard }
  from '@mn/design-system/ui'

<Button variant="primary">Ver catálogo</Button>
<Badge variant="success">En stock</Badge>
```

**`Button`** — `variant`: `primary` (naranja de marca) · `accent` (durazno) · `danger` · `ghost`.
`size`: `sm` · `md` · `lg`. Más `loading`.

⚠️ **`size="sm"` es el único que libera el mínimo táctil de 44px.** Existe para tablas densas de
escritorio; no usarlo en superficies touch.

**`Badge`** — `variant`: `success` · `warning` · `danger` · `info` · `neutral`.

`Modal` y `Select` **no** están en el paquete: dependen de Radix, que solo el ERP usa. Viven
ahí hasta que haya un segundo consumidor que los necesite.

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
5. **Ningún `rgba()` con números literales.** Para transparencia, usar el triplete:
   ```css
   background: rgba(var(--color-primary-rgb), 0.2);
   ```
   Si el color que necesitás con alpha no tiene variante `-rgb`, agregalo a `rgbVariants`
   en `tokens/tokens.json`. El build valida que la ruta exista y que sea un hex.

---

## Modificar un token

```bash
# 1. editar tokens/tokens.json
npm run build          # regenera dist/ y la paleta de docs/BRAND.md
git commit -am "feat(tokens): ..."
git tag v1.3.0
git push --follow-tags

# 2. en cada consumidor
npm install github:mn-motor-hub/mn-motor-hub-design-system#v1.3.0
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
- [x] **v1.2** — `--color-danger-hover` y `--color-on-danger`
- [x] **Fase 1** — ERP migrado, sin hex hardcodeados y con contraste AA
- [x] **v1.4** — Tokens fluidos de título
- [x] **Fase 2** — Web migrada, mobile-first y sin literales
- [x] **v2.0** — `@mn/design-system/ui`: Button, Badge, Input, StatCard, Table, Pagination
- [x] **Fase 3** — ERP y web consumiendo las primitivas compartidas
- [ ] Paleta validada para fondo claro, si la marca la necesita para redes
