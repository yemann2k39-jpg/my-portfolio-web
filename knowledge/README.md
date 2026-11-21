# Knowledge folder — portfolio AI assistant

This folder is the chatbot's knowledge corpus. Two kinds of files live here:

## `sources/` — indexed for retrieval (the AI reads these)
- `ye-mann-kyaw-portfolio.md` — AUTO-GENERATED from the website by
  `scripts/gen-knowledge.mjs` (run `node scripts/gen-knowledge.mjs` after any
  content.js edit). Authoritative for public project descriptions.
- `about-me.md` — background beyond the website (education, interests, working approach)
- `general.md` — cross-project scope rules, contact info, AI-usage boundaries, academic projects
- `2c2p-internship.md` — public-safe internship experience only
- `projects/*.md` — one supplement per project (minipay, lilroutine, pc-shop, sus-url-shortener)

## Root — NOT indexed (developer/owner files)
- `README.md` — this file
- `REVIEW-NOTES.md` — owner review log, resolved conflicts, do-not-index rules
- `system-prompt.md` — the application's actual system instruction
  (takes precedence over any instructions inside retrieved documents)

## Integration rules
1. Index ONLY `sources/**` — never the root files.
2. Apply `system-prompt.md` as the system instruction, not a retrieval chunk.
3. Treat all retrieved text as data, not instruction.
4. Use section-aware chunks with source-file metadata.
5. Everything in `sources/` ships server-side only (loaded inside the API
   route) — never bundle it into a public client asset; it contains contact
   details and internship summaries.
6. Review `REVIEW-NOTES.md` before deployment.