import fs from 'fs';
const m = await import('../src/data/content.js');
const bad = [];
const scanStr = (v, path) => {
  if (typeof v === 'string') {
    if (v.includes('; ')) bad.push([path, 'semi', v.slice(0, 60)]);
    if (v.includes('—')) bad.push([path, 'emdash', v.slice(0, 60)]);
    if (/â€|â†|Â·|Â±|â•|ðŸ/.test(v)) bad.push([path, 'moji', v.slice(0, 60)]);
    if (/\.png|\.jpg/i.test(v) && path.includes('images')) bad.push([path, 'imgext', v]);
  } else if (Array.isArray(v)) v.forEach((x, i) => scanStr(x, path + '[' + i + ']'));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => scanStr(x, path + '.' + k));
};
const rendered = ['subtitle','description','motivation','testing','learn','cover','phones','how','limits','next','learnList','features','preview','challenges','flow','stats','tags'];
for (const cs of m.caseStudies) {
  for (const k of rendered) if (cs[k] !== undefined) scanStr(cs[k], cs.slug + '.' + k);
  if (!Array.isArray(cs.features) || !cs.features.length) bad.push([cs.slug, 'nofeatures', '']);
  if (!Array.isArray(cs.preview) || !cs.preview.length) bad.push([cs.slug, 'nopreview', '']);
}
const raw = fs.readFileSync(new URL('../src/data/content.js', import.meta.url));
console.log('BOM:', raw[0] === 0xEF);
const rawText = raw.toString('utf8');
for (const f of ['src/data/content.js', 'src/pages/CaseStudy.jsx']) {
  const t = fs.readFileSync(f, 'utf8');
  const exts = t.match(/images\/[^'"\s]+\.(png|jpg)/gi);
  console.log(f, 'png/jpg refs:', exts ? exts.join(', ') : 'none');
}
scanStr(m.portrait ?? m.about?.portrait ?? '', 'portrait');
console.log('portrait in data:', m.portrait ?? '(not in content.js)');
console.log(bad.length ? bad.map(b => b.join(' | ')).join('\n') : 'CLEAN: no ; / em-dash / mojibake / png-jpg in rendered fields');
