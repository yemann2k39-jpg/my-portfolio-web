# Ye Mann Kyaw — Portfolio Knowledge Base

> Single source of truth for the portfolio AI assistant. Answers come
> ONLY from this document. Last generated from the website content
> automatically on 2026-11-21.

## About Ye Mann Kyaw

**Approach:** Software engineering isn’t just about making things work. It’s about understanding why they work, how the different pieces fit together, and how to make them better.

I’m a software developer with experience building web and mobile applications, from designing interfaces and developing backend services to integrating APIs and databases. I’m passionate about software development and enjoy working across different areas of it, exploring new technologies, and taking projects from an initial idea to a working application. I’m always willing to learn, take on unfamiliar challenges, and put in the effort to improve my skills. My approach is to keep things practical, pay attention to the details, and write code that’s easy to understand, maintain, and improve.

<!-- TODO: add anything the site does not show — education, location,
     contact email, availability, fun facts. Keep facts consistent with
     the site; this file is what the AI trusts. -->

## Skills

- **Languages:** JavaScript, TypeScript, Python, Dart, SQL
- **Frontend:** React.js, React Native, Flutter, HTML/CSS, Tailwind
- **Backend:** Node.js, Express, NestJS, PostgreSQL, Prisma
- **Tools & APIs:** Git/GitHub, Stripe API, Mapbox API, Docker, Figma

---

## Project 01: Sus URL Shortener

- **Year:** 2026
- **Role:** Solo developer — design, frontend, backend, database and deployment
- **Tags:** Next.js 15, React 19, JavaScript, LibSQL/Turso, Brevo Email API, Edge Middleware
- **GitHub:** https://github.com/yemann2k39-jpg/sus-url-shortener

**Subtitle:** Perfectly normal links. Questionable presentation.

**Description:** A playful link shortener that turns ordinary URLs into suspicious-looking links, with an optional warning screen before the redirect.

**Why it was built:** I wanted to make a simple internet joke into a working product. The fun part was figuring out how to keep link generation predictable and redirects fast.

**Overview:** A playful link shortener that turns ordinary URLs into suspicious-looking links, with an optional warning screen before the redirect. I learned that choosing the right identifier strategy can remove an entire category of bugs instead of adding more checks.

**Problem:** Most hobby URL shorteners are CRUD demos: random collision-prone codes checked with retry loops, click counters that write to disk on the hot path, no real accounts, and sessions stored in plaintext. I wanted one that is genuinely fun — every link goes where it claims, the vibe is the only thing that changes — but engineered underneath like a production service: collision-free code generation, email-verified accounts, hashed credentials, rate limiting on every endpoint, and an honest scaling path.

**Solution:** Sus URL Shortener is a Next.js 15 App Router application (JavaScript, React 19 client components, server-component pages) with hand-written neo-brutalist CSS and no UI framework. Its signature idea is the code generator: each link’s AUTOINCREMENT rowid is scrambled through a 4-round Feistel network over a 2^34 space and Base62-encoded to exactly 6 characters, so codes are unique by construction and creating a link is a single INSERT with zero collision checks. All storage is isolated in one file behind a dual-mode LibSQL driver — remote Turso when configured, a local SQLite file otherwise — with a real migration history: the original node:sqlite build was swapped to @libsql/client by reimplementing that single module, and a legacy links.json store was imported into SQLite on first boot. Auth (scrypt hashing, SHA-256-hashed tokens, email verification via the Brevo HTTP API) is built from scratch with no auth library; QR codes render client-side with the qrcode package.

**Key facts:**

- 6 characters — short code
- 307 / warning — redirect modes
- SQLite + Turso — storage

**How it is structured:**

- **Browser:** Next.js pages and forms
- **Server:** auth, links and redirect handlers
- **Data:** Turso / LibSQL
- **Email:** Brevo verification

**How it works:**

1. Frontend: Next.js 15 App Router + React 19. Server components render the dashboard and redirect pages, while small client components handle the create form, QR modal and verification polling
2. Backend: nine /api route handlers (auth, links, hits) behind edge middleware that rate-limits by IP before any database work
3. Database: LibSQL (SQLite dialect) with four tables. Users, sessions, verification_tokens, links carry an owner_key so every query is owner-scoped
4. Storage is one swappable module: remote Turso in production, local SQLite in dev, same code
5. Hot path: LRU+TTL cache answers repeat lookups, and clicks buffer in memory to flush every 5 seconds as one batched transaction, so redirects never write to disk
6. External: Brevo HTTP API sends verification emails, while QR codes are fully client-side

**Tech stack:**

- **Framework:** Next.js 15 (App Router), React 19 client components, Vercel (hosting)
- **Data:** SQLite via LibSQL (dual-mode), Turso when configured, Buffered click counting, Hand-rolled LRU+TTL cache
- **Auth & Security:** scrypt password hashing, SHA-256-hashed session tokens, Edge rate limiting, Email verification gate
- **Integrations:** Brevo verification email, qrcode (client-side PNGs)

**Main features:**

- **Instant shortening** — Create a short link with an optional custom name and a unique 6-character code, shortened instantly. QR codes are generated client-side, with instant preview and a downloadable 480px PNG on the result screen and in the dashboard modal.
- **Suspicious-link warning** — Sus-mode links stop at a deadpan warning page naming the real destination host before the Continue button, turning an ordinary redirect into part of the joke. One dynamic route serves both instant and warning modes.
- **Link management dashboard** — Manage personal links, check click counts, copy URLs, generate QR codes and delete links with a two-step confirmation.
- **Account verification** — Email-verified accounts with scrypt hashing, hashed single-use tokens and remember-me sessions keep every link tied to the right owner through an owner-scoped dashboard.

**Architecture highlights:**

