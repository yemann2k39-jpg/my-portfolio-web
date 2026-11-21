// ————————————————————————————————————————————————
// SITE CONTENT — edit this file to update the portfolio.
// ————————————————————————————————————————————————

const studies = [
  {
    slug: 'minipay',
    num: '03',
    title: 'MiniPay',
    standfirst:
      'A wallet, merchant gateway and payments backend. A payments project spanning a Flutter wallet, merchant checkout API, hosted payment page and React admin dashboard.',
    subtitle: 'A wallet, merchant gateway and payments backend.',
    description: 'A payments project spanning a Flutter wallet, merchant checkout API, hosted payment page and React admin dashboard.',
    tags: ['Dart', 'NestJS', 'TypeScript', 'PostgreSQL', 'Prisma ORM', 'React 19', 'Vite', 'Stripe API', 'JWT', 'WebSockets-free REST', 'Docker', 'Tailwind CSS'],
    year: '2026',
    role: 'Solo Design & Engineering',
    cover: '/images/minipay/heroM.webp',
    mobile: true,
    phones: [
      '/images/minipay/h2-2.webp',
      '/images/minipay/h2.webp',
      '/images/minipay/h3.webp',
    ],
    flow: [
      { title: 'Mobile', sub: 'Flutter wallet + merchant app' },
      { title: 'API', sub: 'NestJS / ledger engine' },
      { title: 'Data', sub: 'PostgreSQL + Prisma' },
      { title: 'Integrations', sub: 'Stripe, Gemini, merchant callbacks' },
    ],
    how: [
      'Flutter app (one app, two modes): Consumers get a wallet (transfer, scan, request, split), while merchants get a business view (collect payments, sales, payouts, API keys). Talks to the API over REST with JWT.',
      'NestJS API: The source of truth. All money moves through a double-entry ledger service: each operation writes a journal entry with balanced lines inside a database transaction, protected by idempotency keys and per-account advisory locks so concurrent requests cannot double-spend.',
      'PostgreSQL via Prisma: 15+ models covering users, wallets (ledger accounts), journal entries, transactions, checkout sessions, merchants, API keys, refresh tokens and notifications.',
    ],
    overview: 'A payments project spanning a Flutter wallet, merchant checkout API, hosted payment page and React admin dashboard. Payment correctness depends on invariants — balanced entries, idempotency keys and transaction boundaries matter more than how quickly the payment screen responds.',
    motivation: 'I wanted to understand what actually happens behind a payment button. MiniPay grew from a wallet experiment into a system with ledger entries, merchant integrations and payment callbacks.',
    stats: [
      { value: 'Double-entry', label: 'ledger accounting' },
      { value: 'SGD only', label: 'currency (test payments)' },
      { value: '33', label: 'passing API unit tests' },
    ],
    architecture: {
      diagram: '/images/minipay/architecture.svg',
      points: [
        'Every money movement creates balanced journal lines — wallet balances are calculated from those lines rather than stored as a mutable balance field. Ledger totals remain auditable, but reads require aggregation.',
        'PostgreSQL advisory transaction locks serialize operations touching the same accounts, with deterministic lock order to avoid deadlocks — two transfers can never both spend the same available balance.',
        'Unique idempotency keys prevent duplicate ledger posting; hosted checkout uses signed callbacks with retries and an API polling fallback. Callback delivery still needs a durable outbox for crash recovery.',
      ],
    },
    features: [
      { title: 'Double-entry ledger', text: 'Every money movement posts balanced journal lines, so balances are always derived from the ledger and never stored.', img: ['/images/minipay/doubleL1.webp', '/images/minipay/doubleL2.webp'], video: true },
      { title: 'P2P transfers', text: 'Send money by email or contact lookup, authorize with fingerprint or PIN, and stay inside server-enforced daily spend limits.', img: [{ src: '/images/minipay/p2p.webm', video: true, cover: true }], video: true },
      { title: 'QR payments & gateway', text: 'Scan to pay at merchant checkouts or show your personal receive-money QR, backed by a hosted merchant checkout and a public REST API.', img: [{ src: '/images/minipay/qrPayment.webm', video: true, cover: true }], video: true },
      { title: 'Scan & split', text: 'Snap a photo of a receipt and server-side AI reads the line items, splits the total across the group and creates a request, so settling up takes one tap.', img: [{ src: '/images/minipay/splitBill.mp4', video: true, cover: true }], video: true },
    ],
    preview: [
      { title: 'Double-entry ledger', text: 'Every money movement posts balanced journal lines, so balances are always derived from the ledger and never stored.', img: ['/images/minipay/doubleL1.webp', '/images/minipay/doubleL2.webp'] },
      { title: 'P2P transfers', text: 'Send money by email or contact lookup, authorize with fingerprint or PIN, and stay inside server-enforced daily spend limits.', img: [{ src: '/images/minipay/p2p.webm', video: true, cover: true }] },
      { title: 'QR payments & gateway', text: 'Scan to pay at merchant checkouts or show your personal receive-money QR, backed by a hosted merchant checkout and a public REST API.', img: [{ src: '/images/minipay/qrPayment.webm', video: true, cover: true }] },
      { title: 'Hardened security', text: 'Rotating refresh-token sessions with device tracking, bcrypt payment PINs, biometric app unlock and forgot-PIN recovery.', img: '/images/minipay/setting.webp' },
      { title: 'Merchant gateway', text: 'Register a business, open collect-payment QR sessions and integrate through API keys on the hosted checkout page.', img: ['/images/minipay/merchant.webp', '/images/minipay/merchantAPI.webp'] },
      { title: 'Scan & split', text: 'Scan a shared receipt, let AI split it by line items, split the total across the group and create a request, all in just one tap', img: [{ src: '/images/minipay/splitBill.mp4', video: true, cover: true }] },
      { title: 'Refunds, payouts & deposits', text: 'Refund claims are atomic with automatic ledger rollback on failure, while card deposits via Stripe PaymentIntents credit wallets through a single writer.', img: ['/images/minipay/myQR.webp', '/images/minipay/refund.webp', '/images/minipay/deposite.webp'] },
    { title: 'Know Your Money', text: 'A month-by-month view of your spending with inflow, outflow and net totals, daily and per category breakdowns, plus a searchable transaction history with filters, so every dollar is easy to find and every month is easy to understand.', img: ['/images/minipay/monthlyReport.webp', '/images/minipay/history.webp'] },
    ],

    liveUrl: null,
  githubUrl: 'https://github.com/yemann2k39-jpg/minipay',
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
        title: 'Derived balances over stored balances',
        text: 'Balance is the sum of ledger lines: slower to read, but mathematically impossible to drift out of sync, and a single invariant endpoint can prove the whole ledger balances.',
        note: 'Ledger totals remain auditable, but reads require aggregation.',
      },
      {
        title: 'Idempotency keys and advisory locks on every write',
        text: 'Retried webhooks or double-tapped buttons can never post twice. Postgres row locks alone were not enough for multi-row journal writes, so sorted advisory locks per account prevent deadlocks between concurrent transfers.',
        note: 'Two transfers can never both spend the same available balance.',
      },
      {
        title: 'Webhook as the single credit writer',
        text: 'Stripe deposits credit wallets only through the signature-verified webhook (raw body preserved for verification), never from client responses.',
        note: 'One writer eliminates a whole class of race conditions.',
      },
      {
        title: 'Hashed secrets and one role-based app',
        text: 'Refresh tokens and API keys are stored as SHA-256 hashes, so a database leak cannot be replayed. Merchants are users with a shop rather than a separate app, which halved the codebase.',
        note: 'Refunds flip PAID\u2192REFUNDED with one atomic conditional update, rolled back if the ledger write fails.',
      },
    ],
    learn: 'Payment correctness depends on invariants. Balanced entries, idempotency keys and transaction boundaries matter more than how quickly the payment screen responds.',
    learnList: [
      'Money needs a different mindset: every mutation is asked what happens if it runs twice, concurrently, or crashes halfway.',
      'A checksum beats hope: the ledger invariant endpoint caught real bugs that UI testing never would have surfaced.',
      'Boring choices scale well: BigInt minor units (no floats, ever) and one currency kept the money math airtight.',
      'Shipping to a real phone for every feature caught integration bugs no emulator showed.',
    ],
    learnListStyle: 'numbered',
    limits: [
      'Test-mode payments only, not real-money operation.',
      'SGD only and full refunds only.',
      'Callbacks have retries but no persistent outbox.',
      'No end-to-end CI pipeline.',
    ],
    next: [
      'Durable callback queue and replay tooling.',
      'Partial refunds and stronger merchant-secret handling.',
      'API rate limits, migrations and broader automated testing.',
    ],
    testing:
      'Two Jest unit-test suites contain 33 passing tests for bill splitting and merchant API validation and cryptography. The project also includes verification scripts, but not a full end-to-end automated test pipeline.',
    future: [
      {
        title: 'Durable callback delivery',
        text: 'Callbacks have retries but no persistent outbox — add a durable callback queue with replay tooling and merchant-visible delivery logs.',
      },
      {
        title: 'Partial refunds & key handling',
        text: 'Payments are test-mode only today, SGD-only with full refunds — extend to partial refunds and stronger merchant-secret handling.',
      },
      {
        title: 'Hardening & broader testing',
        text: 'API rate limits, migrations and broader automated testing — there is no end-to-end CI pipeline yet.',
      },
    ],
  },
  {
    slug: 'lil-routine',
    num: '04',
    title: 'LilRoutine',
    standfirst:
      'A quieter way to track everyday habits. A cozy, offline-first Android app for water and meal tracking, with progress insights, a reactive mascot and optional Gemini-assisted food logging.',
    subtitle: 'A quieter way to track everyday habits.',
    description: 'A cozy, offline-first Android app for water and meal tracking, with progress insights, a reactive mascot and optional Gemini-assisted food logging.',
    tags: ['Flutter', 'SQLite', 'Gemini REST API', 'Local-First'],
    year: '2026',
    role: 'Solo Design & Engineering',
    cover: '/images/lil-routine/cover-hero.webp',
    mobile: true,
    phones: [
      '/images/lil-routine/hero-1.webp',
      '/images/lil-routine/hero-2.webp',
      '/images/lil-routine/hero-3.webp',
    ],
    flow: [
      { title: 'Android UI', sub: 'Flutter screens and widgets' },
      { title: 'Services', sub: 'repositories, insights, reminders' },
      { title: 'Local data', sub: 'SQLite + secure key storage' },
      { title: 'Optional AI', sub: 'Gemini REST API' },
    ],
    how: [
      'Database: One SQLite file is the whole system of record. A unified entries table holds both water drinks and food meals, plus tables for the food library, quick-slots, habits and settings.',
      'Repositories: Repositories wrap every query, and screens load data to hand plain numbers to pure-UI views, which is what makes the dashboards testable without a database.',
      'Insight engine: A pure function, with a week of entries in and prioritized coaching cards out. No I/O, no AI.',
      'AI provider: Makes exactly two calls (food estimate, weekly recap) straight to Gemini\u2019s REST endpoint, locked behind a gate until a key exists in secure storage.',
      'Reminder service: Applies the stored schedule on every launch and checks Android\u2019s exact-alarm and battery-optimization realities.',
    ],
    overview: 'A cozy, offline-first Android app for water and meal tracking, with progress insights, a reactive mascot and optional Gemini-assisted food logging. A local-first app can stay simple if the database is treated as the source of truth — and it taught me to test device behavior, not just business logic.',
    motivation: 'I wanted a small tracker I could actually enjoy opening each day, without accounts, syncing or a mandatory cloud service.',
    stats: [
      { value: 'Android', label: 'platform' },
      { value: 'Local SQLite', label: 'data — the source of truth' },
      { value: '119', label: 'passing tests' },
    ],
    architecture: {
      diagram: '/images/lil-routine/architecture.svg',
      points: [
        'The app writes through repositories, then reloads aggregates from the local database — there is no remote account or synchronization layer to maintain. Local-first design keeps the everyday experience offline.',
        'Deterministic code computes insights; Gemini receives limited, numbers-based context for optional weekly recaps. The app does not depend on AI for its core math.',
        'Android alarm permissions, battery-optimization checks and schedule reapplication address reminders being delayed or stopped by the OS — device behavior mattered more than emulator behavior.',
      ],
    },
    features: [
      { title: 'Instant water logging', text: 'Tap a cup, the ring and mascot react instantly. Undo and per-drink delete included.', img: ['/images/lil-routine/waterLog.webp'], video: true },
      { title: 'Full macro meal log', text: 'Log “ramen” once, relog it in two taps with every macro remembered. New meals come from an AI photo estimate (your own Gemini key), reviewed before saving.', img: ['/images/lil-routine/mealLog.webp', '/images/lil-routine/macroMealLog.webp'], video: true },
      { title: 'Dashboards and insights', text: 'Swipeable 7-day bars for water, kcal and macro splits, backed by insights that advise across both logs: a salty day suggests extra water. All plain math, never hallucinated.', img: ['/images/lil-routine/waterDashboard.webp', '/images/lil-routine/mealDashboard.webp'], video: true },
      { title: 'A mascot on your side', text: 'Lil Drop reacts to your real pace, with 3 forgiving weekly hearts and offline water reminders that survive Android\u2019s battery rules.', img: [{ src: '/images/lil-routine/mascot.webm', video: true, cover: true }], video: true },
    ],
    preview: [
      { title: 'Instant water logging', text: 'Tap a cup and the ring and mascot react instantly, with undo and per-drink delete for mistakes. Logging water takes one tap, not a form.', img: ['/images/lil-routine/waterLog.webp'] },
      { title: 'Full macro meal log', text: 'Every meal is logged with full macros: protein, carbs, fat, fiber, sugar and sodium, with portion scaling and full edit-after-log support.', img: ['/images/lil-routine/mealLog.webp', '/images/lil-routine/macroMealLog.webp'] },
      { title: 'Dashboards and insights', text: 'Swipeable 7-day bars for water, kcal and macro splits, backed by insights that advise across both logs: a salty day suggests extra water. All plain math, never hallucinated.', img: ['/images/lil-routine/waterDashboard.webp', '/images/lil-routine/mealDashboard.webp'] },
      { title: 'A mascot on your side', text: 'Lil Drop reacts to your real pace, with 3 forgiving weekly hearts and offline water reminders that survive Android\u2019s battery rules.', img: [{ src: '/images/lil-routine/mascot.webm', video: true, cover: true }] },
      { title: 'Learned food library', text: 'Log \u201cramen\u201d once and it becomes a two-tap relog, with every macro remembered for next time.', img: ['/images/lil-routine/FoodLibiary.webp'] },
      { title: 'AI food logging', text: 'A photo or a short description becomes a pre-filled estimate that you review before anything saves. It runs on your own Gemini key, so nothing is required from the app to work.', img: ['/images/lil-routine/aiLog.webp'] },
      { title: 'Weekly AI coach recap', text: 'Once every 7 days, Gemini turns the week\u2019s aggregate numbers into personalized tips, never seeing individual food names.', img: ['/images/lil-routine/aiCoach.webp'] },
      { title: 'Water reminders', text: 'Repeating reminders powered by Android exact alarms, with battery-optimization handling so they survive OEM restrictions.', img: ['/images/lil-routine/notification.webp'] },
    ],

    liveUrl: null,
  githubUrl: 'https://github.com/yemann2k39-jpg/lil_routine',
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
        title: 'One table for water and food, not two',
        text: 'Every chart, streak and day sheet stays a single query, with the cost of nullable columns hidden behind typed models.',
        note: 'Single-source data keeps every screen consistent.',
      },
      {
        title: 'Local-first, no accounts',
        text: 'A habit log is private by nature. The app works fully offline with zero configuration.',
        note: 'No remote account or synchronization layer to maintain.',
      },
      {
        title: 'Rules compute, AI narrates',
        text: 'Arithmetic insights are unit-testable and cannot hallucinate. The AI recap only sees aggregate numbers, and an estimate is never auto-saved without confirmation.',
        note: 'The app does not depend on AI for its core math.',
      },
      {
        title: 'Reminders on real Android devices',
        text: 'Exact-alarm permissions, battery-optimization checks and schedule reapplication address reminders being delayed or stopped by the OS.',
        note: 'Device behavior mattered more than emulator behavior.',
      },
    ],
    learn: 'A local-first app can stay simple if the database is treated as the source of truth. It also taught me to test device behavior, not just business logic.',
    learnList: [
      'A local-first app stays simple when the database is treated as the source of truth.',
      'Deterministic rules should coach, while AI should only explain.',
      'Test device behavior on real hardware, not just business logic in the emulator.',
    ],
    learnListStyle: 'numbered',
    limits: [
      'Android-only and not released to an app store.',
      'Habit data structures exist, but the habit interface is not yet available.',
      'No backup/export or CI pipeline.',
      'Some goal and profile settings are still incomplete.',
    ],
    next: [
      'Finish the habit interface and mascot states.',
      'Data export and backup.',
      'Release preparation and device integration tests.',
    ],
    testing:
      '119 Flutter tests cover rules, repository and migration logic, Gemini response handling and widget interactions. Static analysis passes. The app has been installed and launched on a physical Android device, though CI and device integration tests are not yet in place.',
    future: [
      {
        title: 'Finish the habit interface',
        text: 'Habit data structures exist, but the habit interface is not yet available — plus mascot states and some incomplete goal and profile settings.',
      },
      {
        title: 'Data export & backup',
        text: 'No backup or export path today — add both before any wider release.',
      },
      {
        title: 'Release preparation',
        text: 'Android-only and not released to an app store — release preparation and device integration tests come next, along with CI.',
      },
    ],
  },
  {
    slug: 'sus-url-shortener',
    num: '01',
    title: 'Sus URL Shortener',
    standfirst:
      'Perfectly normal links. Questionable presentation. A playful link shortener that turns ordinary URLs into suspicious-looking links, with an optional warning screen before the redirect.',
    subtitle: 'Perfectly normal links. Questionable presentation.',
    description: 'A playful link shortener that turns ordinary URLs into suspicious-looking links, with an optional warning screen before the redirect.',
    tags: ['Next.js 15', 'React 19', 'JavaScript', 'LibSQL/Turso', 'Brevo Email API', 'Edge Middleware'],
    year: '2026',
    role: 'Solo developer — design, frontend, backend, database and deployment',
    cover: '/images/sus/hero-maxchaos.webp',
    how: [
      'Frontend: Next.js 15 App Router + React 19. Server components render the dashboard and redirect pages, while small client components handle the create form, QR modal and verification polling',
      'Backend: nine /api route handlers (auth, links, hits) behind edge middleware that rate-limits by IP before any database work',
      'Database: LibSQL (SQLite dialect) with four tables. Users, sessions, verification_tokens, links carry an owner_key so every query is owner-scoped',
      'Storage is one swappable module: remote Turso in production, local SQLite in dev, same code',
      'Hot path: LRU+TTL cache answers repeat lookups, and clicks buffer in memory to flush every 5 seconds as one batched transaction, so redirects never write to disk',
      'External: Brevo HTTP API sends verification emails, while QR codes are fully client-side',
    ],
    flow: [
      { title: 'Browser', sub: 'Next.js pages and forms' },
      { title: 'Server', sub: 'auth, links and redirect handlers' },
      { title: 'Data', sub: 'Turso / LibSQL' },
      { title: 'Email', sub: 'Brevo verification' },
    ],
    overview: 'A playful link shortener that turns ordinary URLs into suspicious-looking links, with an optional warning screen before the redirect. I learned that choosing the right identifier strategy can remove an entire category of bugs instead of adding more checks.',
    motivation: 'I wanted to make a simple internet joke into a working product. The fun part was figuring out how to keep link generation predictable and redirects fast.',
    stats: [
      { value: '6 characters', label: 'short code' },
      { value: '307 / warning', label: 'redirect modes' },
      { value: 'SQLite + Turso', label: 'storage' },
    ],
    architecture: {
      diagram: '/images/sus/architecture.svg',
      points: [
        'The database ID is scrambled with a Feistel permutation and encoded as Base62 — every short code is unique without generating random candidates or checking for collisions. A permutation masks sequential IDs, but it is obfuscation rather than encryption.',
        'An LRU cache handles recent link lookups; click totals are buffered and written in batches every five seconds. A server restart can lose a small window of click counts.',
        'The same LibSQL client connects to a local SQLite file during development and Turso in production — only the database connection settings need to change.',
      ],
    },
    features: [
      { title: 'Instant shortening', text: 'Create a short link with an optional custom name and a unique 6-character code, shortened instantly. QR codes are generated client-side, with instant preview and a downloadable 480px PNG on the result screen and in the dashboard modal.', img: ['/images/sus/instantShortening1.webp', '/images/sus/instantShortening2.webp'] },
      { title: 'Suspicious-link warning', text: 'Sus-mode links stop at a deadpan warning page naming the real destination host before the Continue button, turning an ordinary redirect into part of the joke. One dynamic route serves both instant and warning modes.', img: ['/images/sus/sus-interstitial.webp'] },
      { title: 'Link management dashboard', text: 'Manage personal links, check click counts, copy URLs, generate QR codes and delete links with a two-step confirmation.', img: ['/images/sus/dashboard.webp'] },
      { title: 'Account verification', text: 'Email-verified accounts with scrypt hashing, hashed single-use tokens and remember-me sessions keep every link tied to the right owner through an owner-scoped dashboard.', img: ['/images/sus/verifyEmail.webp', { src: '/images/sus/verifyEmail2.webp', fit: 'contain-white' }, '/images/sus/emailVerified.webp'] },
    ],

    liveUrl: null,
    githubUrl: 'https://github.com/yemann2k39-jpg/sus-url-shortener',
    hero: '/images/sus/hero.svg',
    story: {
      steps: [
        {
          title: 'Create',
          text: 'One INSERT. The link\u2019s rowid is scrambled through a 4-round Feistel network into a unique 6-character code — no collision checks, ever.',
          img: '/images/sus/step-1-create.svg',
        },
        {
          title: 'Share',
          text: 'Every link goes exactly where it claims. \u201cSus\u201d links add a deadpan warning interstitial before the real destination.',
          img: '/images/sus/step-2-share.svg',
        },
        {
          title: 'Click',
          text: 'An in-memory LRU cache answers the hot path; a miss hits one indexed query. Misses are never cached, so fresh links can\u2019t be shadowed.',
          img: '/images/sus/step-3-click.svg',
        },
        {
          title: 'Count',
          text: 'Clicks buffer in memory and flush every 5 seconds as one batched transaction — counting never slows the redirect.',
          img: '/images/sus/step-4-count.svg',
        },
      ],
      stats: [
        { value: '0', label: 'collision checks — codes are unique by construction' },
        { value: '1 INSERT', label: 'to create a link, forever' },
        { value: '5s', label: 'buffered click flush, one batched transaction' },
        { value: '56 lines', label: 'hand-rolled LRU+TTL cache' },
      ],
      videos: [
        { title: 'The sus interstitial, live', img: '/images/sus/video-interstitial.svg' },
        { title: 'Dashboard, QR codes & two-step delete', img: '/images/sus/video-dashboard.svg' },
      ],
      highlight: {
        title: 'Collision-free codes, without existence checks',
        text: 'Random-code generators slow down as the table grows and still need retry loops. Sus instead treats each code as a bijective Feistel permutation of the rowid over a 2\u00b3\u2074 space: uniqueness is inherited from the primary key, so creating a link stays a single INSERT for the life of the app.',
        img: '/images/sus/highlight-feistel.svg',
      },
    },
    stack: [
      { label: 'Framework', items: ['Next.js 15 (App Router)', 'React 19 client components', 'Vercel (hosting)'] },
      { label: 'Data', items: ['SQLite via LibSQL (dual-mode)', 'Turso when configured', 'Buffered click counting', 'Hand-rolled LRU+TTL cache'] },
      { label: 'Auth & Security', items: ['scrypt password hashing', 'SHA-256-hashed session tokens', 'Edge rate limiting', 'Email verification gate'] },
      { label: 'Integrations', items: ['Brevo verification email', 'qrcode (client-side PNGs)'] },
    ],
    testing:
      'Manual but explicit: a curl end-to-end suite covers registration validation, duplicates, session auth, hash-leak checks, logout and rate limits, with PASS/FAIL per check. A one-shot smoke test runs create, get and delete against the real remote Turso database. No automated framework or CI yet, so the suites run manually before each deploy.',
    problem:
      'Most hobby URL shorteners are CRUD demos: random collision-prone codes checked with retry loops, click counters that write to disk on the hot path, no real accounts, and sessions stored in plaintext. I wanted one that is genuinely fun — every link goes where it claims, the vibe is the only thing that changes — but engineered underneath like a production service: collision-free code generation, email-verified accounts, hashed credentials, rate limiting on every endpoint, and an honest scaling path.',
    solution:
      'Sus URL Shortener is a Next.js 15 App Router application (JavaScript, React 19 client components, server-component pages) with hand-written neo-brutalist CSS and no UI framework. Its signature idea is the code generator: each link\u2019s AUTOINCREMENT rowid is scrambled through a 4-round Feistel network over a 2^34 space and Base62-encoded to exactly 6 characters, so codes are unique by construction and creating a link is a single INSERT with zero collision checks. All storage is isolated in one file behind a dual-mode LibSQL driver — remote Turso when configured, a local SQLite file otherwise — with a real migration history: the original node:sqlite build was swapped to @libsql/client by reimplementing that single module, and a legacy links.json store was imported into SQLite on first boot. Auth (scrypt hashing, SHA-256-hashed tokens, email verification via the Brevo HTTP API) is built from scratch with no auth library; QR codes render client-side with the qrcode package.',
    challenges: [
      {
        title: 'Unique links without retry loops',
        text: 'The database ID is scrambled with a Feistel permutation and encoded as Base62. Every short code is unique without generating random candidates or checking for collisions.',
        note: 'A permutation masks sequential IDs, but it is obfuscation rather than encryption.',
      },
      {
        title: 'Keep redirects lightweight',
        text: 'An LRU cache handles recent link lookups. Click totals are buffered and written in batches every five seconds.',
        note: 'A server restart can lose a small window of click counts.',
      },
      {
        title: 'Local development, remote production',
        text: 'The same LibSQL client connects to a local SQLite file during development and Turso in production.',
        note: 'Only the database connection settings need to change.',
      },
    ],
    learn: 'I learned that choosing the right identifier strategy can remove an entire category of bugs instead of adding more checks.',
    learnList: [
      'Designing for correctness at the data-model level removes whole classes of bugs.',
      'Cache correctness has subtleties most demos get wrong: caching a miss is dangerous.',
      'Security details compound: each safeguard closes a specific hole.',
    ],
    learnListStyle: 'numbered',
    limits: [
      'Rate limiting, cache and click buffers are held per instance.',
      'Links cannot be edited after creation.',
      'Analytics currently show click counts, not trends over time.',
      'No CI pipeline.',
    ],
    next: [
      'Shared cache and rate limiting with Redis.',
      'Per-link analytics and link editing.',
      'Automated tests in CI.',
    ],
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
        title: 'Unique links without retry loops',
        text: 'The database ID is scrambled with a Feistel permutation and encoded as Base62. Every short code is unique without generating random candidates or checking for collisions — a permutation masks sequential IDs, but it is obfuscation rather than encryption.',
      },
      {
        title: 'Keep redirects lightweight',
        text: 'An LRU cache handles recent link lookups. Click totals are buffered and written in batches every five seconds — with the explicit trade-off that a server restart can lose a small window of click counts.',
      },
      {
        title: 'Local development, remote production',
        text: 'The same LibSQL client connects to a local SQLite file during development and Turso in production. Only the database connection settings need to change.',
      },
    ],
    testing:
      'A curl and PowerShell HTTP regression suite checks registration, duplicate accounts, session handling, protected routes and rate limits. A separate script smoke-tests the remote Turso database. There is no automated test framework or CI pipeline yet.',
    },
    future: [
      {
        title: 'Shared cache & rate limiting',
        text: 'Rate limiting, the cache and click buffers are held per instance today — move them to Redis-backed shared infrastructure when the app runs distributed.',
      },
      {
        title: 'Link editing & richer analytics',
        text: 'Links cannot be edited after creation, and analytics currently show click counts only — add link editing and per-link trends over time.',
      },
      {
        title: 'Automated tests in CI',
        text: 'The regression suite is manual scripts today; bring it into an automated CI pipeline.',
      },
    ],
  },
  {
    slug: 'pc-shop',
    num: '02',
    title: 'PC Shop',
    standfirst:
      'Build a PC before buying the parts. A PC components storefront with an interactive 3D builder, live compatibility checks, performance estimates and an AI shopping assistant.',
    subtitle: 'Build a PC before buying the parts.',
    description: 'A PC components storefront with an interactive 3D builder, live compatibility checks, performance estimates and an AI shopping assistant.',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'react-three-fiber / Three.js (3D viewer)', 'SQLite', 'Drizzle ORM', 'Node.js crypto', 'Groq LLM API', 'Stripe'],
    year: '2026',
    role: 'Solo Design & Engineering',
    cover: '/images/pc-shop/hero-pc.webp',
    how: [
      'Storefront (Next.js App Router, RSC-first): catalog, category, product, search, order and admin pages are server components querying the database directly. Cart, builder, 3D viewer and AI assistant are client islands. Business logic lives in pure lib modules so browser and server never drift.',
      'Data layer: SQLite via Drizzle ORM, 7 tables (products with structured JSON specs, orders with denormalized price snapshots, discounts, builds, users, sessions, benchmark_data).',
      'Rules + performance engine: pure functions over plain product data. The browser builder runs them client-side for instant feedback, and the AI tools run the identical code server-side.',
      'Payments: checkout creates an order, then a payment session through the configured provider. The gateway\u2019s webhook verifies HMAC-SHA256 over the raw body, checks the amount, and transitions pending→paid with a compare-and-set guard so retries can\u2019t double-resolve.',
      'AI assistant: a bounded tool loop with trimmed history, capped tool results, max six rounds and 800 completion tokens, with 429 responses parsed from Groq\u2019s own \u201ctry again in X.XXs\u201d hint.',
    ],
    flow: [
      { title: 'Shop + builder', sub: 'Next.js and React Three Fiber' },
      { title: 'Domain logic', sub: 'compatibility + FPS models' },
      { title: 'Data', sub: 'SQLite + Drizzle' },
      { title: 'External', sub: 'MiniPay, Stripe, LLM' },
    ],
    overview: 'A PC components storefront with an interactive 3D builder, live compatibility checks, performance estimates and an AI shopping assistant. Building the 3D experience was only half the work — the useful part was making the compatibility and performance rules understandable and independent of the interface.',
    motivation: 'I wanted to combine e-commerce with the parts of PC building I enjoy most: choosing components, checking fit and understanding how a complete setup performs.',
    stats: [
      { value: '8', label: 'builder component slots' },
      { value: '12', label: 'compatibility rules' },
      { value: '3', label: 'payment provider options' },
    ],
    architecture: {
      diagram: '/images/pc-shop/architecture.svg',
      points: [
        'Compatibility checks live in pure TypeScript functions, separate from React and database code — the same logic runs anywhere. A clean seam for future unit testing.',
        'The FPS model combines seeded GPU benchmark averages with CPU ceilings. Partial builds show wider uncertainty; missing pairings fall back to estimates — numbers are estimates, not a replacement for real benchmarks.',
        'Checkout never trusts the cart: prices are fetched again from SQLite on the server. Payment providers share one interface, including MiniPay, Stripe test mode and a local mock — the UI can change without changing payment rules.',
      ],
    },
    features: [
      { title: 'Build it in 3D', text: 'Every selected part renders as a GLB model inside the case in a live react-three-fiber scene, with orbit controls and clickable ghost slots for anything still missing.', img: [{ src: '/images/pc-shop/3DBuilder.webm', video: true }], video: true },
      { title: 'Live rules, honest FPS', text: 'Twelve compatibility rules (sockets, memory, PSU headroom, GPU clearance and more) run on every selection with pulsing-red errors and plain-English fixes, while FPS estimates come from real TechPowerUp and GPUCheck data through a min(GPU, CPU-cap) model, reporting ±8%/±15% bands and CPU-bottleneck warnings.', img: [{ src: '/images/pc-shop/compatibility.webp', fit: 'contain-white' }, { src: '/images/pc-shop/performance.webp', fit: 'contain-white' }], video: true },
      { title: 'An assistant that only knows the catalog', text: 'A Groq-powered chat with four tools (product search, details, compatibility check, performance estimate) that may only state what tool results return, with clickable product links and rate-limit retry handling.', img: [{ src: '/images/pc-shop/ai1.webp', fit: 'contain-white' }, { src: '/images/pc-shop/ai2.webp', fit: 'contain-white' }], video: true },
      { title: 'The full commerce stack', text: 'Cart, checkout with server-side re-pricing, discounts (percent/fixed, product-scoped, redemption caps), order history, scrypt-hashed accounts with revocable sessions, and a separate admin dashboard.', img: [{ src: '/images/pc-shop/fcs1.webp', fit: 'contain-white' }, { src: '/images/pc-shop/fcs2.webp', fit: 'contain-white' }, { src: '/images/pc-shop/fcs3.webp', fit: 'contain-white' }, { src: '/images/pc-shop/fcs4.webp', fit: 'contain-white' }, { src: '/images/pc-shop/fcs5.webp', fit: 'contain-white' }, { src: '/images/pc-shop/fcs6.webp', fit: 'contain-white' }], video: true },
      { title: 'Builds made for sharing', text: 'Save any configuration to a community builds gallery on the website, where anyone can browse it and fork it straight into their own builder.', img: [{ src: '/images/pc-shop/communityBuild.webp', fit: 'contain-white' }, { src: '/images/pc-shop/commuityBuild2.webp', fit: 'contain-white' }], video: true },
    ],

    liveUrl: null,
  githubUrl: 'https://github.com/yemann2k39-jpg/pc-shop',
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
        title: 'Pure-function core over framework magic',
        text: 'Compatibility and performance logic as plain functions meant the UI, server re-validation and LLM tools share one implementation with zero drift.',
        note: 'A clean seam for future unit testing.',
      },
      {
        title: 'Measured numbers and idempotency by default',
        text: 'A measured-vs-fallback flag means the UI never presents a relative-index guess as real benchmark data. Webhooks, order transitions and discount redemptions are all designed assuming the message will arrive twice.',
        note: 'Numbers are estimates, not a replacement for real benchmarks.',
      },
      {
        title: 'Grounding over vibes for the LLM',
        text: 'Rather than prompting \u201cdon\u2019t make things up,\u201d the architecture makes invention impossible: every claim must cite a tool result, and the tools only query the live catalog.',
        note: 'Answers stay narrow and slower, but nothing can be invented.',
      },
    ],
    learn: 'Building the 3D experience was only half the work. The useful part was making the compatibility and performance rules understandable and independent of the interface.',
    learnList: [
      'Sharing the rules engine between client, server and AI tools from day one saved three rewrites later.',
      'Rate limits are a feature to design for: parsing the gateway\u2019s own retry hint turned 429 failures into a seamless wait.',
      'Denormalized price snapshots are cheap insurance: order history stays truthful after prices change.',
      'A mock payment provider is what makes the whole purchase flow testable and demoable offline.',
    ],
    learnListStyle: 'numbered',
    limits: [
      'Local SQLite is not designed for distributed production traffic.',
      'Admin access uses a single configured password.',
      'No automated test framework or CI pipeline.',
      'Stock is tracked as a status, not a quantity.',
    ],
    next: [
      'Automated tests for compatibility and performance rules.',
      'Quantity-based inventory and stronger admin access.',
      'More reliable payment confirmation and a scalable database.',
    ],
    testing:
      'Production build and lint checks are supported by targeted TypeScript verification scripts for compatibility, performance and authentication. The mock payment provider allows a complete local checkout flow. There is no unit-test framework or CI pipeline yet.',
    future: [
      {
        title: 'Tests for the rule engines',
        text: 'Automated tests for the compatibility and performance rules — no unit-test framework or CI pipeline yet.',
      },
      {
        title: 'Quantity-based inventory & stronger admin access',
        text: 'Stock is currently tracked as a status, not a quantity, and admin access uses a single configured password.',
      },
      {
        title: 'Reliable payments & a scalable database',
        text: 'More reliable payment confirmation, and a database designed for distributed production traffic — local SQLite is not built for that.',
      },
    ],
  },
]

// ————————————————————————————————————————————————
// presented in project-number order: Sus 01 · PC Shop 02 · MiniPay 03 · LilRoutine 04
export const caseStudies = [...studies].sort((a, b) => a.num.localeCompare(b.num))

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
  { label: 'Tools & APIs', items: ['Git/GitHub', 'Stripe API', 'Mapbox API', 'Docker', 'Figma'] },
]

export const about = {
  heading: 'Building beyond the code',
  paragraphs: [
    'I\u2019m a software developer with experience building web and mobile applications, from designing interfaces and developing backend services to integrating APIs and databases. I\u2019m passionate about software development and enjoy working across different areas of it, exploring new technologies, and taking projects from an initial idea to a working application. I\u2019m always willing to learn, take on unfamiliar challenges, and put in the effort to improve my skills. My approach is to keep things practical, pay attention to the details, and write code that\u2019s easy to understand, maintain, and improve.',
  ],
  portrait: '/images/profile.webp',
}

export const approach =
  'Software engineering isn\u2019t just about making things work. It\u2019s about understanding why they work, how the different pieces fit together, and how to make them better.'
