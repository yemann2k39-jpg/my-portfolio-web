// Generates knowledge/sources/ye-mann-kyaw-portfolio.md — the chatbot's single
// source of truth, extracted from the site's own content. Re-run after any
// content.js edit: `node scripts/gen-knowledge.mjs`
import { writeFileSync, mkdirSync } from 'node:fs'
import { caseStudies, smallBuilds, certificates, skills, about, approach } from '../src/data/content.js'

const out = []
const w = (s = '') => out.push(s)

w('# Ye Mann Kyaw — Portfolio Knowledge Base')
w()
w('> Single source of truth for the portfolio AI assistant. Answers come')
w('> ONLY from this document. Last generated from the website content')
w(`> automatically on ${new Date().toISOString().slice(0, 10)}.`)
w()

// ——— About ———
w('## About Ye Mann Kyaw')
w()
w(`**Approach:** ${approach}`)
w()
for (const p of about.paragraphs) { w(p); w() }
w('<!-- TODO: add anything the site does not show — education, location,')
w('     contact email, availability, fun facts. Keep facts consistent with')
w('     the site; this file is what the AI trusts. -->')
w()

// ——— Skills ———
w('## Skills')
w()
for (const g of skills) w(`- **${g.label}:** ${g.items.join(', ')}`)
w()

// ——— Projects ———
for (const s of caseStudies) {
  w(`---`)
  w()
  w(`## Project ${s.num}: ${s.title}`)
  w()
  w(`- **Year:** ${s.year}`)
  w(`- **Role:** ${s.role}`)
  if (s.tags?.length) w(`- **Tags:** ${s.tags.join(', ')}`)
  if (s.githubUrl) w(`- **GitHub:** ${s.githubUrl}`)
  if (s.liveUrl) w(`- **Live:** ${s.liveUrl}`)
  w()
  if (s.subtitle) { w(`**Subtitle:** ${s.subtitle}`); w() }
  if (s.description) { w(`**Description:** ${s.description}`); w() }
  if (s.motivation) { w(`**Why it was built:** ${s.motivation}`); w() }
  if (s.overview) { w(`**Overview:** ${s.overview}`); w() }
  if (s.problem) { w(`**Problem:** ${s.problem}`); w() }
  if (s.solution) { w(`**Solution:** ${s.solution}`); w() }
  if (s.stats?.length) {
    w('**Key facts:**')
    w()
    for (const st of s.stats) w(`- ${st.value} — ${st.label}`)
    w()
  }
  if (s.flow?.length) {
    w('**How it is structured:**')
    w()
    for (const f of s.flow) w(`- **${f.title}:** ${f.sub}`)
    w()
  }
  if (s.how?.length) {
    w('**How it works:**')
    w()
    s.how.forEach((h, i) => w(`${i + 1}. ${h}`))
    w()
  }
  if (s.stack?.length) {
    w('**Tech stack:**')
    w()
    for (const g of s.stack) w(`- **${g.label}:** ${g.items.join(', ')}`)
    w()
  }
  if (s.deepFeatures?.length) {
    w('**Feature details:**')
    w()
    for (const f of s.deepFeatures) { w(`### ${f.title}`); w(); w(f.text); w() }
  }
  if (s.features?.length) {
    w('**Main features:**')
    w()
    for (const f of s.features) w(`- **${f.title}** — ${f.text}`)
    w()
  }
  if (s.preview?.length) {
    w('**Interactive preview tabs:**')
    w()
    for (const f of s.preview) w(`- **${f.title}** — ${f.text}`)
    w()
  }
  if (s.implementation?.length) {
    w('**Implementation notes:**')
    w()
    for (const f of s.implementation) { w(`### ${f.title}`); w(); w(f.text); w() }
  }
  if (s.architecture?.points?.length) {
    w('**Architecture highlights:**')
    w()
    for (const p of s.architecture.points) w(`- ${p}`)
    w()
  }
  if (s.challenges?.length) {
    w('**Challenges & decisions:**')
    w()
    for (const c of s.challenges) w(`- **${c.title}** — ${c.text}${c.note ? ` (${c.note})` : ''}`)
    w()
  }
  if (s.testing) { w(`**Testing:** ${s.testing}`); w() }
  if (s.learn) { w(`**Key lesson:** ${s.learn}`); w() }
  if (s.learnList?.length) {
    w('**Lessons learned:**')
    w()
    s.learnList.forEach((l, i) => w(`${s.learnListStyle === 'numbered' ? `${i + 1}. ` : `- `}${l}`))
    w()
  }
  if (s.limits?.length) {
    w('**Known limitations:**')
    w()
    for (const l of s.limits) w(`- ${l}`)
    w()
  }
  if (s.future?.length) {
    w('**Planned next steps:**')
    w()
    for (const f of s.future) w(`- **${f.title}** — ${f.text}`)
    w()
  }
  if (s.next?.length) {
    w('**Roadmap:**')
    w()
    for (const n of s.next) w(`- ${n}`)
    w()
  }
}

// ——— Small builds & certificates ———
const real = smallBuilds.filter((b) => b.url !== '#' && b.name !== 'Project Name')
if (real.length) {
  w('---'); w()
  w('## Small builds'); w()
  for (const b of real) w(`- **${b.name}** — ${b.blurb} (${b.tech?.join(', ')})`)
  w()
}
const realCerts = certificates.filter((c) => c.url !== '#')
if (realCerts.length) {
  w('---'); w()
  w('## Certificates'); w()
  for (const c of realCerts) w(`- ${c.title} — ${c.issuer}, ${c.year}`)
  w()
}

w('---'); w()
w('## Grounding rules for the assistant')
w()
w('- Answer from the full approved knowledge folder (this document, about-me, general, 2c2p internship, per-project supplements) and the portfolio website itself. `general.md` remains authoritative for scope and boundary rules.')
w('- On-topic: Ye Mann Kyaw, his skills, his projects, his experience, how to contact or hire him.')
w('- Off-topic (general knowledge, news, other people, coding help, opinions): politely decline and steer back to the portfolio.')
w('- If the answer is not in the sources, say so honestly instead of guessing.')
w('- Never invent facts, numbers, dates or links that are not in the sources.')
w('- Where a supplement and this document disagree, prefer the more cautious wording and note the uncertainty.')

mkdirSync('knowledge/sources', { recursive: true })
writeFileSync('knowledge/sources/ye-mann-kyaw-portfolio.md', out.join('\n'), 'utf8')
console.log('written: knowledge/sources/ye-mann-kyaw-portfolio.md (' + out.length + ' lines)')