- The database ID is scrambled with a Feistel permutation and encoded as Base62 — every short code is unique without generating random candidates or checking for collisions. A permutation masks sequential IDs, but it is obfuscation rather than encryption.
- An LRU cache handles recent link lookups; click totals are buffered and written in batches every five seconds. A server restart can lose a small window of click counts.
- The same LibSQL client connects to a local SQLite file during development and Turso in production — only the database connection settings need to change.

**Challenges & decisions:**

- **Unique links without retry loops** — The database ID is scrambled with a Feistel permutation and encoded as Base62. Every short code is unique without generating random candidates or checking for collisions. (A permutation masks sequential IDs, but it is obfuscation rather than encryption.)
- **Keep redirects lightweight** — An LRU cache handles recent link lookups. Click totals are buffered and written in batches every five seconds. (A server restart can lose a small window of click counts.)
- **Local development, remote production** — The same LibSQL client connects to a local SQLite file during development and Turso in production. (Only the database connection settings need to change.)

**Testing:** Manual but explicit: a curl end-to-end suite covers registration validation, duplicates, session auth, hash-leak checks, logout and rate limits, with PASS/FAIL per check. A one-shot smoke test runs create, get and delete against the real remote Turso database. No automated framework or CI yet, so the suites run manually before each deploy.

**Key lesson:** I learned that choosing the right identifier strategy can remove an entire category of bugs instead of adding more checks.

**Lessons learned:**

1. Designing for correctness at the data-model level removes whole classes of bugs.
2. Cache correctness has subtleties most demos get wrong: caching a miss is dangerous.
3. Security details compound: each safeguard closes a specific hole.

**Known limitations:**

- Rate limiting, cache and click buffers are held per instance.
- Links cannot be edited after creation.
- Analytics currently show click counts, not trends over time.
- No CI pipeline.

**Planned next steps:**

- **Shared cache & rate limiting** — Rate limiting, the cache and click buffers are held per instance today — move them to Redis-backed shared infrastructure when the app runs distributed.
- **Link editing & richer analytics** — Links cannot be edited after creation, and analytics currently show click counts only — add link editing and per-link trends over time.
- **Automated tests in CI** — The regression suite is manual scripts today; bring it into an automated CI pipeline.

**Roadmap:**

- Shared cache and rate limiting with Redis.
- Per-link analytics and link editing.
- Automated tests in CI.

---

## Project 02: PC Shop

- **Year:** 2026
- **Role:** Solo Design & Engineering
- **Tags:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, react-three-fiber / Three.js (3D viewer), SQLite, Drizzle ORM, Node.js crypto, Groq LLM API, Stripe
- **GitHub:** https://github.com/yemann2k39-jpg/pc-shop

**Subtitle:** Build a PC before buying the parts.

**Description:** A PC components storefront with an interactive 3D builder, live compatibility checks, performance estimates and an AI shopping assistant.

**Why it was built:** I wanted to combine e-commerce with the parts of PC building I enjoy most: choosing components, checking fit and understanding how a complete setup performs.

**Overview:** A PC components storefront with an interactive 3D builder, live compatibility checks, performance estimates and an AI shopping assistant. Building the 3D experience was only half the work — the useful part was making the compatibility and performance rules understandable and independent of the interface.

**Problem:** PC-part stores treat components as isolated SKUs: nothing tells you a CPU doesn’t fit your motherboard until you own both, "gaming performance" is a marketing bullet with no methodology, and first-time builders have no way to see what they’re buying. I wanted a shop where compatibility, power, and real FPS numbers are computed live while you build — in 3D.

**Solution:** PC Shop is a Next.js 16 / React 19 storefront over SQLite + Drizzle ORM with a seeded catalog of ~100 real components across 8 categories. A pure-function rules engine runs 12 compatibility checks on every builder change — in the browser for instant feedback and on the server for the AI assistant. FPS estimates combine real TechPowerUp and GPUCheck data with a min(GPU, CPU) model per resolution. Checkout runs through a payment-provider abstraction (MiniPay gateway, Stripe test mode, or a local mock) with an HMAC-SHA256-verified, idempotent webhook, and a Groq-powered assistant answers only from live catalog tool results.

**Key facts:**

- 8 — builder component slots
- 12 — compatibility rules
- 3 — payment provider options

**How it is structured:**

- **Shop + builder:** Next.js and React Three Fiber
- **Domain logic:** compatibility + FPS models
- **Data:** SQLite + Drizzle
- **External:** MiniPay, Stripe, LLM

**How it works:**

1. Storefront (Next.js App Router, RSC-first): catalog, category, product, search, order and admin pages are server components querying the database directly. Cart, builder, 3D viewer and AI assistant are client islands. Business logic lives in pure lib modules so browser and server never drift.
2. Data layer: SQLite via Drizzle ORM, 7 tables (products with structured JSON specs, orders with denormalized price snapshots, discounts, builds, users, sessions, benchmark_data).
3. Rules + performance engine: pure functions over plain product data. The browser builder runs them client-side for instant feedback, and the AI tools run the identical code server-side.
4. Payments: checkout creates an order, then a payment session through the configured provider. The gateway’s webhook verifies HMAC-SHA256 over the raw body, checks the amount, and transitions pending→paid with a compare-and-set guard so retries can’t double-resolve.
5. AI assistant: a bounded tool loop with trimmed history, capped tool results, max six rounds and 800 completion tokens, with 429 responses parsed from Groq’s own “try again in X.XXs” hint.

**Tech stack:**

