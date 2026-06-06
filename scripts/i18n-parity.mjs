// =========================================================================
// i18n-parity.mjs — verify all 5 locale files share an IDENTICAL key set.
// en.json is the canonical contract. Reports missing/extra keys per locale,
// plus a count of [[TRANSLATE]] markers still pending. Exit 1 on any drift.
//   node scripts/i18n-parity.mjs
// =========================================================================
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const i18nDir = join(here, '..', 'src', 'i18n');
const locales = ['en', 'de', 'fr', 'es', 'pl'];

/** Flatten an object into dotted leaf paths (arrays indexed numerically). */
function flatten(obj, prefix = '', out = new Set()) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else {
    out.add(prefix);
  }
  return out;
}

const data = {};
for (const loc of locales) {
  data[loc] = JSON.parse(readFileSync(join(i18nDir, `${loc}.json`), 'utf8'));
}

const ref = [...flatten(data.en)].sort();
const refSet = new Set(ref);

let drift = 0;
console.log(`Reference (en): ${ref.length} keys\n`);

for (const loc of locales) {
  if (loc === 'en') continue;
  const keys = flatten(data[loc]);
  const missing = ref.filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !refSet.has(k));
  const translate = [...keys].filter((k) => {
    // resolve leaf value to detect [[TRANSLATE]] markers
    return /\[\[TRANSLATE\]\]/.test(JSON.stringify(getByPath(data[loc], k)));
  });

  const ok = missing.length === 0 && extra.length === 0;
  console.log(`${loc}: ${keys.size} keys — ${ok ? 'PARITY OK' : 'DRIFT'} | pending [[TRANSLATE]]: ${translate.length}`);
  if (missing.length) {
    drift += missing.length;
    console.log(`  MISSING (${missing.length}):`);
    missing.forEach((k) => console.log(`    - ${k}`));
  }
  if (extra.length) {
    drift += extra.length;
    console.log(`  EXTRA (${extra.length}):`);
    extra.forEach((k) => console.log(`    + ${k}`));
  }
}

// Resolve a flattened path like "a.b[0].c" back to its value.
function getByPath(obj, path) {
  const tokens = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur = obj;
  for (const t of tokens) {
    if (cur == null) return undefined;
    cur = cur[t];
  }
  return cur;
}

console.log('');
if (drift === 0) {
  console.log('RESULT: 0 differences — all 5 locales share an identical key set.');
  process.exit(0);
} else {
  console.log(`RESULT: ${drift} key differences across locales.`);
  process.exit(1);
}
