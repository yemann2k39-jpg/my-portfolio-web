/*
 * One-shot WebP conversion for portfolio screenshots.
 * Usage:  npm i -D sharp   then   node scripts/convert-webp.mjs
 *
 * Converts every .png/.jpg under public/images/** (excluding already-.webp)
 * to .webp at quality 80 into the SAME folder, then prints a before/after
 * size report. Originals are NOT deleted (verify in browser first, then
 * delete manually or pass --delete).
 *
 * After converting, update src/data/content.js + any JSX references:
 * replace .png/.jpg with .webp for the converted files.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(process.cwd(), 'public/images')
const DELETE = process.argv.includes('--delete')
const QUALITY = 80
let saved = 0
let count = 0

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) await walk(p)
    else if (/\.(png|jpe?g)$/i.test(e.name)) await convert(p)
  }
}

async function convert(file) {
  const out = file.replace(/\.(png|jpe?g)$/i, '.webp')
  try {
    await fs.access(out)
    console.log('skip (exists):', path.relative(ROOT, out))
    return
  } catch { /* not converted yet */ }
  const before = (await fs.stat(file)).size
  await sharp(file).webp({ quality: QUALITY }).toFile(out)
  const after = (await fs.stat(out)).size
  saved += before - after
  count++
  console.log(
    `${path.relative(ROOT, file)} -> ${path.relative(ROOT, out)}  ` +
    `${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
  )
  if (DELETE) await fs.rm(file)
}

await walk(ROOT)
console.log(`\n${count} converted. Saved ${(saved / 1024 / 1024).toFixed(2)}MB total.`)
if (!DELETE) console.log('Originals kept. Verify in browser, then delete manually or rerun with --delete.')