- **Frontend:** Next.js 16 (App Router, RSC, server actions), React 19, TypeScript, Tailwind CSS v4, react-three-fiber + drei + Three.js (GLB models)
- **Backend:** Next.js Route Handlers, Server Actions, node:crypto (scrypt, HMAC-SHA256), MiniPay NestJS gateway (external service)
- **Database:** SQLite (better-sqlite3), Drizzle ORM + drizzle-kit migrations, JSON columns for specs / order items / build selections, Composite indexes for category-price queries
- **APIs & Integrations:** MiniPay merchant API (X-API-Key, hosted checkout, HMAC-signed callbacks), Stripe Checkout (test mode), Groq LLM API (OpenAI-compatible chat completions + tools)
- **Testing & Tools:** verify:compat scenario script (known-good/bad builds), verify:perf benchmark checks, smoke-auth script, ESLint 9 + eslint-config-next, pnpm, drizzle-kit

**Feature details:**

### Live Compatibility Rules Engine

Twelve independent checks — CPU socket vs motherboard, DDR4/DDR5 memory type, board form factor vs case, GPU length, cooler socket and height, missing-GPU display output, PSU wattage, GPU/CPU bottleneck pairing, premium-board-with-DDR4 anti-pattern, high-draw-GPU PSU headroom, flagship-CPU cooling — each tagged with a stable rule id and severity (error / warning / info). Pure functions with no DB access, so the exact same engine runs client-side on every selection change and server-side inside the AI assistant’s tools.

### Benchmark-Grounded Performance Estimates

A benchmark_data table is seeded with real published aggregate FPS: TechPowerUp game-database averages per GPU at 1080p/1440p/4K, and GPUCheck CPU 1080p ceilings measured with an RTX 4090 so the GPU never limits. Estimated FPS = min(GPU fps, CPU cap) per resolution — the same model GPUCheck/PC-Builds use — across AAA Ultra and Esports scenarios, reported as ±8% ranges for complete builds and ±15% for partial GPU+CPU picks, with a bottleneck classification (GPU-bound / CPU-bound / Balanced) and a CPU-limit percentage. Parts without benchmark rows fall back to relative performance indices, and the UI says which path produced the number.

### Interactive 3D Build Viewer

A react-three-fiber scene renders each selected part as a GLB model placed on slot anchors inside the case, with clickable "ghost" slots for empty categories, orbit controls and auto-rotate, RAM stick count derived from the chosen kit, an SSD in the M.2 slot and an HDD on its mount. Any category with an error finding pulses red via animated emissive tint — the compatibility engine drives the 3D feedback directly.

### Payment Provider Abstraction + Idempotent Webhook

Checkout talks to one PaymentProvider interface with three implementations selected by environment: the MiniPay gateway (hosted redirect checkout created with an API key), Stripe Checkout in test mode, and a local mock page for zero-config runs. The MiniPay webhook verifies an HMAC-SHA256 signature over the raw request body with timingSafeEqual (never re-serialized JSON), rejects amount mismatches with 409, and performs the pending→paid transition as a compare-and-set UPDATE ... WHERE status = 'pending' — retried callbacks no-op, and each discount redemption is counted exactly once inside the same transaction.

### Grounded AI Shopping Assistant

A tool-loop chat over any OpenAI-compatible endpoint (Groq) with four catalog-grounded tools: product search, product details, compatibility checking, and build performance estimation. The system prompt forbids stating any spec, price, or compatibility claim that didn’t come from a tool result, requires product links, and injects page context — on the builder page "my build" means the current selection. Rate-limit resilient: 429 responses parse Groq’s "try again in X.XXs" hint and retry within the window, while history trimming and capped tool results keep each turn inside the free tier’s token budget.

### Accounts, Orders & Admin

Customer accounts use scrypt-hashed passwords with per-user salts and revocable server-side sessions (256-bit tokens in httpOnly cookies). Checkout never trusts client prices — every line is re-read and re-priced server-side, discounts re-validated, stock enforced — and orders store denormalized price snapshots. An admin dashboard (separate single-admin auth) manages products, orders, discounts (percent/fixed, per-product scoping, redemption caps), and saved builds; any build can be shared anonymously via a public link.

**Main features:**

- **Build it in 3D** — Every selected part renders as a GLB model inside the case in a live react-three-fiber scene, with orbit controls and clickable ghost slots for anything still missing.
- **Live rules, honest FPS** — Twelve compatibility rules (sockets, memory, PSU headroom, GPU clearance and more) run on every selection with pulsing-red errors and plain-English fixes, while FPS estimates come from real TechPowerUp and GPUCheck data through a min(GPU, CPU-cap) model, reporting ±8%/±15% bands and CPU-bottleneck warnings.
- **An assistant that only knows the catalog** — A Groq-powered chat with four tools (product search, details, compatibility check, performance estimate) that may only state what tool results return, with clickable product links and rate-limit retry handling.
- **The full commerce stack** — Cart, checkout with server-side re-pricing, discounts (percent/fixed, product-scoped, redemption caps), order history, scrypt-hashed accounts with revocable sessions, and a separate admin dashboard.
- **Builds made for sharing** — Save any configuration to a community builds gallery on the website, where anyone can browse it and fork it straight into their own builder.

**Implementation notes:**

### Architecture

RSC-first App Router: catalog, category, product, search, order and admin pages are server components querying Drizzle directly; cart, builder, 3D viewer and AI assistant are client islands. Business logic lives in pure lib modules — catalog taxonomy (a code-level enum shared by seed, UI and filters), compatibility rules, performance model, orders, discounts, payments, ai — so the browser and server never drift.

### Data model

Seven tables: products (specs as a structured JSON map, prices in integer minor units, composite category+price index), orders (crypto-random order numbers, denormalized line-item price snapshots, payment session id, discount redemption flag), discounts (type, min subtotal, per-product scoping, max redemptions), builds (public share id, category→slug JSON, optional owner FK), users, sessions, and benchmark_data (kind, scenario, resolution, avg FPS, source) indexed for the estimate lookup.

### API design

