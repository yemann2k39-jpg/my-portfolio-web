const fs = require('fs');
const t = fs.readFileSync('src/data/content.js', 'utf8').split(/\r?\n/);
let inS = null, prev = '';
const stack = [];
for (let i = 0; i < t.length; i++) {
  const L = t[i];
  for (let j = 0; j < L.length; j++) {
    const c = L[j];
    if (inS) { if (c === inS && prev !== '\\') inS = null; }
    else if (c === "'" || c === '"' || c === '`') inS = c;
    else if (c === '{' || c === '[') stack.push({ c, line: i + 1 });
    else if (c === '}' || c === ']') { const p = stack.pop(); if (i + 1 > 600 && i + 1 < 630) console.log('line', i + 1, 'popped', p && (p.c + '@' + p.line), 'depth now', stack.length); }
    prev = c;
  }
  inS = null; prev = '';
}
