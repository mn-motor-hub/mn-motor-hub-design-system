#!/usr/bin/env node
/**
 * Genera dist/ desde tokens/tokens.json.
 *
 *   dist/tokens.css    ->  :root con todas las CSS variables      (web + ERP)
 *   dist/recipes.css   ->  clases .mn-* de las recetas tipograficas
 *   dist/tokens.json   ->  mapa plano, resuelto                    (marca / IA / Figma)
 *   dist/tokens.js     ->  export ESM tipado                       (logica en JS/TS)
 *   dist/tokens.d.ts   ->  tipos
 *   docs/BRAND.md      ->  se inyecta la paleta entre los marcadores tokens:start/end
 *
 * Sin dependencias. Node 18+.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = JSON.parse(readFileSync(join(ROOT, 'tokens', 'tokens.json'), 'utf8'))

/* ─── 1. Aplanar el arbol a rutas ──────────────────────────────── */

/** { "color.primary": "#ff571a", "color.primary.hover": "#d63f00", ... } */
const flat = {}

function walk(node, path) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('_')) continue
    // DEFAULT toma el nombre del grupo: color.primary.DEFAULT -> color.primary
    const next = key === 'DEFAULT' ? path : [...path, key]
    if (typeof value === 'string') flat[next.join('.')] = value
    else if (value && typeof value === 'object') walk(value, next)
  }
}
walk(src.tokens, [])

/* ─── 2. Resolver referencias {ruta.al.token} ──────────────────── */

const REF = /^\{([^}]+)\}$/

function resolve(path, seen = new Set()) {
  const raw = flat[path]
  if (raw === undefined) throw new Error(`Token inexistente: ${path}`)
  const match = REF.exec(raw.trim())
  if (!match) return raw
  const target = match[1]
  if (seen.has(path)) throw new Error(`Referencia circular en ${path}`)
  return resolve(target, new Set(seen).add(path))
}

/** Nombre de CSS variable: color.primary.hover -> --color-primary-hover */
const cssVar = (path) => '--' + path.split('.').join('-')

const resolved = {}   // ruta -> valor literal
const cssValue = {}   // ruta -> valor CSS (mantiene var(--x) para las referencias)

for (const path of Object.keys(flat)) {
  resolved[path] = resolve(path)
  const match = REF.exec(flat[path].trim())
  cssValue[path] = match ? `var(${cssVar(match[1])})` : flat[path]
}

/* ─── 3. dist/tokens.css ───────────────────────────────────────── */

const GROUP_TITLES = {
  color: 'Color',
  overlay: 'Overlays',
  font: 'Familias tipograficas',
  text: 'Escala tipografica',
  weight: 'Pesos',
  tracking: 'Letter spacing',
  leading: 'Line height',
  space: 'Espaciado',
  layout: 'Layout',
  radius: 'Radios',
  shadow: 'Sombras',
  touch: 'Touch targets',
  breakpoint: 'Breakpoints (solo lectura desde JS: las media queries no aceptan var())',
}

const byGroup = new Map()
for (const path of Object.keys(flat)) {
  const group = path.split('.')[0]
  if (!byGroup.has(group)) byGroup.set(group, [])
  byGroup.get(group).push(path)
}

// Las referencias deben declararse despues de su objetivo dentro del mismo bloque.
function orderGroup(paths) {
  const plain = paths.filter((p) => !REF.test(flat[p].trim()))
  const refs = paths.filter((p) => REF.test(flat[p].trim()))
  return [...plain, ...refs]
}

const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length))

let css = `/* MN Motor Hub — Design Tokens v${src.version}
 * GENERADO por tokens/build.mjs. No editar a mano.
 */

:root {
`
for (const [group, paths] of byGroup) {
  css += `\n  /* ${GROUP_TITLES[group] ?? group} */\n`
  for (const path of orderGroup(paths)) {
    css += `  ${pad(cssVar(path) + ':', 32)}${cssValue[path]};\n`
  }
}
css += `}\n`

writeFileSync(join(ROOT, 'dist', 'tokens.css'), css)

/* ─── 4. dist/recipes.css ──────────────────────────────────────── */

const CSS_PROPS = [
  'font-family', 'font-size', 'font-weight', 'letter-spacing',
  'line-height', 'text-transform', 'color',
]

let recipesCss = `/* MN Motor Hub — Recetas tipograficas v${src.version}
 * GENERADO por tokens/build.mjs. No editar a mano.
 * Requiere tokens.css importado antes.
 */
`
for (const [name, recipe] of Object.entries(src.recipes)) {
  if (name.startsWith('_')) continue
  recipesCss += `\n/* ${recipe.description ?? name} */\n.mn-${name} {\n`
  for (const prop of CSS_PROPS) {
    if (!(prop in recipe)) continue
    const match = REF.exec(String(recipe[prop]).trim())
    recipesCss += `  ${pad(prop + ':', 18)}${match ? `var(${cssVar(match[1])})` : recipe[prop]};\n`
  }
  recipesCss += `}\n`
}
writeFileSync(join(ROOT, 'dist', 'recipes.css'), recipesCss)