POST /api/checkout (server-side re-pricing, stock/qty validation, discount re-validation, order insert, payment session creation with rollback of stranded orders), POST /minipay/callback (webhook), GET/POST /api/builds (save + shareable publicId links), POST /api/ai/chat (assistant turns), /api/discounts/validate, /api/mock-pay, /api/admin/product-preview, plus server actions for auth and admin mutations.

### Auth & security

scrypt password hashing with per-user salts and timing-safe verification; 256-bit session tokens stored server-side (revocable by deleting the row) in httpOnly, sameSite=lax cookies; a separate single-admin credential for /admin. The webhook verifies HMAC-SHA256 over the raw body with timingSafeEqual and rejects paid amounts that don’t match the order total. Checkout re-reads all prices and re-validates discounts server-side — the client is never trusted on money.

### Integrations

MiniPay: a NestJS gateway service running on port 3000 — the store creates a hosted checkout session with an X-API-Key header (order reference, amount in minor units, callback URL) and confirms payment from the HMAC-signed callback, with status polling as a fallback and explicit error mapping for auth/conflict/expired sessions. The AI layer is provider-agnostic: any OpenAI-compatible base URL works, configured via env.

**Architecture highlights:**

- Compatibility checks live in pure TypeScript functions, separate from React and database code — the same logic runs anywhere. A clean seam for future unit testing.
- The FPS model combines seeded GPU benchmark averages with CPU ceilings. Partial builds show wider uncertainty; missing pairings fall back to estimates — numbers are estimates, not a replacement for real benchmarks.
- Checkout never trusts the cart: prices are fetched again from SQLite on the server. Payment providers share one interface, including MiniPay, Stripe test mode and a local mock — the UI can change without changing payment rules.

**Challenges & decisions:**

- **Pure-function core over framework magic** — Compatibility and performance logic as plain functions meant the UI, server re-validation and LLM tools share one implementation with zero drift. (A clean seam for future unit testing.)
- **Measured numbers and idempotency by default** — A measured-vs-fallback flag means the UI never presents a relative-index guess as real benchmark data. Webhooks, order transitions and discount redemptions are all designed assuming the message will arrive twice. (Numbers are estimates, not a replacement for real benchmarks.)
- **Grounding over vibes for the LLM** — Rather than prompting “don’t make things up,” the architecture makes invention impossible: every claim must cite a tool result, and the tools only query the live catalog. (Answers stay narrow and slower, but nothing can be invented.)

**Testing:** Production build and lint checks are supported by targeted TypeScript verification scripts for compatibility, performance and authentication. The mock payment provider allows a complete local checkout flow. There is no unit-test framework or CI pipeline yet.

**Key lesson:** Building the 3D experience was only half the work. The useful part was making the compatibility and performance rules understandable and independent of the interface.

**Lessons learned:**

1. Sharing the rules engine between client, server and AI tools from day one saved three rewrites later.
2. Rate limits are a feature to design for: parsing the gateway’s own retry hint turned 429 failures into a seamless wait.
3. Denormalized price snapshots are cheap insurance: order history stays truthful after prices change.
4. A mock payment provider is what makes the whole purchase flow testable and demoable offline.

**Known limitations:**

- Local SQLite is not designed for distributed production traffic.
- Admin access uses a single configured password.
- No automated test framework or CI pipeline.
- Stock is tracked as a status, not a quantity.

**Planned next steps:**

- **Tests for the rule engines** — Automated tests for the compatibility and performance rules — no unit-test framework or CI pipeline yet.
- **Quantity-based inventory & stronger admin access** — Stock is currently tracked as a status, not a quantity, and admin access uses a single configured password.
- **Reliable payments & a scalable database** — More reliable payment confirmation, and a database designed for distributed production traffic — local SQLite is not built for that.

**Roadmap:**

- Automated tests for compatibility and performance rules.
- Quantity-based inventory and stronger admin access.
- More reliable payment confirmation and a scalable database.

---

## Project 03: MiniPay

- **Year:** 2026
- **Role:** Solo Design & Engineering
- **Tags:** Dart, NestJS, TypeScript, PostgreSQL, Prisma ORM, React 19, Vite, Stripe API, JWT, WebSockets-free REST, Docker, Tailwind CSS
- **GitHub:** https://github.com/yemann2k39-jpg/minipay

**Subtitle:** A wallet, merchant gateway and payments backend.

**Description:** A payments project spanning a Flutter wallet, merchant checkout API, hosted payment page and React admin dashboard.

**Why it was built:** I wanted to understand what actually happens behind a payment button. MiniPay grew from a wallet experiment into a system with ledger entries, merchant integrations and payment callbacks.

**Overview:** A payments project spanning a Flutter wallet, merchant checkout API, hosted payment page and React admin dashboard. Payment correctness depends on invariants — balanced entries, idempotency keys and transaction boundaries matter more than how quickly the payment screen responds.

**Problem:** Money features in most apps store a balance column and mutate it. That breaks down the moment two requests race, a webhook retries, or a refund partially completes: balances drift, transfers double-post, and nobody can prove the books are consistent. Small merchants also lack a simple, programmable way to accept wallet payments and get notified reliably.

**Solution:** MiniPay is a three-app monorepo built the way real payment systems are: a Flutter consumer/merchant app (one app, personal and business modes), a NestJS REST API with a double-entry ledger at its core, and a React admin dashboard. Balances are never stored — they are derived from balanced journal lines. Every money movement is idempotent, concurrency-serialized, and verifiable through a ledger invariant endpoint. Merchants register in-app, get hashed API keys with rotation, a hosted checkout page, and HMAC-SHA256 signed webhooks.

**Key facts:**

- Double-entry — ledger accounting
- SGD only — currency (test payments)
- 33 — passing API unit tests

**How it is structured:**

