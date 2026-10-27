#!/usr/bin/env node
// Asset pipeline: copy -> rename (kebab, screen+role) -> convert (SVG via svgo, PNG via sharp->WebP)
// -> dedup identical icons -> validate (no cropped SVG; WebP dims == source) -> emit old->new mapping.
//
// Usage:
//   node scripts/process-assets.mjs <screen-folder-name>     process one batch, write files + mapping
//   node scripts/process-assets.mjs <screen-folder-name> --dry   preview mapping, write nothing
//
// Source root and repo paths are fixed below.

import { promises as fs } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { optimize } from 'svgo';

const SRC_ROOT = 'C:/Users/DELL PRECISION 5530/Downloads/afriplay-ghana-assets';
const REPO = process.cwd();
const ASSETS = path.join(REPO, 'assets');
const MANIFEST = path.join(ASSETS, '.asset-manifest.json');

const DRY = process.argv.includes('--dry');
const screen = process.argv[2];
if (!screen || screen.startsWith('--')) {
  console.error('Usage: node scripts/process-assets.mjs <screen-folder-name> [--dry]');
  process.exit(1);
}

// screen folder -> short slug used as the leading name token
const SCREEN_SLUG = {
  'home-screens-desktop-1728px': 'home',
  'search-functionality-desktop': 'search',
  'shorts-desktop-feed': 'shorts-feed',
  'comment-section-desktop': 'comments',
  'shorts-desktop-playing-incoming': 'shorts-play',
  'ep-filter-desktop': 'epg',
  'edge-cases-desktop': 'search-edge',
  'search-results-desktop': 'results',
  // Mobile (added 2026-06-05)
  'home-screens-mobile': 'home-mobile',
  'search-mobile': 'search-mobile',
  'reels-mobile': 'reels-mobile',
};
// tokens dropped from section/role names (folder noise)
const STOP = new Set(['section', 'desktop', '1728px', 'png', 'svg', 'icon', 'img', 'image']);

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function buildName(relParts, base) {
  // relParts: path parts under SRC_ROOT, including screen folder + .../png|svg
  const screenFolder = relParts[0];
  const mid = relParts.slice(1, -1); // section(s), minus the png/svg leaf dir
  const tokens = [];
  const push = (str) => {
    for (const t of slug(str).split('-')) {
      if (!t || STOP.has(t)) continue;
      if (tokens[tokens.length - 1] === t) continue; // collapse adjacent dup ONLY
      // NB: do NOT drop non-adjacent dups — that corrupts titles like "vis-a-vis"
      // or drops "sweet-home" when the screen slug is already "home".
      tokens.push(t);
    }
  };
  push(SCREEN_SLUG[screenFolder] || screenFolder);
  for (const m of mid) push(m);
  push(base);
  return tokens.join('-') || 'asset';
}

function classify(ext, base, relParts) {
  const n = (relParts.join('/') + '/' + base).toLowerCase();
  if (ext === '.svg') {
    if (/illustration|ellipse/.test(n)) return 'illustrations';
    return 'icons';
  }
  // png/jpg etc.
  if (/logo/.test(n)) return 'logos';
  if (/glow|ellipse|gradient|noise/.test(n)) return 'illustrations';
  return 'images';
}

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else out.push(p);
  }
  return out;
}

async function loadManifest() {
  try { return JSON.parse(await fs.readFile(MANIFEST, 'utf8')); }
  catch { return { contentHashes: {}, targets: {} }; }
}

const svgoConfig = {
  multipass: true,
  plugins: [
    'preset-default',   // svgo v4: removeViewBox is NOT in preset-default, so viewBox is kept
    'removeDimensions', // drop width/height, keep viewBox (prevents crop/scale loss)
  ],
};

const sha1 = (buf) => createHash('sha1').update(buf).digest('hex');

async function uniqueTarget(bucket, name, ext, hash, manifest) {
  // returns { rel, status } ; status: 'new' | 'dedup' | 'rename'
  // exact-content dedup for ALL file types (byte-identical output collapses to first canonical)
  if (manifest.contentHashes[hash]) {
    return { rel: manifest.contentHashes[hash], status: 'dedup' };
  }
  let rel = `${bucket}/${name}${ext}`;
  let i = 2;
  while (manifest.targets[rel] && manifest.targets[rel] !== hash) {
    rel = `${bucket}/${name}-${i}${ext}`; // same name, different content → suffix + flag
    i++;
  }
  return { rel, status: i > 2 ? 'rename' : 'new' };
}

