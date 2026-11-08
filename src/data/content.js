// ————————————————————————————————————————————————
// SITE CONTENT — edit this file to update the portfolio.
// ————————————————————————————————————————————————

export const caseStudies = [
  {
    slug: 'minipay',
    num: '01',
    title: 'MiniPay',
    standfirst:
      'A mobile-first digital wallet and merchant payment gateway built on a double-entry ledger core — with a public merchant API, hosted checkout, HMAC-signed callbacks and a Stripe-funded treasury.',
    tags: ['Full-Stack', 'Payments / Fintech', 'System Design'],
    year: '2026',
    role: 'Solo Design & Engineering',
    cover: 'images/minipay.svg',
    overview: 'A mobile-first digital wallet and merchant payment gateway built on a double-entry ledger core — a Flutter app, a NestJS API and a React admin dashboard in one monorepo, with a public merchant API, hosted checkout, HMAC-signed webhooks and a Stripe-funded treasury.',
    motivation: 'I wanted to learn how real payment systems actually work. Most apps store a balance column and mutate it — that breaks the moment two requests race, a webhook retries, or a refund partially completes. MiniPay was a deliberate exercise in doing money the way banks do: journal entries, idempotency keys and auditability instead of a number in a column.',
    stats: [
      { value: '15', label: 'Prisma models in one schema' },
      { value: '0', label: 'stored balances — derived from journal lines' },
      { value: '3', label: 'apps in one monorepo: mobile, API, admin' },
      { value: '2–10s', label: 'signed webhook retry schedule' },
    ],
    architecture: {
      diagram: 'images/minipay/architecture.svg',
      points: [
        'Balances derive from balanced journal lines — a ledger-invariant endpoint re-verifies the math after any movement.',
        'Deposits are credited only by the signature-verified Stripe webhook: the single writer, idempotent by payment-intent ID.',
        'Per-account Postgres advisory locks, sorted to prevent deadlocks, serialize concurrent postings.',
      ],
    },
    features: [
      { title: 'Double-Entry Ledger Core', text: 'No balance column exists: balances derive from balanced journal lines, and an invariant endpoint proves every entry balances and no wallet goes negative.', img: 'images/minipay/vid-ledger.svg', video: true },
      { title: 'Merchant Gateway & Hosted Checkout', text: 'Hashed API keys, a hosted checkout page and HMAC-SHA256 signed callbacks with retries — settled through an atomic status claim.', img: 'images/minipay/vid-checkout.svg', video: true },
      { title: 'Concurrency-Safe Transfers', text: 'Advisory locks serialize postings; idempotency keys make retried webhooks or double-submits impossible to post twice.', img: 'images/minipay/vid-transfers.svg', video: true },
      { title: 'AI Receipt Splitting', text: 'A receipt photo goes to Gemini’s vision model server-side; a unit-tested calculator splits shares with exact-sum guarantees.', img: 'images/minipay/vid-split.svg', video: true },
    ],

    liveUrl: null,
    problem:
      'Money features in most apps store a balance column and mutate it. That breaks down the moment two requests race, a webhook retries, or a refund partially completes: balances drift, transfers double-post, and nobody can prove the books are consistent. Small merchants also lack a simple, programmable way to accept wallet payments and get notified reliably.',
    solution:
      'MiniPay is a three-app monorepo built the way real payment systems are: a Flutter consumer/merchant app (one app, personal and business modes), a NestJS REST API with a double-entry ledger at its core, and a React admin dashboard. Balances are never stored — they are derived from balanced journal lines. Every money movement is idempotent, concurrency-serialized, and verifiable through a ledger invariant endpoint. Merchants register in-app, get hashed API keys with rotation, a hosted checkout page, and HMAC-SHA256 signed webhooks.',
    deepFeatures: [
      {
        title: 'Double-Entry Ledger Core',
        text: 'No balance column exists. Every movement is a JournalEntry with balanced JournalLine debits and credits in BigInt minor units across WALLET, TREASURY, FEES, CLEARING and MERCHANT accounts, and wallet balances are derived by aggregating lines. A GET /ledger/invariant endpoint re-verifies that every entry balances and no wallet is negative — money math you can audit.',
        img: null,
        caption: null,
      },
      {
        title: 'Concurrency-Safe Money Movement',
        text: 'Every posting takes a transaction-scoped Postgres advisory lock per touched account (account IDs sorted to prevent deadlocks), so concurrent transfers of the same wallet serialize instead of racing. Journal entries carry unique idempotency keys (pi_<stripe-id>, checkout_<id>, refund_<id>), meaning retried webhooks or double-submits can never post twice.',
        img: null,
        caption: null,
      },
      {
        title: 'Merchant Gateway & Hosted Checkout',
        text: 'Merchants register in-app (one transaction creates the merchant user, ledger account and MP-XXXXXXXX code), then call a public REST API authenticated by X-API-Key. The API creates checkout sessions with a 15-minute TTL, serves a server-rendered hosted checkout page, and settles payment through an atomic PENDING→PAID status claim followed by a balanced MERCHANT_PAYMENT ledger entry — rolled back if the ledger post fails.',
        img: null,
        caption: null,
      },
      {
        title: 'HMAC-SHA256 Signed Callbacks',
        text: 'When a checkout is paid, the API fires an HMAC-SHA256 signed webhook (X-MiniPay-Signature, hex digest of the raw body) to the merchant\u2019s callback URL, with retry attempts at 2s/5s/10s and a 10-second delivery timeout. Delivery never blocks or fails the customer\u2019s payment response.',
        img: null,
        caption: null,
      },
      {
        title: 'Sessions, PINs & Biometrics',
        text: 'Auth uses 15-minute JWT access tokens and 30-day refresh tokens that are rotated on every use and stored SHA-256-hashed with device metadata — users can list and revoke sessions, and password changes kill the others. Money movement requires a bcrypt-hashed 6-digit payment PIN (deliberately a 400, not a 401, so a typo can\u2019t log you out), and the app unlocks with biometrics via Keystore-backed secure storage.',
        img: null,
        caption: null,
      },
      {
        title: 'AI Receipt Splitting',
        text: 'Bill splits start with a photo: the API calls Gemini\u2019s vision model server-side (the key never ships in the APK) to extract line items from a receipt, then a pure, unit-tested calculator divides shares with exact-sum guarantees across extra charges and discounts. Requests are only sent after explicit review — the creator is always a shareholder but never auto-charged.',
        img: null,
        caption: null,
      },
    ],
    stack: [
      { label: 'Mobile', items: ['Flutter / Dart', 'dio', 'flutter_secure_storage', 'local_auth', 'mobile_scanner', 'qr_flutter', 'fl_chart', 'flutter_local_notifications'] },
      { label: 'Backend', items: ['NestJS 11 (TypeScript)', 'Passport JWT', 'bcrypt', 'class-validator DTOs', 'Stripe SDK', 'qrcode'] },
      { label: 'Database', items: ['PostgreSQL 16 (Docker)', 'Prisma 6 ORM', 'pg_advisory_xact_lock'] },
      { label: 'Integrations', items: ['Stripe PaymentIntents + webhooks', 'Gemini vision API (server-side)'] },
      { label: 'Admin Dashboard', items: ['React 19', 'Vite', 'TypeScript (strict)'] },
      { label: 'Testing / Tools', items: ['Jest unit specs', 'Node E2E verify scripts', 'Stripe CLI', 'Docker Compose'] },
    ],
    implementation: [
      {
        title: 'Architecture',
        text: 'A monorepo of three apps over one API: apps/mobile (Flutter, Android), apps/api (NestJS, port 3000) and apps/admin (React). The API is organised into domain modules — auth, ledger, wallet, payments, merchants, merchant-api, checkout, transfers, requests, split, contacts, notifications, admin — each with its own guards, DTOs and services.',
      },
      {
        title: 'Data model',
        text: '15 Prisma models: User, LedgerAccount, JournalEntry, JournalLine, Transaction, Merchant, CheckoutSession, MoneyRequest, SplitSession/SplitItem/SplitParticipant, Contact, Notification, RefreshToken and IdempotencyKey. Checkout sessions are unique per (merchant, orderRef); transactions carry a unique Stripe payment-intent ID so Stripe events and ledger postings can always be reconciled.',
      },
      {
        title: 'Deposits: webhook as single writer',
        text: 'Card deposits create a PENDING transaction and a Stripe PaymentIntent; the wallet is credited only by the signature-verified payment_intent.succeeded webhook, posting with idempotency key pi_<paymentIntentId>. The API keeps the raw request body (custom express parser) so Stripe signatures verify byte-exact, and permanently-failed payments are acked with 200 so Stripe doesn\u2019t retry forever.',
      },
      {
        title: 'Server-enforced limits & risk control',
        text: 'P2P transfers enforce per-transfer bounds (S$1–S$5,000) and an optional user-set daily spend limit, computed server-side from the day\u2019s completed and pending transfers. Admins can freeze accounts and merchants: frozen users can still receive money but every user-initiated movement — deposits, transfers, payments, requests, splits — is blocked at the endpoint level, and frozen merchants can\u2019t create checkout sessions while existing payable ones stay live.',
      },
      {
        title: 'Mobile API client',
        text: 'A single dio interceptor attaches tokens from secure storage, silently refreshes once on 401 and retries, and never refreshes on auth endpoints — with business errors mapped away from 401 so wrong PINs can\u2019t masquerade as expired sessions. minipay:// payment URIs (merchant codes, checkout sessions, personal receive QRs) are parsed by the in-app QR scanner.',
      },
    ],
    challenges: [
      {
        title: 'Balances that can\u2019t race or double-post',
        text: 'Mutable balance columns fail under concurrency and retries. Solving this meant deriving balances from journal lines, serializing postings with per-account advisory locks taken in sorted order (deadlock prevention), and short-circuiting duplicate idempotency keys inside the same transaction. A GET /ledger/invariant endpoint proves the invariant after any money change during testing.',
      },
      {
        title: 'Asset vs liability direction',
        text: 'Deposits initially failed with \u201cinsufficient funds\u201d because the treasury (an asset) was treated like a wallet (a liability). The fix was respecting each account kind\u2019s natural direction — debits increase assets, credits increase liabilities — which is the kind of bug that makes double-entry bookkeeping worth the upfront cost.',
      },
      {
        title: 'Refunds that either fully happen or don\u2019t',
        text: 'A refund is two writes: flip the sale to REFUNDED and post a balanced REFUND ledger entry. Doing them naively can strand a refunded sale without a ledger rollback. The implementation claims the sale atomically with a status-guarded update, posts the ledger entry, and rolls the claim back if the posting fails.',
      },
      {
        title: 'Webhooks you can\u2019t trust twice',
        text: 'Stripe retries webhooks, so crediting on every call would double-deposit. The webhook is the only code path that credits deposits, every credit is idempotent by payment-intent ID, and the raw body is preserved through a custom JSON parser so signature verification never sees a re-serialized payload.',
      },
      {
        title: 'When the ORM fights the database',
        text: 'pg_advisory_xact_lock() returns void, which Prisma cannot deserialize — wrapping it in CAST(... AS TEXT) made advisory locking usable through the ORM. Similarly, a wrong payment PIN returning 401 made the mobile client treat it as an expired session and rotate tokens; PIN rejection became a 400 business error, cleanly separating \u201cwrong input\u201d from \u201cnot authenticated\u201d.',
      },
    ],
    testing:
      'A Node end-to-end script (apps/api/scripts/verify-checkout.js) exercises the whole merchant flow live: admin key rotation, checkout creation via X-API-Key, a local callback listener that verifies the HMAC signature header, in-app payment, and status polling. Further scripts cover account-freeze enforcement and the bill-split lifecycle (creator-as-shareholder, discount/exact-sum math, re-send rules). Jest unit specs cover the split calculator\u2019s share computation and API-key format/hashing.',
    future: [
      {
        title: 'Durable Webhook Delivery',
        text: 'Persisting callback deliveries with an exponential-backoff retry queue and merchant-visible delivery logs, instead of the current in-process retry schedule.',
      },
      {
        title: 'Partial Refunds & Payout Rails',
        text: 'Extending the full-refund flow to partial amounts, and moving withdraw-to-wallet payouts onto external payout rails with their own ledger account types.',
      },
      {
        title: 'OS-Level Deep Links & Production Key Storage',
        text: 'Registering minipay:// URIs as Android app links so checkout QRs open outside the in-app scanner, and encrypting the callback-signing copy of merchant API keys at rest.',
      },
    ],
  },
  {
    slug: 'lil-routine',
    num: '02',
    title: 'LilRoutine',
    standfirst:
      'A local-first, pixel-art water / calorie / habit tracker for Android — every insight computed on-device from a unified SQLite log, with an optional bring-your-own-key Gemini layer for AI food logging and a weekly coach recap.',
    tags: ['Mobile App', 'Local-First Data', 'AI / LLM'],
    year: '2026',
    role: 'Solo Design & Engineering',
    cover: 'images/lil-routine.svg',
    mobile: true,
    overview: 'A local-first, pixel-art water, calorie and habit tracker for Android — every insight is computed on-device from one unified SQLite log, with an optional bring-your-own-key AI layer for food logging and a weekly coach recap.',
    motivation: 'Tracking data is private by nature, and habit apps must work offline. I built LilRoutine to prove two things: that deterministic math can coach better than hallucinated tips, and that AI should be an opt-in layer you bring a key to — not an account you surrender your food history to.',
    stats: [
      { value: '119', label: 'Flutter tests, all green' },
      { value: '1', label: 'unified SQLite log for water + food' },
      { value: 'v1→v3', label: 'on-device migrations, tested' },
      { value: 'BYO', label: 'Gemini key — AI is opt-in' },
    ],
    architecture: {
      diagram: 'images/lil-routine/architecture.svg',
      points: [
        'One unified entries table drives rings, charts, streaks and insights through SQL aggregates.',
        'Schema migrations run on-device (v1→v3) and are themselves covered by tests.',
        'An AiProvider gate keeps every AI surface locked until a key exists — fully functional with zero AI.',
      ],
    },
    features: [
      { title: 'Unified Daily Log & Food Library', text: 'Water and meals share one log; log “ramen” once and it becomes a two-tap relog with every macro remembered.', img: 'images/lil-routine/ph-log.svg', video: true },
      { title: 'AI Food Logging (BYO key)', text: 'A photo becomes pre-filled macros for review — nothing saves until you confirm, and the key never leaves secure storage.', img: 'images/lil-routine/ph-ai.svg', video: true },
      { title: 'Deterministic Insight Engine', text: 'Water timing, late-night snacking, cross-domain hydration nudges — arithmetic over your own logs, backed by 18 unit tests.', img: 'images/lil-routine/ph-insights.svg', video: true },
      { title: 'Streak Economy & Pixel Mascot', text: 'A forgiving 3-hearts weekly streak and a mascot whose mood follows an exact, hour-aware pace model.', img: 'images/lil-routine/ph-streak.svg', video: true },
    ],

    liveUrl: null,
    problem:
      'Most tracking apps are accounts-plus-cloud: your daily water and meal log lives on someone else\u2019s server, the app nags you with streak-shaming, and the \u201csmart insights\u201d are either hardcoded tips or require handing your food history to a backend. For a personal habit tracker, that\u2019s the wrong trade — the data is private by nature, the app must work offline, and AI should be an opt-in layer, not a requirement.',
    solution:
      'LilRoutine is an Android app built entirely local-first: one unified SQLite log stores water drinks and food meals as rows in a single entries table, and every screen — rings, charts, streaks, insights — is derived from that file on the phone. A bring-your-own Gemini key unlocks two opt-in AI features: point a photo or a sentence at dinner and the app estimates macros into a pre-filled log form, and once a week a coach recap turns the week\u2019s aggregate numbers into personalized tips. A deterministic insight engine (plain math, unit-tested) handles the day-to-day coaching without any AI at all, including cross-domain rules that connect water and food (a salty day suggests an extra glass of water).',
    deepFeatures: [
      {
        title: 'Unified Daily Log & Learned Food Library',
        text: 'Water drinks and food meals share one entries table (type, ml or kcal/macros, portion, timestamp, date key) with indexes on (type, date). Logging a meal writes the entry and upserts a foods library row (case-insensitive unique name, times_logged counter) — so the second time you log \u201cramen\u201d it\u2019s a two-tap relog with all macros remembered, and any logged meal can be edited in place afterwards.',
        img: null,
        caption: null,
      },
      {
        title: 'AI Food Logging (BYO Gemini Key)',
        text: 'A photo and/or one-line description goes to Gemini\u2019s vision model over plain REST (no SDK; base64 inline image part) with a strict-JSON prompt for name, meal type, kcal, protein/carbs/fat/fiber/sugar/sodium and portion. The parser tolerates markdown fences and prose, falls back to friendly errors (timeout, bad key, wrong shape), and the estimate pre-fills the log form for review — nothing is saved until the user confirms. The key lives in flutter_secure_storage (Android Keystore-backed), never in SQLite or the APK.',
        img: null,
        caption: null,
      },
      {
        title: 'Deterministic Insight Engine',
        text: 'A pure function: week of entries in, cozy insight cards out. Rules cover water timing (front-loader vs evening drinker), dominant meal, late-night snacking, weekday/weekend protein contrasts, goal streaks with celebrations, and gentle goal suggestions when the target is consistently far off. Because they\u2019re arithmetic over the user\u2019s own logs, the results can\u2019t be hallucinated — and the engine has 18 unit tests.',
        img: null,
        caption: null,
      },
      {
        title: 'Water\u2013Food Cross-Domain Rules',
        text: 'Water and food are deliberately not separate silos: the engine correlates them — a day over 2,300 mg sodium before the water goal suggests an extra glass, a sugary afternoon triggers a hydration nudge, and a heavy dinner with low water yesterday queues a morning-water tip. The AI recap is explicitly instructed to weave the two together when the numbers support it.',
        img: null,
        caption: null,
      },
      {
        title: 'Weekly AI Coach Recap',
        text: 'Once every 7 days (Monday-anchored week key, persisted timestamp), if and only if a key is configured, the app sends one prompt containing the week\u2019s aggregate numbers only — daily kcal, macros, sodium, sugar, water ml; never food names — and asks for 3\u20134 warm coaching tips as strict JSON. Results are cached in the settings table with per-week history, shown as cards, and every failure is silent: AI off means the rule-based insights simply fill the space.',
        img: null,
        caption: null,
      },
      {
        title: 'Streak Economy & Mascot Mood',
        text: 'A forgiving streak engine grants 3 hearts per calendar week; a missed completed day costs one, losing the last resets the streak, and today never costs a heart because it isn\u2019t finished. A pixel mascot (Lil Drop) picks its expression from a top-down rule machine — sleeping window, 80%/60% goal thresholds, and a proportional behind-pace model computed with exact integer cross-multiplication so the mood adapts to any hour without magic checkpoints.',
        img: null,
        caption: null,
      },
    ],
    stack: [
      { label: 'Mobile', items: ['Flutter / Dart', 'Material theming + custom pixel widget set', 'Silkscreen & Varela Round fonts', 'image_picker'] },
      { label: 'Data', items: ['sqflite (SQLite)', 'schema migrations v1\u2192v3', 'repository layer per aggregate', 'flutter_secure_storage'] },
      { label: 'AI / Integrations', items: ['Gemini REST API (direct http, no SDK)', 'vision + text estimates', 'BYO API key'], },
      { label: 'System', items: ['flutter_local_notifications', 'platform channel for battery-optimization checks', 'Android exact-alarm permission flow'] },
      { label: 'Testing / Tools', items: ['flutter_test (119 tests)', 'sqflite_common_ffi in-memory SQLite', 'MockClient HTTP doubles', 'widget tests incl. PageView flings'] },
    ],
    implementation: [
      {
        title: 'Architecture',
        text: 'Two-layer Flutter app: lib/core (database singleton, repositories, AI provider, insight engine, reminder service, theme) and lib/features (home shell, water, food, insights, mascot, settings, debug). Screens own data loading and delegate to pure-UI views, which makes every dashboard renderable in widget tests with fixture data and no database at all.',
      },
      {
        title: 'Data model',
        text: 'Six tables: entries (the unified daily log — one row per drink or meal with nullable water/food columns and a yyyy-MM-dd date key), foods (learned library, case-insensitive unique names), drink_slots (quick-log buttons), habits + habit_logs (unique per habit/date), and a key-value settings table. Portion is stored per entry, so kcal and every macro aggregate through SQL SUM(value \u00d7 portion) — editing a portion re-scales history correctly.',
      },
      {
        title: 'Migrations on device',
        text: 'The database opens with schemaVersion 3 and onUpgrade handles v1\u2192v2 (drink_slots table) and v2\u2192v3 (fiber/sugar/sodium columns: nullable on entries, NOT NULL DEFAULT 0 on foods). The migration path is itself under test: a test builds a real v2 database file, reopens it through the app\u2019s open function, and asserts the new columns exist via PRAGMA table_info.',
      },
      {
        title: 'AI provider discipline',
        text: 'One AiProvider abstraction with GeminiProvider as the only implementation; both AI features parse with extract-first-JSON-object helpers that survive code fences, cap out-of-range values (portion clamped \u22651), and return typed results whose error branch always carries a human-readable reason. An AiGate keeps every AI surface locked until a key exists, so the app is fully functional with zero AI configuration.',
      },
      {
        title: 'Reminders vs Android reality',
        text: 'Water reminders are a repeating local notification on a user-chosen interval, re-applied from settings on every launch. The service handles Android 13+ POST_NOTIFICATIONS permission and Android 12+ exact-alarm policy, and detects battery-optimization exemption through a platform channel — OEM battery managers (e.g. Samsung) freeze apps and silently queue reminder broadcasts, which was diagnosed on-device.',
      },
    ],
    challenges: [
      {
        title: 'One table for water and food, without chaos',
        text: 'Two entry types could have become two parallel tables and duplicated every query. The unified entries table keeps the daily log, undo, day sheets and history dashboards as single queries filtered by type — at the cost of nullable columns, which the repository layer hides behind typed models (Entry.isWater, effectiveKcal) so callers never branch on raw rows.',
      },
      {
        title: 'AI answers you can actually parse',
        text: 'LLM answers arrive wrapped in prose or markdown fences, and hallucinated shapes are inevitable. Every AI path extracts the first JSON object, validates field-by-field with typed fallbacks (unknown meal \u2192 snack, zero portion \u2192 1, non-numeric \u2192 parse-or-zero), and turns any failure into a friendly message instead of a crash — verified against MockClient tests for block responses, bad keys, rate limits and non-JSON answers.',
      },
      {
        title: 'Personalization that can\u2019t hallucinate',
        text: 'Coaching insights made of arithmetic (timing shares, streaks, macro contrasts) don\u2019t need a model — and deterministic rules can be unit-tested to the assertion. The split: rules compute, AI narrates. The weekly recap only ever sees aggregate numbers, gets an explicit \u201cthis week specifically, mention real numbers, never invent data\u201d instruction, and its output is shape-validated before caching.',
      },
      {
        title: 'A schedule Android wants to kill',
        text: 'The repeating reminder silently stopped on a Samsung device: the OEM battery manager freezes the app and queues the alarm broadcasts. The fix combines exact-alarm permission routing (the system settings page), a battery-optimization exemption check exposed through a method channel, and re-applying the stored schedule on every app start so settings and reality can\u2019t drift.',
      },
      {
        title: 'Charts that tests can see',
        text: 'The meals dashboard swaps pages in a swipeable PageView, which builds lazily — widget tests can\u2019t find page-2 widgets until a fling happens. Tests drive the gesture (tester.fling + pumpAndSettle) and then assert the macro page\u2019s gram labels, and the fixed-height chart math (goal line, in-bar labels, segment heights) was tuned against real layout overflow errors surfaced by those same tests.',
      },
    ],
    testing:
      '119 Flutter tests, all green with a clean analyzer: pure-logic units (insight engine rules, mascot mood machine, streak/hearts engine, JSON parsers), repository + migration tests against real in-memory SQLite (sqflite_common_ffi, including PRAGMA assertions on the v2\u2192v3 path), GeminiProvider tests over MockClient (success, fences, bad key, rate limit, blocked, non-JSON), and widget tests that pump full dashboards from fixtures — including driving a PageView fling to reach the lazily-built macro chart page.',
    future: [
      {
        title: 'AI Food Swaps',
        text: 'Tap a logged meal for a \u201clighter version / more protein\u201d suggestion from the same provider, reusing the existing estimate-parse-confirm pipeline.',
      },
      {
        title: 'Ask-the-Coach Chat',
        text: 'Productize the existing debug AI chat into a small coach screen with today\u2019s aggregate stats injected as context.',
      },
      {
        title: 'Habits & Mood System',
        text: 'The schema and repositories for habits already exist; the remaining work is the UI plus the reserved mascot expressions (sad art is shipped but unused), and moving the pinned water goal to full profile management in settings.',
      },
    ],
  },
  {
    slug: 'sus-url-shortener',
    num: '03',
    title: 'Sus URL Shortener',
    standfirst:
      'A Next.js URL shortener with a prank twist — "sus" links show a deadpan warning interstitial before they (almost certainly) lead to the real site — built on Feistel-cipher collision-free codes, a swappable single-file storage layer, and from-scratch scrypt auth.',
    tags: ['Full-Stack Web', 'Databases', 'Security'],
    year: '2026',
    role: 'Solo Design & Engineering',
    cover: 'images/sus-url-shortener.svg',
    mobile: true,
    overview: 'A Next.js URL shortener where every link goes exactly where it claims — with an optional deadpan “sus” interstitial for comedy. Underneath: collision-free code generation, real accounts, buffered analytics and a documented scaling path.',
    motivation: 'Built for fun first: hobby shorteners are usually CRUD demos, and I wanted one that is genuinely playful yet engineered like a production service. It became an experiment in how far a “one small script” can be pushed before it is real infrastructure — codes, cache, counters, auth and rate limits all hand-rolled.',
    stats: [
      { value: '0', label: 'collision checks — unique by construction' },
      { value: '1 INSERT', label: 'to create a link, forever' },
      { value: '5s', label: 'buffered click flush, one transaction' },
      { value: '56 lines', label: 'hand-rolled LRU+TTL cache' },
    ],
    architecture: {
      diagram: 'images/sus/architecture.svg',
      points: [
        'Single-file storage: the engine swaps by rewriting one module — proven when node:sqlite became LibSQL/Turso.',
        'Edge middleware rate-limits every hit before the redirect route runs.',
        'Auth from scratch: scrypt hashing, SHA-256-hashed tokens, single-use email verification.',
      ],
    },
    features: [
      { title: 'Create', text: 'One INSERT: the rowid is scrambled through a 4-round Feistel network into a unique 6-character code.', img: 'images/sus/ph-create.svg' },
      { title: 'Share', text: 'Instant redirects — or the deadpan sus interstitial, naming the real host behind a “Continue” button.', img: 'images/sus/ph-share.svg', video: true },
      { title: 'Click', text: 'An LRU cache answers the hot path; a miss hits one indexed query. Misses are never cached.', img: 'images/sus/ph-click.svg' },
      { title: 'Count', text: 'Clicks buffer in memory and flush every 5 seconds as one batched transaction.', img: 'images/sus/ph-count.svg' },
    ],

    liveUrl: null,
    hero: 'images/sus/hero.svg',
    story: {
      steps: [
        {
          title: 'Create',
          text: 'One INSERT. The link\u2019s rowid is scrambled through a 4-round Feistel network into a unique 6-character code — no collision checks, ever.',
          img: 'images/sus/ph-create.svg',
        },
        {
          title: 'Share',
          text: 'Every link goes exactly where it claims. \u201cSus\u201d links add a deadpan warning interstitial before the real destination.',
          img: 'images/sus/step-2-share.svg',
        },
        {
          title: 'Click',
          text: 'An in-memory LRU cache answers the hot path; a miss hits one indexed query. Misses are never cached, so fresh links can\u2019t be shadowed.',
          img: 'images/sus/ph-click.svg',
        },
        {
          title: 'Count',
          text: 'Clicks buffer in memory and flush every 5 seconds as one batched transaction — counting never slows the redirect.',
          img: 'images/sus/ph-count.svg',
        },
      ],
      stats: [
        { value: '0', label: 'collision checks — codes are unique by construction' },
        { value: '1 INSERT', label: 'to create a link, forever' },
        { value: '5s', label: 'buffered click flush, one batched transaction' },
        { value: '56 lines', label: 'hand-rolled LRU+TTL cache' },
      ],
      videos: [
        { title: 'The sus interstitial, live', img: 'images/sus/ph-share.svg' },
        { title: 'Dashboard, QR codes & two-step delete', img: 'images/sus/video-dashboard.svg' },
      ],
      highlight: {
        title: 'Collision-free codes, without existence checks',
        text: 'Random-code generators slow down as the table grows and still need retry loops. Sus instead treats each code as a bijective Feistel permutation of the rowid over a 2\u00b3\u2074 space: uniqueness is inherited from the primary key, so creating a link stays a single INSERT for the life of the app.',
        img: 'images/sus/highlight-feistel.svg',
      },
    },
    stack: [
      { label: 'Framework', items: ['Next.js 15 (App Router)', 'React 19 client components', 'Server-rendered pages'] },
      { label: 'Data', items: ['SQLite via LibSQL (dual-mode)', 'Turso when configured', 'Buffered click counting', 'Hand-rolled LRU+TTL cache'] },
      { label: 'Auth & Security', items: ['scrypt password hashing', 'SHA-256-hashed session tokens', 'Edge rate limiting'] },
      { label: 'Integrations', items: ['Brevo verification email', 'qrcode (client-side PNGs)'] },
    ],
    testing:
      'A curl-based end-to-end script drives registration, auth, duplicate detection and rate-limit behaviour with PASS/FAIL per check, plus a smoke test against a real remote Turso database.',
    problem:
      'Most hobby URL shorteners are CRUD demos: random collision-prone codes checked with retry loops, click counters that write to disk on the hot path, no real accounts, and sessions stored in plaintext. I wanted one that is genuinely fun — every link goes where it claims, the vibe is the only thing that changes — but engineered underneath like a production service: collision-free code generation, email-verified accounts, hashed credentials, rate limiting on every endpoint, and an honest scaling path.',
    solution:
      'Sus URL Shortener is a Next.js 15 App Router application (JavaScript, React 19 client components, server-component pages) with hand-written neo-brutalist CSS and no UI framework. Its signature idea is the code generator: each link\u2019s AUTOINCREMENT rowid is scrambled through a 4-round Feistel network over a 2^34 space and Base62-encoded to exactly 6 characters, so codes are unique by construction and creating a link is a single INSERT with zero collision checks. All storage is isolated in one file behind a dual-mode LibSQL driver — remote Turso when configured, a local SQLite file otherwise — with a real migration history: the original node:sqlite build was swapped to @libsql/client by reimplementing that single module, and a legacy links.json store was imported into SQLite on first boot. Auth (scrypt hashing, SHA-256-hashed tokens, email verification via the Brevo HTTP API) is built from scratch with no auth library; QR codes render client-side with the qrcode package.',
    deepDive: {
      features: [
      {
        title: 'The Sus Interstitial',
        text: 'Links support two redirect modes. The signature one renders a deadpan warning page at the sus URL itself — "This link is extremely suspicious\u2026 we make no guarantees" — naming the real destination host behind a "Continue to {host}" button. It is comedy on the surface, but a clean server-side mode switch underneath: one route handles both instant redirects and the interstitial.',
        img: null,
        caption: null,
      },
      {
        title: 'Collision-Free Codes by Construction',
        text: 'Instead of generating random codes and re-querying the database for collisions, the public code is a bijective permutation of the rowid: a 4-round Feistel network (mixing with Knuth\u2019s multiplicative constant) over a 2^34 space, Base62-encoded through BigInt arithmetic to exactly 6 characters. Two different IDs can never produce the same code, so creation stays a single INSERT; the database\u2019s unique index is kept only as a defensive safety net. If the band is ever exhausted (~17 billion links), codes gracefully grow longer rather than ever reusing one.',
        img: null,
        caption: null,
      },
      {
        title: 'Buffered Click Counting',
        text: 'Redirects are the hottest path, so clicks never touch the disk there: recordClick increments an in-memory buffer that flushes every 5 seconds as one batched transaction of increment deltas. The flush timer is unref()-ed so counting can never keep the process alive, failed flushes re-buffer instead of dropping counts, and the documented tradeoff is that a crash loses at most one flush window of analytics.',
        img: null,
        caption: null,
      },
      {
        title: 'Hand-Rolled LRU+TTL Cache',
        text: 'A 56-line cache built on a plain Map, using its insertion-order guarantee: get() re-inserts to refresh recency so the oldest key is always the least-recently-used eviction target, with per-entry TTL and hit/miss/eviction/expiry stats. One deliberate correctness rule: only positive lookups are cached — a cached miss could otherwise shadow a slug created moments later, a subtlety most naive caches get wrong.',
        img: null,
        caption: null,
      },
      {
        title: 'Edge Rate Limiting',
        text: 'A dependency-free fixed-window limiter avoids Node built-ins entirely, so the identical module imports in both Node-runtime route handlers and Next.js edge middleware. Middleware applies a per-IP limit to all link hits before the redirect route runs (returning a styled 429 with Retry-After); separate buckets guard creation, deletion, and auth, each tunable via environment variables.',
        img: null,
        caption: null,
      },
      {
        title: 'From-Scratch Auth & Email Verification',
        text: 'No auth library: passwords are scrypt-hashed (salted, timing-safe comparison), session and verification tokens are 32 random bytes stored only as SHA-256 hashes, and sessions live in httpOnly SameSite=Lax cookies (7-day default, 30-day remember-me). Registration mints a single-use 24-hour verification token sent through the Brevo HTTP API; unverified accounts are hard-gated because the verified flag is re-checked server-side on every session resolution — it can\u2019t ride an existing cookie into private pages.',
        img: null,
        caption: null,
      },
      {
        title: 'Owner-Scoped Dashboard & QR Codes',
        text: 'The dashboard is server-rendered per request, paginated at 10 links per page, and filtered by the account\u2019s owner key. Each row offers copy, a QR modal (480px PNG download, Escape/click-outside close, aria-modal), and two-step delete; the create-result screen renders a 240px preview plus a downloadable PNG immediately. Every QR is generated client-side from the qrcode package.',
        img: null,
        caption: null,
      },
    ],
    stack: [
      { label: 'Framework', items: ['Next.js 15 (App Router, JavaScript)', 'React 19 (client components)', 'Node.js'] },
      { label: 'Data', items: ['SQLite via @libsql/client (dual-mode driver)', 'Turso (remote LibSQL) when configured', 'Local file fallback + WAL', 'Buffered click counting (5s flush)', 'Hand-rolled LRU+TTL cache'] },
      { label: 'Auth & Security', items: ['scrypt password hashing', 'SHA-256-hashed server-side session tokens', 'httpOnly SameSite=Lax cookies', 'Single-use hashed verification tokens', 'Per-IP rate limiting (edge middleware + routes)'] },
      { label: 'Integrations', items: ['Brevo HTTP API (verification email)', 'qrcode (client-side QR PNGs)'] },
      { label: 'Frontend', items: ['Custom neo-brutalist CSS (no UI framework)', 'Server Components + server-side pagination'] },
      { label: 'Testing / Tools', items: ['Manual API verification suite (curl-based, PASS/FAIL)', 'Remote Turso smoke-test script', 'One-time migration + backup scripts'] },
    ],
    implementation: [
      {
        title: 'The Feistel code pipeline',
        text: 'createLink runs in one write transaction: INSERT a placeholder, take the AUTOINCREMENT rowid as the atomic counter, split its band index into two 17-bit halves, run 4 Feistel rounds, and Base62-encode to exactly 6 characters. A sanitized custom name is prepended (name-code), reserved app routes are dodged with in-memory set lookups — never a database read — and the slug\u2019s lowercase slug_key satisfies a UNIQUE index as a silent safety net.',
      },
      {
        title: 'Single-file storage abstraction',
        text: 'Everything touching storage lives in one module (lib/store.js) so the engine can be swapped by reimplementing that file — demonstrated in practice: the original node:sqlite build became @libsql/client without touching any route or page, and a legacy links.json store was batch-imported into SQLite on first boot (INSERT OR IGNORE, then renamed as a natural backup; failures retry next boot instead of crashing startup). getDb() lazily picks Turso or a local file from environment variables, with idempotent schema creation safe on cold starts.',
      },
      {
        title: 'Redirect hot path',
        text: 'Middleware rate-limits the hit, then the dynamic route checks the LRU cache before a single indexed equality query on slug_key. Redirect mode issues a temporary redirect; sus mode renders the interstitial at the same URL with no second hop. Unknown slugs fall through to a custom in-brand 404, and misses are never cached so a fresh create can\u2019t be shadowed.',
      },
      {
        title: 'Session & verification security',
        text: 'Registration validates username/email/password rules, maps database unique-constraint violations to typed duplicate errors, and stores verification tokens as SHA-256 with 24-hour expiry — consumed single-use inside a transaction. Login accepts username or email, fails with a generic error, and rejects unverified accounts with a distinct code so the client can route them to verification. Logout deletes the session row server-side, so even a copied cookie is dead afterwards.',
      },
      {
        title: 'Authorization without existence leaks',
        text: 'Delete requires a session, checks ownership, and returns the identical 404 for foreign and unknown slugs so the API never reveals which slugs exist. The resend-verification endpoint always answers 200 with a generic message for the same reason, and all list/dashboard queries are filtered by owner_key.',
      },
    ],
    challenges: [
      {
        title: 'Collision-free codes without existence checks',
        text: 'The usual generate-random-and-SELECT loop gets slower as the table grows and still needs retry handling. Reframing the code as a Feistel permutation of the primary key eliminates the problem class: Feistel networks are bijective by construction, so uniqueness is inherited from the rowid and a link is one INSERT. The tradeoff is stated honestly in the code: the cipher is obfuscation, not encryption — codes are scrambled, not secret.',
      },
      {
        title: 'Click counting at redirect speed',
        text: 'A synchronous UPDATE per hit would dominate redirect latency. Hits increment an in-memory buffer flushed every 5 seconds as one transaction, with deltas pushed back into the buffer on transaction failure so counts are never dropped mid-flush. The cost is explicit and deliberate: a crash loses at most one flush window of counts.',
      },
      {
        title: 'One rate limiter for two runtimes',
        text: 'Next.js middleware runs on the edge runtime, where Node built-ins don\u2019t exist. Writing the limiter and cache as pure JavaScript with zero Node imports let the same modules serve route handlers and middleware alike — and also keeps them honestly per-instance, documented as the first line of defense with a Redis-backed swap as the documented next step when the app runs distributed.',
      },
      {
        title: 'Verification you can\u2019t shortcut',
        text: 'Trusting a "verified" claim inside the session cookie would let an unverified user flip a client-side value. The gate re-reads the verified flag on every session resolution, verification tokens are single-use and hashed at rest, and email verification deliberately does not log you in — instead the registering tab holds its credentials in memory and polls login every 3 seconds until verification flips, auto-navigating to the dashboard without shared-session weirdness across tabs.',
      },
      {
        title: 'Migrating engines and legacy data without downtime',
        text: 'The storage layer\u2019s single-file constraint paid off twice: swapping node:sqlite for @libsql/client to unlock Turso was a rewrite of one module, and the old JSON store was imported on first boot with INSERT OR IGNORE batching, slug normalization, and a rename-to-.imported marker — failures log and retry on the next boot rather than crashing startup.',
      },
    ],
    testing:
      'Verification is manual and explicit rather than an automated suite: a curl-based end-to-end script drives registration validation, duplicate detection (including case-insensitivity), session auth, hash-leak checks, server-side logout, login-by-email, anonymous-vs-authenticated creation, and hammers login until the 429 rate limit fires — printing PASS/FAIL per check. A separate one-shot smoke test runs the full create/get/delete cycle against a real remote Turso database, including a cache-hit assertion, and cleans up after itself. Migration and wipe scripts round out the ops tooling.',
    },
    future: [
      {
        title: 'Redis-Backed Rate Limits & Cache',
        text: 'Swapping the per-instance in-memory limiter and cache for shared Redis stores so limits and hot links hold across multiple instances — the first step of the documented scaling path.',
      },
      {
        title: 'Edge Redirects',
        text: 'Serving hot redirects from CDN workers off a replicated key-value store, pushing the hottest links\u2019 latency toward DNS-level.',
      },
      {
        title: 'Slug-Keyed Sharding',
        text: 'The end of the documented scaling ladder: sharding the keyspace by slug — the natural shard key — once a single SQLite/Turso database stops being the right shape.',
      },
    ],
  },
  {
    slug: 'pc-shop',
    num: '04',
    title: 'PC Shop',
    standfirst:
      'A full-stack PC-parts store with an interactive 3D builder: a rules engine that catches incompatible builds live, FPS estimates grounded in real published benchmarks, a swappable payment gateway with HMAC-verified webhooks, and a catalog-grounded AI shopping assistant.',
    tags: ['Full-Stack Web', 'E-Commerce', '3D / WebGL', 'AI / LLM'],
    year: '2026',
    role: 'Solo Design & Engineering',
    cover: 'images/pc-shop.svg',
    overview: 'A full-stack PC-parts store with an interactive 3D builder: a live compatibility rules engine, FPS estimates grounded in real published benchmarks, a swappable payment gateway with HMAC-verified webhooks, and a catalog-grounded AI shopping assistant.',
    motivation: 'Parts stores treat components as isolated SKUs — nothing warns you a CPU will not fit your motherboard. I wanted compatibility, power and honest FPS numbers computed live while you build, in 3D. It was also a deliberate triple exercise: WebGL, payment-provider abstraction, and a grounded LLM assistant on a free tier.',
    stats: [
      { value: '12', label: 'live compatibility rules' },
      { value: '~100', label: 'real components seeded' },
      { value: '±8%', label: 'FPS estimate bands, benchmark-grounded' },
      { value: '4', label: 'catalog-grounded assistant tools' },
    ],
    architecture: {
      diagram: 'images/pc-shop/architecture.svg',
      points: [
        'The compatibility engine is pure functions, shared byte-for-byte by the browser builder and the AI tools.',
        'Benchmark rows (TechPowerUp, GPUCheck) ground FPS estimates: min(GPU, CPU cap) per resolution.',
        'A PaymentProvider abstraction swaps MiniPay, Stripe test mode or a local mock — checkout logic untouched.',
        'The webhook verifies HMAC-SHA256 over the raw body and transitions paid via compare-and-set.',
      ],
    },
    features: [
      { title: 'Interactive 3D Build Viewer', text: 'Every selected part renders as a GLB model inside the case; incompatible picks pulse red, driven live by the rules engine.', img: 'images/pc-shop/vid-3d.svg', video: true },
      { title: 'Live Compatibility Checks', text: 'Sockets, DDR4/DDR5, PSU headroom, GPU clearance — instant feedback on every selection, in the browser.', img: 'images/pc-shop/vid-rules.svg', video: true },
      { title: 'Benchmark-Grounded FPS', text: 'Real per-GPU and per-CPU data combined per resolution, with a measured-vs-fallback flag so numbers are never hand-waved.', img: 'images/pc-shop/vid-fps.svg', video: true },
      { title: 'Catalog-Grounded AI Assistant', text: 'A Groq-powered chat allowed to state only what live catalog tools return — specs, prices and compatibility included.', img: 'images/pc-shop/vid-assistant.svg', video: true },
    ],

    liveUrl: null,
    problem:
      'PC-part stores treat components as isolated SKUs: nothing tells you a CPU doesn\u2019t fit your motherboard until you own both, "gaming performance" is a marketing bullet with no methodology, and first-time builders have no way to see what they\u2019re buying. I wanted a shop where compatibility, power, and real FPS numbers are computed live while you build — in 3D.',
    solution:
      'PC Shop is a Next.js 16 / React 19 storefront over SQLite + Drizzle ORM with a seeded catalog of ~100 real components across 8 categories. A pure-function rules engine runs 12 compatibility checks on every builder change — in the browser for instant feedback and on the server for the AI assistant. FPS estimates combine real TechPowerUp and GPUCheck data with a min(GPU, CPU) model per resolution. Checkout runs through a payment-provider abstraction (MiniPay gateway, Stripe test mode, or a local mock) with an HMAC-SHA256-verified, idempotent webhook, and a Groq-powered assistant answers only from live catalog tool results.',
    deepFeatures: [
      {
        title: 'Live Compatibility Rules Engine',
        text: 'Twelve independent checks — CPU socket vs motherboard, DDR4/DDR5 memory type, board form factor vs case, GPU length, cooler socket and height, missing-GPU display output, PSU wattage, GPU/CPU bottleneck pairing, premium-board-with-DDR4 anti-pattern, high-draw-GPU PSU headroom, flagship-CPU cooling — each tagged with a stable rule id and severity (error / warning / info). Pure functions with no DB access, so the exact same engine runs client-side on every selection change and server-side inside the AI assistant\u2019s tools.',
        img: null,
        caption: null,
      },
      {
        title: 'Benchmark-Grounded Performance Estimates',
        text: 'A benchmark_data table is seeded with real published aggregate FPS: TechPowerUp game-database averages per GPU at 1080p/1440p/4K, and GPUCheck CPU 1080p ceilings measured with an RTX 4090 so the GPU never limits. Estimated FPS = min(GPU fps, CPU cap) per resolution — the same model GPUCheck/PC-Builds use — across AAA Ultra and Esports scenarios, reported as \u00b18% ranges for complete builds and \u00b115% for partial GPU+CPU picks, with a bottleneck classification (GPU-bound / CPU-bound / Balanced) and a CPU-limit percentage. Parts without benchmark rows fall back to relative performance indices, and the UI says which path produced the number.',
        img: null,
        caption: null,
      },
      {
        title: 'Interactive 3D Build Viewer',
        text: 'A react-three-fiber scene renders each selected part as a GLB model placed on slot anchors inside the case, with clickable "ghost" slots for empty categories, orbit controls and auto-rotate, RAM stick count derived from the chosen kit, an SSD in the M.2 slot and an HDD on its mount. Any category with an error finding pulses red via animated emissive tint — the compatibility engine drives the 3D feedback directly.',
        img: null,
        caption: null,
      },
      {
        title: 'Payment Provider Abstraction + Idempotent Webhook',
        text: 'Checkout talks to one PaymentProvider interface with three implementations selected by environment: the MiniPay gateway (hosted redirect checkout created with an API key), Stripe Checkout in test mode, and a local mock page for zero-config runs. The MiniPay webhook verifies an HMAC-SHA256 signature over the raw request body with timingSafeEqual (never re-serialized JSON), rejects amount mismatches with 409, and performs the pending\u2192paid transition as a compare-and-set UPDATE ... WHERE status = \'pending\' — retried callbacks no-op, and each discount redemption is counted exactly once inside the same transaction.',
        img: null,
        caption: null,
      },
      {
        title: 'Grounded AI Shopping Assistant',
        text: 'A tool-loop chat over any OpenAI-compatible endpoint (Groq) with four catalog-grounded tools: product search, product details, compatibility checking, and build performance estimation. The system prompt forbids stating any spec, price, or compatibility claim that didn\u2019t come from a tool result, requires product links, and injects page context — on the builder page "my build" means the current selection. Rate-limit resilient: 429 responses parse Groq\u2019s "try again in X.XXs" hint and retry within the window, while history trimming and capped tool results keep each turn inside the free tier\u2019s token budget.',
        img: null,
        caption: null,
      },
      {
        title: 'Accounts, Orders & Admin',
        text: 'Customer accounts use scrypt-hashed passwords with per-user salts and revocable server-side sessions (256-bit tokens in httpOnly cookies). Checkout never trusts client prices — every line is re-read and re-priced server-side, discounts re-validated, stock enforced — and orders store denormalized price snapshots. An admin dashboard (separate single-admin auth) manages products, orders, discounts (percent/fixed, per-product scoping, redemption caps), and saved builds; any build can be shared anonymously via a public link.',
        img: null,
        caption: null,
      },
    ],
    stack: [
      { label: 'Frontend', items: ['Next.js 16 (App Router, RSC, server actions)', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'react-three-fiber + drei + Three.js (GLB models)'] },
      { label: 'Backend', items: ['Next.js Route Handlers', 'Server Actions', 'node:crypto (scrypt, HMAC-SHA256)', 'MiniPay NestJS gateway (external service)'] },
      { label: 'Database', items: ['SQLite (better-sqlite3)', 'Drizzle ORM + drizzle-kit migrations', 'JSON columns for specs / order items / build selections', 'Composite indexes for category-price queries'] },
      { label: 'APIs & Integrations', items: ['MiniPay merchant API (X-API-Key, hosted checkout, HMAC-signed callbacks)', 'Stripe Checkout (test mode)', 'Groq LLM API (OpenAI-compatible chat completions + tools)'] },
      { label: 'Testing & Tools', items: ['verify:compat scenario script (known-good/bad builds)', 'verify:perf benchmark checks', 'smoke-auth script', 'ESLint 9 + eslint-config-next', 'pnpm', 'drizzle-kit'] },
    ],
    implementation: [
      {
        title: 'Architecture',
        text: 'RSC-first App Router: catalog, category, product, search, order and admin pages are server components querying Drizzle directly; cart, builder, 3D viewer and AI assistant are client islands. Business logic lives in pure lib modules — catalog taxonomy (a code-level enum shared by seed, UI and filters), compatibility rules, performance model, orders, discounts, payments, ai — so the browser and server never drift.',
      },
      {
        title: 'Data model',
        text: 'Seven tables: products (specs as a structured JSON map, prices in integer minor units, composite category+price index), orders (crypto-random order numbers, denormalized line-item price snapshots, payment session id, discount redemption flag), discounts (type, min subtotal, per-product scoping, max redemptions), builds (public share id, category\u2192slug JSON, optional owner FK), users, sessions, and benchmark_data (kind, scenario, resolution, avg FPS, source) indexed for the estimate lookup.',
      },
      {
        title: 'API design',
        text: 'POST /api/checkout (server-side re-pricing, stock/qty validation, discount re-validation, order insert, payment session creation with rollback of stranded orders), POST /minipay/callback (webhook), GET/POST /api/builds (save + shareable publicId links), POST /api/ai/chat (assistant turns), /api/discounts/validate, /api/mock-pay, /api/admin/product-preview, plus server actions for auth and admin mutations.',
      },
      {
        title: 'Auth & security',
        text: 'scrypt password hashing with per-user salts and timing-safe verification; 256-bit session tokens stored server-side (revocable by deleting the row) in httpOnly, sameSite=lax cookies; a separate single-admin credential for /admin. The webhook verifies HMAC-SHA256 over the raw body with timingSafeEqual and rejects paid amounts that don\u2019t match the order total. Checkout re-reads all prices and re-validates discounts server-side — the client is never trusted on money.',
      },
      {
        title: 'Integrations',
        text: 'MiniPay: a NestJS gateway service running on port 3000 — the store creates a hosted checkout session with an X-API-Key header (order reference, amount in minor units, callback URL) and confirms payment from the HMAC-signed callback, with status polling as a fallback and explicit error mapping for auth/conflict/expired sessions. The AI layer is provider-agnostic: any OpenAI-compatible base URL works, configured via env.',
      },
    ],
    challenges: [
      {
        title: 'Webhooks you can\u2019t trust twice',
        text: 'Payment gateways retry callbacks, and a retried "paid" event would double-resolve an order or double-count a discount. The fix: verify the HMAC over the raw request body (never re-serialized), reject amount mismatches before touching state, and make pending\u2192paid a compare-and-set UPDATE guarded on status = \'pending\' inside a transaction that also flips the discount-redeemed flag — SQLite\u2019s serialized writes close the crash window between the status flip and the redemption bump.',
      },
      {
        title: 'One engine, client and server',
        text: 'Compatibility feedback that only exists server-side means a network round-trip per part pick; a separate client implementation means the AI assistant and the UI eventually disagree. Keeping the rules as pure functions over plain product data let the builder run them in the browser on every change and the AI tools run the identical code on the server — one implementation, zero drift.',
      },
      {
        title: 'Performance numbers you can defend',
        text: 'Hand-waved "estimated FPS" is worse than none. The model is grounded in seeded benchmark rows from TechPowerUp (per-GPU per-resolution averages) and GPUCheck (CPU 1080p ceilings measured against an RTX 4090), combined as min(GPU, CPU cap) per resolution with explicit \u00b18%/\u00b115% ranges, DDR4 noted as a ~8% penalty, and a measured-vs-fallback flag so the UI never presents a relative-index guess as measured data.',
      },
      {
        title: 'Swapping payment providers without touching checkout',
        text: 'Stripe\u2019s hosted session flow, MiniPay\u2019s orderRef-based API, and a local mock all shape checkout differently. Defining a two-method provider interface (createCheckout, isSessionPaid) selected from environment variables let checkout and order logic stay identical across all three — the mock gateway keeps the whole purchase flow testable with zero external accounts.',
      },
      {
        title: 'A grounded assistant on a free LLM tier',
        text: 'Groq\u2019s free tier enforces a tight tokens-per-minute cap, and a shop assistant that invents specs is a liability. The turn loop budgets hard: trimmed history, tool results capped at 2000 chars, 800 completion tokens, max six tool rounds — and 429 responses parse the gateway\u2019s own "try again in X.XXs" hint to wait out the window instead of failing the user\u2019s question. Grounding rules in the system prompt require every claim to cite a tool result.',
      },
    ],
    testing:
      'Verification scripts run against the real seeded database: pnpm verify:compat asserts known-good and known-bad builds produce the expected rule findings, pnpm verify:perf checks the benchmark-grounded performance estimates and pairing warnings, and a smoke-auth script exercises the scrypt/session account flow — with the production build verified after every change.',
    future: [
      {
        title: 'Live Demo & Repository Links',
        text: 'TBD — GitHub repository and live demo deployment to be linked here.',
      },
      {
        title: 'Streaming Assistant Responses',
        text: 'Token streaming for the AI chat with incremental tool-call rendering, so answers appear as they are generated.',
      },
      {
        title: 'Order Fulfilment & Email',
        text: 'Shipping-status transitions on orders and transactional email on payment confirmation.',
      },
    ],
  },
]