- **Mobile:** Flutter wallet + merchant app
- **API:** NestJS / ledger engine
- **Data:** PostgreSQL + Prisma
- **Integrations:** Stripe, Gemini, merchant callbacks

**How it works:**

1. Flutter app (one app, two modes): Consumers get a wallet (transfer, scan, request, split), while merchants get a business view (collect payments, sales, payouts, API keys). Talks to the API over REST with JWT.
2. NestJS API: The source of truth. All money moves through a double-entry ledger service: each operation writes a journal entry with balanced lines inside a database transaction, protected by idempotency keys and per-account advisory locks so concurrent requests cannot double-spend.
3. PostgreSQL via Prisma: 15+ models covering users, wallets (ledger accounts), journal entries, transactions, checkout sessions, merchants, API keys, refresh tokens and notifications.

**Tech stack:**

- **Mobile:** Flutter / Dart, dio, flutter_secure_storage, local_auth, mobile_scanner, qr_flutter, fl_chart, flutter_local_notifications
- **Backend:** NestJS 11 (TypeScript), Passport JWT, bcrypt, class-validator DTOs, Stripe SDK, qrcode
- **Database:** PostgreSQL 16 (Docker), Prisma 6 ORM, pg_advisory_xact_lock
- **Integrations:** Stripe PaymentIntents + webhooks, Gemini vision API (server-side)
- **Admin Dashboard:** React 19, Vite, TypeScript (strict)
- **Testing / Tools:** Jest unit specs, Node E2E verify scripts, Stripe CLI, Docker Compose

**Feature details:**

### Double-Entry Ledger Core

No balance column exists. Every movement is a JournalEntry with balanced JournalLine debits and credits in BigInt minor units across WALLET, TREASURY, FEES, CLEARING and MERCHANT accounts, and wallet balances are derived by aggregating lines. A GET /ledger/invariant endpoint re-verifies that every entry balances and no wallet is negative — money math you can audit.

### Concurrency-Safe Money Movement

Every posting takes a transaction-scoped Postgres advisory lock per touched account (account IDs sorted to prevent deadlocks), so concurrent transfers of the same wallet serialize instead of racing. Journal entries carry unique idempotency keys (pi_<stripe-id>, checkout_<id>, refund_<id>), meaning retried webhooks or double-submits can never post twice.

### Merchant Gateway & Hosted Checkout

Merchants register in-app (one transaction creates the merchant user, ledger account and MP-XXXXXXXX code), then call a public REST API authenticated by X-API-Key. The API creates checkout sessions with a 15-minute TTL, serves a server-rendered hosted checkout page, and settles payment through an atomic PENDING→PAID status claim followed by a balanced MERCHANT_PAYMENT ledger entry — rolled back if the ledger post fails.

### HMAC-SHA256 Signed Callbacks

When a checkout is paid, the API fires an HMAC-SHA256 signed webhook (X-MiniPay-Signature, hex digest of the raw body) to the merchant’s callback URL, with retry attempts at 2s/5s/10s and a 10-second delivery timeout. Delivery never blocks or fails the customer’s payment response.

### Sessions, PINs & Biometrics

Auth uses 15-minute JWT access tokens and 30-day refresh tokens that are rotated on every use and stored SHA-256-hashed with device metadata — users can list and revoke sessions, and password changes kill the others. Money movement requires a bcrypt-hashed 6-digit payment PIN (deliberately a 400, not a 401, so a typo can’t log you out), and the app unlocks with biometrics via Keystore-backed secure storage.

### AI Receipt Splitting

Bill splits start with a photo: the API calls Gemini’s vision model server-side (the key never ships in the APK) to extract line items from a receipt, then a pure, unit-tested calculator divides shares with exact-sum guarantees across extra charges and discounts. Requests are only sent after explicit review — the creator is always a shareholder but never auto-charged.

**Main features:**

- **Double-entry ledger** — Every money movement posts balanced journal lines, so balances are always derived from the ledger and never stored.
- **P2P transfers** — Send money by email or contact lookup, authorize with fingerprint or PIN, and stay inside server-enforced daily spend limits.
- **QR payments & gateway** — Scan to pay at merchant checkouts or show your personal receive-money QR, backed by a hosted merchant checkout and a public REST API.
- **Scan & split** — Snap a photo of a receipt and server-side AI reads the line items, splits the total across the group and creates a request, so settling up takes one tap.

**Interactive preview tabs:**

- **Double-entry ledger** — Every money movement posts balanced journal lines, so balances are always derived from the ledger and never stored.
- **P2P transfers** — Send money by email or contact lookup, authorize with fingerprint or PIN, and stay inside server-enforced daily spend limits.
- **QR payments & gateway** — Scan to pay at merchant checkouts or show your personal receive-money QR, backed by a hosted merchant checkout and a public REST API.
- **Hardened security** — Rotating refresh-token sessions with device tracking, bcrypt payment PINs, biometric app unlock and forgot-PIN recovery.
- **Merchant gateway** — Register a business, open collect-payment QR sessions and integrate through API keys on the hosted checkout page.
- **Scan & split** — Scan a shared receipt, let AI split it by line items, split the total across the group and create a request, all in just one tap
- **Refunds, payouts & deposits** — Refund claims are atomic with automatic ledger rollback on failure, while card deposits via Stripe PaymentIntents credit wallets through a single writer.
- **Know Your Money** — A month-by-month view of your spending with inflow, outflow and net totals, daily and per category breakdowns, plus a searchable transaction history with filters, so every dollar is easy to find and every month is easy to understand.

**Implementation notes:**

### Architecture

A monorepo of three apps over one API: apps/mobile (Flutter, Android), apps/api (NestJS, port 3000) and apps/admin (React). The API is organised into domain modules — auth, ledger, wallet, payments, merchants, merchant-api, checkout, transfers, requests, split, contacts, notifications, admin — each with its own guards, DTOs and services.