async function main() {
  const srcDir = path.join(SRC_ROOT, screen);
  await fs.access(srcDir).catch(() => { console.error('No such screen folder:', srcDir); process.exit(1); });
  const files = (await walk(srcDir)).filter((f) => /\.(svg|png|jpe?g)$/i.test(f));
  const manifest = await loadManifest();
  const rows = [];
  const flags = [];

  for (const abs of files.sort()) {
    const rel = path.relative(SRC_ROOT, abs).split(path.sep);
    const ext = path.extname(abs).toLowerCase();
    const base = path.basename(abs, ext);
    const bucket = classify(ext, base, rel);
    const name = buildName(rel, base);
    const srcSize = (await fs.stat(abs)).size;

    if (ext === '.svg') {
      const raw = await fs.readFile(abs, 'utf8');
      const { data } = optimize(raw, svgoConfig);
      const hasViewBox = /viewBox=/.test(data);
      if (!hasViewBox) flags.push(`⚠️ ${rel.join('/')} → NO viewBox after svgo (would crop). Original kept.`);
      const outData = hasViewBox ? data : raw; // never ship a cropped svg
      const hash = sha1(outData);
      const { rel: target, status } = await uniqueTarget(bucket, name, '.svg', hash, manifest);
      if (!DRY && status !== 'dedup') {
        await fs.mkdir(path.dirname(path.join(ASSETS, target)), { recursive: true });
        await fs.writeFile(path.join(ASSETS, target), outData);
        manifest.contentHashes[hash] = target;
        manifest.targets[target] = hash;
      }
      rows.push({ old: rel.slice(1).join('/'), neu: target, kind: 'SVG', status, src: srcSize, out: Buffer.byteLength(outData), note: hasViewBox ? '' : 'no-viewBox→orig' });
    } else {
      const img = sharp(abs);
      const meta = await img.metadata();
      const lossless = bucket === 'logos' || bucket === 'illustrations';
      const buf = await img.webp(lossless ? { lossless: true } : { quality: 82 }).toBuffer();
      // validate dims preserved
      const outMeta = await sharp(buf).metadata();
      if (outMeta.width !== meta.width || outMeta.height !== meta.height) {
        flags.push(`⚠️ ${rel.join('/')} → dim mismatch ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height}`);
      }
      const hash = sha1(buf);
      const { rel: target, status } = await uniqueTarget(bucket, name, '.webp', hash, manifest);
      if (!DRY && status !== 'dedup') {
        await fs.mkdir(path.dirname(path.join(ASSETS, target)), { recursive: true });
        await fs.writeFile(path.join(ASSETS, target), buf);
        manifest.contentHashes[hash] = target;
        manifest.targets[target] = hash;
      }
      rows.push({ old: rel.slice(1).join('/'), neu: target, kind: lossless ? 'WebP-lossless' : 'WebP-q82', status, src: srcSize, out: buf.length, note: `${meta.width}x${meta.height}` });
    }
  }

  if (!DRY) await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

  // emit mapping
  const kb = (n) => (n / 1024).toFixed(1) + 'K';
  let srcTot = 0, outTot = 0;
  console.log(`\n## Batch: ${screen}  (${rows.length} files)${DRY ? '  [DRY RUN]' : ''}\n`);
  console.log('| old | → new | kind | status | src | out | note |');
  console.log('|-----|-------|------|--------|-----|-----|------|');
  for (const r of rows) {
    srcTot += r.src; outTot += r.status === 'dedup' ? 0 : r.out;
    console.log(`| ${r.old} | ${r.neu} | ${r.kind} | ${r.status} | ${kb(r.src)} | ${r.status==='dedup'?'—':kb(r.out)} | ${r.note} |`);
  }
  console.log(`\n**Totals:** source ${kb(srcTot)} → output ${kb(outTot)}  (${(100*(1-outTot/srcTot)).toFixed(0)}% smaller)`);
  if (flags.length) { console.log('\n### FLAGS'); for (const f of flags) console.log('- ' + f); }
  else console.log('\n_No conversion flags._');
}
main().catch((e) => { console.error(e); process.exit(1); });