// ————————————————————————————————————————————————
// SMALL BUILDS — TODO: replace these placeholders with your
// real fun/small projects (name, description, links, tech).
// ————————————————————————————————————————————————
export const smallBuilds = [
  {
    name: 'Project Name',
    blurb: 'Short one-to-two line description of what this small project does and why you built it.',
    tech: ['JavaScript', 'Node.js'],
    links: [
      { label: 'GitHub', url: '#' },
      { label: 'Demo', url: '#' },
    ],
  },
  {
    name: 'Project Name',
    blurb: 'Short one-to-two line description of what this small project does and why you built it.',
    tech: ['Python', 'API'],
    links: [{ label: 'GitHub', url: '#' }],
  },
  {
    name: 'Project Name',
    blurb: 'Short one-to-two line description of what this small project does and why you built it.',
    tech: ['React', 'Tailwind'],
    links: [
      { label: 'GitHub', url: '#' },
      { label: 'Demo', url: '#' },
    ],
  },
]

// ————————————————————————————————————————————————
// CERTIFICATES — TODO: replace with your real certificates
// (title, issuer, year, credential URL).
// ————————————————————————————————————————————————
export const certificates = [
  { title: 'Certificate Title', issuer: 'Issuer', year: '2025', url: '#' },
  { title: 'Certificate Title', issuer: 'Issuer', year: '2025', url: '#' },
  { title: 'Certificate Title', issuer: 'Issuer', year: '2024', url: '#' },
]

export const skills = [
  { label: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Dart', 'SQL'] },
  { label: 'Frontend', items: ['React.js', 'React Native', 'Flutter', 'HTML/CSS', 'Tailwind'] },
  { label: 'Backend', items: ['Node.js', 'Express', 'NestJS', 'PostgreSQL', 'Prisma'] },
  { label: 'Tools & APIs', items: ['Git/GitHub', 'Stripe API', 'Mapbox API', 'OpenAI API', 'Docker', 'Figma'] },
]

export const about = {
  heading: 'Building solutions for real friction',
  paragraphs: [
    'I am a software developer who thrives at the intersection of design, logic, and human behavior. I don\u2019t just write code. I identify friction points in daily digital life and engineer applied solutions to fix them.',
    'Whether it\u2019s unifying fragmented study workflows or cutting through internet hype to surface authentic experiences, my goal is to build technology that serves the user honestly and efficiently.',
  ],
  portrait: 'images/profile.jpg',
}

export const approach =
  'Building great software requires more than just functional code. It requires understanding how people think, interact, and solve problems in real-world environments. I value creating systems that balance technical reliability with intuitive and thoughtful user experiences.'