### Data model

15 Prisma models: User, LedgerAccount, JournalEntry, JournalLine, Transaction, Merchant, CheckoutSession, MoneyRequest, SplitSession/SplitItem/SplitParticipant, Contact, Notification, RefreshToken and IdempotencyKey. Checkout sessions are unique per (merchant, orderRef); transactions carry a unique Stripe payment-intent ID so Stripe events and ledger postings can always be reconciled.

### Deposits: webhook as single writer

Card deposits create a PENDING transaction and a Stripe PaymentIntent; the wallet is credited only by the signature-verified payment_intent.succeeded webhook, posting with idempotency key pi_<paymentIntentId>. The API keeps the raw request body (custom express parser) so Stripe signatures verify byte-exact, and permanently-failed payments are acked with 200 so Stripe doesn’t retry forever.

### Server-enforced limits & risk control

P2P transfers enforce per-transfer bounds (S$1–S$5,000) and an optional user-set daily spend limit, computed server-side from the day’s completed and pending transfers. Admins can freeze accounts and merchants: frozen users can still receive money but every user-initiated movement — deposits, transfers, payments, requests, splits — is blocked at the endpoint level, and frozen merchants can’t create checkout sessions while existing payable ones stay live.

### Mobile API client

A single dio interceptor attaches tokens from secure storage, silently refreshes once on 401 and retries, and never refreshes on auth endpoints — with business errors mapped away from 401 so wrong PINs can’t masquerade as expired sessions. minipay:// payment URIs (merchant codes, checkout sessions, personal receive QRs) are parsed by the in-app QR scanner.

**Architecture highlights:**

- Every money movement creates balanced journal lines — wallet balances are calculated from those lines rather than stored as a mutable balance field. Ledger totals remain auditable, but reads require aggregation.
- PostgreSQL advisory transaction locks serialize operations touching the same accounts, with deterministic lock order to avoid deadlocks — two transfers can never both spend the same available balance.
- Unique idempotency keys prevent duplicate ledger posting; hosted checkout uses signed callbacks with retries and an API polling fallback. Callback delivery still needs a durable outbox for crash recovery.

**Challenges & decisions:**

- **Derived balances over stored balances** — Balance is the sum of ledger lines: slower to read, but mathematically impossible to drift out of sync, and a single invariant endpoint can prove the whole ledger balances. (Ledger totals remain auditable, but reads require aggregation.)
- **Idempotency keys and advisory locks on every write** — Retried webhooks or double-tapped buttons can never post twice. Postgres row locks alone were not enough for multi-row journal writes, so sorted advisory locks per account prevent deadlocks between concurrent transfers. (Two transfers can never both spend the same available balance.)
- **Webhook as the single credit writer** — Stripe deposits credit wallets only through the signature-verified webhook (raw body preserved for verification), never from client responses. (One writer eliminates a whole class of race conditions.)
- **Hashed secrets and one role-based app** — Refresh tokens and API keys are stored as SHA-256 hashes, so a database leak cannot be replayed. Merchants are users with a shop rather than a separate app, which halved the codebase. (Refunds flip PAID→REFUNDED with one atomic conditional update, rolled back if the ledger write fails.)

**Testing:** Two Jest unit-test suites contain 33 passing tests for bill splitting and merchant API validation and cryptography. The project also includes verification scripts, but not a full end-to-end automated test pipeline.

**Key lesson:** Payment correctness depends on invariants. Balanced entries, idempotency keys and transaction boundaries matter more than how quickly the payment screen responds.

**Lessons learned:**

1. Money needs a different mindset: every mutation is asked what happens if it runs twice, concurrently, or crashes halfway.
2. A checksum beats hope: the ledger invariant endpoint caught real bugs that UI testing never would have surfaced.
3. Boring choices scale well: BigInt minor units (no floats, ever) and one currency kept the money math airtight.
4. Shipping to a real phone for every feature caught integration bugs no emulator showed.

**Known limitations:**

- Test-mode payments only, not real-money operation.
- SGD only and full refunds only.
- Callbacks have retries but no persistent outbox.
- No end-to-end CI pipeline.

**Planned next steps:**

- **Durable callback delivery** — Callbacks have retries but no persistent outbox — add a durable callback queue with replay tooling and merchant-visible delivery logs.
- **Partial refunds & key handling** — Payments are test-mode only today, SGD-only with full refunds — extend to partial refunds and stronger merchant-secret handling.
- **Hardening & broader testing** — API rate limits, migrations and broader automated testing — there is no end-to-end CI pipeline yet.

**Roadmap:**

- Durable callback queue and replay tooling.
- Partial refunds and stronger merchant-secret handling.
- API rate limits, migrations and broader automated testing.

---

## Project 04: LilRoutine

- **Year:** 2026
- **Role:** Solo Design & Engineering
- **Tags:** Flutter, SQLite, Gemini REST API, Local-First
- **GitHub:** https://github.com/yemann2k39-jpg/lil_routine

**Subtitle:** A quieter way to track everyday habits.

**Description:** A cozy, offline-first Android app for water and meal tracking, with progress insights, a reactive mascot and optional Gemini-assisted food logging.

**Why it was built:** I wanted a small tracker I could actually enjoy opening each day, without accounts, syncing or a mandatory cloud service.

**Overview:** A cozy, offline-first Android app for water and meal tracking, with progress insights, a reactive mascot and optional Gemini-assisted food logging. A local-first app can stay simple if the database is treated as the source of truth — and it taught me to test device behavior, not just business logic.

**Problem:** Most tracking apps are accounts-plus-cloud: your daily water and meal log lives on someone else’s server, the app nags you with streak-shaming, and the “smart insights” are either hardcoded tips or require handing your food history to a backend. For a personal habit tracker, that’s the wrong trade — the data is private by nature, the app must work offline, and AI should be an opt-in layer, not a requirement.