/* ─── 5. dist/tokens.json ──────────────────────────────────────── */

const jsonOut = {
  version: src.version,
  tokens: Object.fromEntries(
    Object.keys(flat).sort().map((path) => [
      path,
      { var: cssVar(path), value: resolved[path], description: src.meta[path] ?? null },
    ]),
  ),
  recipes: Object.fromEntries(
    Object.entries(src.recipes)
      .filter(([name]) => !name.startsWith('_'))
      .map(([name, recipe]) => [
        name,
        Object.fromEntries(
          Object.entries(recipe).map(([prop, value]) => {
            const match = REF.exec(String(value).trim())
            return [prop, match ? resolved[match[1]] : value]
          }),
        ),
      ]),
  ),
}
writeFileSync(join(ROOT, 'dist', 'tokens.json'), JSON.stringify(jsonOut, null, 2) + '\n')

/* ─── 6. dist/tokens.js + .d.ts ────────────────────────────────── */

const jsEntries = Object.keys(flat).sort()
  .map((path) => `  ${JSON.stringify(path)}: ${JSON.stringify(resolved[path])},`)
  .join('\n')

writeFileSync(
  join(ROOT, 'dist', 'tokens.js'),
  `// GENERADO por tokens/build.mjs. No editar a mano.\n` +
  `export const version = ${JSON.stringify(src.version)}\n\n` +
  `export const tokens = {\n${jsEntries}\n}\n\n` +
  `/** Nombre de CSS variable de un token: cssVar('color.primary') -> '--color-primary' */\n` +
  `export const cssVar = (path) => '--' + path.split('.').join('-')\n\n` +
  `export default tokens\n`,
)

writeFileSync(
  join(ROOT, 'dist', 'tokens.d.ts'),
  `// GENERADO por tokens/build.mjs. No editar a mano.\n` +
  `export declare const version: string\n` +
  `export declare const tokens: Record<TokenPath, string>\n` +
  `export declare const cssVar: (path: TokenPath) => string\n` +
  `export type TokenPath =\n` +
  jsEntries.split('\n').map((l) => `  | ${l.trim().split(':')[0]}`).join('\n') + '\n' +
  `declare const _default: Record<TokenPath, string>\n` +
  `export default _default\n`,
)

/* ─── 7. Inyectar la paleta en docs/BRAND.md ───────────────────── */

const brandPath = join(ROOT, 'docs', 'BRAND.md')
if (existsSync(brandPath)) {
  const START = '<!-- tokens:start -->'
  const END = '<!-- tokens:end -->'
  const brand = readFileSync(brandPath, 'utf8')
  const from = brand.indexOf(START)
  const to = brand.indexOf(END)

  if (from !== -1 && to !== -1) {
    const hexOnly = (v) => /^#[0-9a-f]{6}$/i.test(v)
    const toRgb = (hex) => {
      const n = parseInt(hex.slice(1), 16)
      return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
    }

    let block = `\n> Generado desde \`tokens/tokens.json\` v${src.version}. No editar a mano.\n\n`
    block += `### Paleta\n\n| Token | HEX | RGB | Rol |\n|---|---|---|---|\n`
    for (const path of Object.keys(flat).filter((p) => p.startsWith('color.'))) {
      const value = resolved[path]
      if (!hexOnly(value)) continue
      block += `| \`${cssVar(path)}\` | \`${value.toUpperCase()}\` | \`${toRgb(value)}\` | ${src.meta[path] ?? '—'} |\n`
    }

    block += `\n### Escala tipografica\n\n| Token | rem | px |\n|---|---|---|\n`
    for (const path of Object.keys(flat).filter((p) => p.startsWith('text.'))) {
      const rem = parseFloat(resolved[path])
      block += `| \`${cssVar(path)}\` | \`${resolved[path]}\` | ${rem * 16}px |\n`
    }

    block += `\n### Recetas tipograficas\n\n`
    for (const [name, recipe] of Object.entries(jsonOut.recipes)) {
      const specs = Object.entries(recipe)
        .filter(([prop]) => prop !== 'description')
        .map(([prop, value]) => `${prop}: ${value}`)
        .join(' · ')
      block += `- **\`.mn-${name}\`** — ${recipe.description ?? ''}\n  \`${specs}\`\n`
    }
    block += '\n'

    writeFileSync(brandPath, brand.slice(0, from + START.length) + block + brand.slice(to))
  }
}

/* ─── Resumen ──────────────────────────────────────────────────── */

console.log(`MN Design System v${src.version}`)
console.log(`  ${Object.keys(flat).length} tokens · ${Object.keys(jsonOut.recipes).length} recetas`)
console.log(`  -> dist/tokens.css, dist/recipes.css, dist/tokens.json, dist/tokens.js, dist/tokens.d.ts`)
console.log(`  -> docs/BRAND.md (paleta inyectada)`)