**Solution:** LilRoutine is an Android app built entirely local-first: one unified SQLite log stores water drinks and food meals as rows in a single entries table, and every screen — rings, charts, streaks, insights — is derived from that file on the phone. A bring-your-own Gemini key unlocks two opt-in AI features: point a photo or a sentence at dinner and the app estimates macros into a pre-filled log form, and once a week a coach recap turns the week’s aggregate numbers into personalized tips. A deterministic insight engine (plain math, unit-tested) handles the day-to-day coaching without any AI at all, including cross-domain rules that connect water and food (a salty day suggests an extra glass of water).

**Key facts:**

- Android — platform
- Local SQLite — data — the source of truth
- 119 — passing tests

**How it is structured:**

- **Android UI:** Flutter screens and widgets
- **Services:** repositories, insights, reminders
- **Local data:** SQLite + secure key storage
- **Optional AI:** Gemini REST API

**How it works:**

1. Database: One SQLite file is the whole system of record. A unified entries table holds both water drinks and food meals, plus tables for the food library, quick-slots, habits and settings.
2. Repositories: Repositories wrap every query, and screens load data to hand plain numbers to pure-UI views, which is what makes the dashboards testable without a database.
3. Insight engine: A pure function, with a week of entries in and prioritized coaching cards out. No I/O, no AI.
4. AI provider: Makes exactly two calls (food estimate, weekly recap) straight to Gemini’s REST endpoint, locked behind a gate until a key exists in secure storage.
5. Reminder service: Applies the stored schedule on every launch and checks Android’s exact-alarm and battery-optimization realities.

**Tech stack:**

- **Mobile:** Flutter / Dart, Material theming + custom pixel widget set, Silkscreen & Varela Round fonts, image_picker
- **Data:** sqflite (SQLite), schema migrations v1→v3, repository layer per aggregate, flutter_secure_storage
- **AI / Integrations:** Gemini REST API (direct http, no SDK), vision + text estimates, BYO API key
- **System:** flutter_local_notifications, platform channel for battery-optimization checks, Android exact-alarm permission flow
- **Testing / Tools:** flutter_test (119 tests), sqflite_common_ffi in-memory SQLite, MockClient HTTP doubles, widget tests incl. PageView flings

**Feature details:**

### Unified Daily Log & Learned Food Library

Water drinks and food meals share one entries table (type, ml or kcal/macros, portion, timestamp, date key) with indexes on (type, date). Logging a meal writes the entry and upserts a foods library row (case-insensitive unique name, times_logged counter) — so the second time you log “ramen” it’s a two-tap relog with all macros remembered, and any logged meal can be edited in place afterwards.

### AI Food Logging (BYO Gemini Key)

A photo and/or one-line description goes to Gemini’s vision model over plain REST (no SDK; base64 inline image part) with a strict-JSON prompt for name, meal type, kcal, protein/carbs/fat/fiber/sugar/sodium and portion. The parser tolerates markdown fences and prose, falls back to friendly errors (timeout, bad key, wrong shape), and the estimate pre-fills the log form for review — nothing is saved until the user confirms. The key lives in flutter_secure_storage (Android Keystore-backed), never in SQLite or the APK.

### Deterministic Insight Engine

A pure function: week of entries in, cozy insight cards out. Rules cover water timing (front-loader vs evening drinker), dominant meal, late-night snacking, weekday/weekend protein contrasts, goal streaks with celebrations, and gentle goal suggestions when the target is consistently far off. Because they’re arithmetic over the user’s own logs, the results can’t be hallucinated — and the engine has 18 unit tests.

### Water–Food Cross-Domain Rules

Water and food are deliberately not separate silos: the engine correlates them — a day over 2,300 mg sodium before the water goal suggests an extra glass, a sugary afternoon triggers a hydration nudge, and a heavy dinner with low water yesterday queues a morning-water tip. The AI recap is explicitly instructed to weave the two together when the numbers support it.

### Weekly AI Coach Recap

Once every 7 days (Monday-anchored week key, persisted timestamp), if and only if a key is configured, the app sends one prompt containing the week’s aggregate numbers only — daily kcal, macros, sodium, sugar, water ml; never food names — and asks for 3–4 warm coaching tips as strict JSON. Results are cached in the settings table with per-week history, shown as cards, and every failure is silent: AI off means the rule-based insights simply fill the space.

### Streak Economy & Mascot Mood

A forgiving streak engine grants 3 hearts per calendar week; a missed completed day costs one, losing the last resets the streak, and today never costs a heart because it isn’t finished. A pixel mascot (Lil Drop) picks its expression from a top-down rule machine — sleeping window, 80%/60% goal thresholds, and a proportional behind-pace model computed with exact integer cross-multiplication so the mood adapts to any hour without magic checkpoints.

**Main features:**

- **Instant water logging** — Tap a cup, the ring and mascot react instantly. Undo and per-drink delete included.
- **Full macro meal log** — Log “ramen” once, relog it in two taps with every macro remembered. New meals come from an AI photo estimate (your own Gemini key), reviewed before saving.
- **Dashboards and insights** — Swipeable 7-day bars for water, kcal and macro splits, backed by insights that advise across both logs: a salty day suggests extra water. All plain math, never hallucinated.
- **A mascot on your side** — Lil Drop reacts to your real pace, with 3 forgiving weekly hearts and offline water reminders that survive Android’s battery rules.

**Interactive preview tabs:**

- **Instant water logging** — Tap a cup and the ring and mascot react instantly, with undo and per-drink delete for mistakes. Logging water takes one tap, not a form.
- **Full macro meal log** — Every meal is logged with full macros: protein, carbs, fat, fiber, sugar and sodium, with portion scaling and full edit-after-log support.
- **Dashboards and insights** — Swipeable 7-day bars for water, kcal and macro splits, backed by insights that advise across both logs: a salty day suggests extra water. All plain math, never hallucinated.
- **A mascot on your side** — Lil Drop reacts to your real pace, with 3 forgiving weekly hearts and offline water reminders that survive Android’s battery rules.
- **Learned food library** — Log “ramen” once and it becomes a two-tap relog, with every macro remembered for next time.
- **AI food logging** — A photo or a short description becomes a pre-filled estimate that you review before anything saves. It runs on your own Gemini key, so nothing is required from the app to work.
- **Weekly AI coach recap** — Once every 7 days, Gemini turns the week’s aggregate numbers into personalized tips, never seeing individual food names.
- **Water reminders** — Repeating reminders powered by Android exact alarms, with battery-optimization handling so they survive OEM restrictions.

**Implementation notes:**

### Architecture

Two-layer Flutter app: lib/core (database singleton, repositories, AI provider, insight engine, reminder service, theme) and lib/features (home shell, water, food, insights, mascot, settings, debug). Screens own data loading and delegate to pure-UI views, which makes every dashboard renderable in widget tests with fixture data and no database at all.

### Data model

Six tables: entries (the unified daily log — one row per drink or meal with nullable water/food columns and a yyyy-MM-dd date key), foods (learned library, case-insensitive unique names), drink_slots (quick-log buttons), habits + habit_logs (unique per habit/date), and a key-value settings table. Portion is stored per entry, so kcal and every macro aggregate through SQL SUM(value × portion) — editing a portion re-scales history correctly.

### Migrations on device

The database opens with schemaVersion 3 and onUpgrade handles v1→v2 (drink_slots table) and v2→v3 (fiber/sugar/sodium columns: nullable on entries, NOT NULL DEFAULT 0 on foods). The migration path is itself under test: a test builds a real v2 database file, reopens it through the app’s open function, and asserts the new columns exist via PRAGMA table_info.

### AI provider discipline

One AiProvider abstraction with GeminiProvider as the only implementation; both AI features parse with extract-first-JSON-object helpers that survive code fences, cap out-of-range values (portion clamped ≥1), and return typed results whose error branch always carries a human-readable reason. An AiGate keeps every AI surface locked until a key exists, so the app is fully functional with zero AI configuration.

### Reminders vs Android reality

Water reminders are a repeating local notification on a user-chosen interval, re-applied from settings on every launch. The service handles Android 13+ POST_NOTIFICATIONS permission and Android 12+ exact-alarm policy, and detects battery-optimization exemption through a platform channel — OEM battery managers (e.g. Samsung) freeze apps and silently queue reminder broadcasts, which was diagnosed on-device.

**Architecture highlights:**

- The app writes through repositories, then reloads aggregates from the local database — there is no remote account or synchronization layer to maintain. Local-first design keeps the everyday experience offline.
- Deterministic code computes insights; Gemini receives limited, numbers-based context for optional weekly recaps. The app does not depend on AI for its core math.
- Android alarm permissions, battery-optimization checks and schedule reapplication address reminders being delayed or stopped by the OS — device behavior mattered more than emulator behavior.

**Challenges & decisions:**

- **One table for water and food, not two** — Every chart, streak and day sheet stays a single query, with the cost of nullable columns hidden behind typed models. (Single-source data keeps every screen consistent.)
- **Local-first, no accounts** — A habit log is private by nature. The app works fully offline with zero configuration. (No remote account or synchronization layer to maintain.)
- **Rules compute, AI narrates** — Arithmetic insights are unit-testable and cannot hallucinate. The AI recap only sees aggregate numbers, and an estimate is never auto-saved without confirmation. (The app does not depend on AI for its core math.)
- **Reminders on real Android devices** — Exact-alarm permissions, battery-optimization checks and schedule reapplication address reminders being delayed or stopped by the OS. (Device behavior mattered more than emulator behavior.)

**Testing:** 119 Flutter tests cover rules, repository and migration logic, Gemini response handling and widget interactions. Static analysis passes. The app has been installed and launched on a physical Android device, though CI and device integration tests are not yet in place.

**Key lesson:** A local-first app can stay simple if the database is treated as the source of truth. It also taught me to test device behavior, not just business logic.

**Lessons learned:**

1. A local-first app stays simple when the database is treated as the source of truth.
2. Deterministic rules should coach, while AI should only explain.
3. Test device behavior on real hardware, not just business logic in the emulator.

**Known limitations:**

- Android-only and not released to an app store.
- Habit data structures exist, but the habit interface is not yet available.
- No backup/export or CI pipeline.
- Some goal and profile settings are still incomplete.

**Planned next steps:**

- **Finish the habit interface** — Habit data structures exist, but the habit interface is not yet available — plus mascot states and some incomplete goal and profile settings.
- **Data export & backup** — No backup or export path today — add both before any wider release.
- **Release preparation** — Android-only and not released to an app store — release preparation and device integration tests come next, along with CI.

**Roadmap:**

- Finish the habit interface and mascot states.
- Data export and backup.
- Release preparation and device integration tests.

---

## Grounding rules for the assistant

- Answer from the full approved knowledge folder (this document, about-me, general, 2c2p internship, per-project supplements) and the portfolio website itself. `general.md` remains authoritative for scope and boundary rules.
- On-topic: Ye Mann Kyaw, his skills, his projects, his experience, how to contact or hire him.
- Off-topic (general knowledge, news, other people, coding help, opinions): politely decline and steer back to the portfolio.
- If the answer is not in the sources, say so honestly instead of guessing.
- Never invent facts, numbers, dates or links that are not in the sources.
- Where a supplement and this document disagree, prefer the more cautious wording and note the uncertainty.