# MiniPay — supplementary technical knowledge
Source: MiniPay project documentation, sections 3–14; existing portfolio remains authoritative for public descriptions.

## Ledger and transactions
MiniPay uses SGD integer minor units with BigInt rather than floating-point currency. A transaction record describes the business operation; journal entries and journal lines represent accounting movements. Each journal entry has at least two lines and debits equal credits. Account balances are derived from lines. PostgreSQL transaction-scoped advisory locks are acquired in sorted account order to serialize competing writes and reduce deadlock risk. The ledger checks available balances and uses unique journal-entry idempotency keys; a separate scoped idempotency store supports request replay. This is a correctness design, not a claim of formally verified software.

## Payment flows
Deposits use Stripe test-mode PaymentIntents. The verified webhook is the sole wallet-credit writer; a key derived from the PaymentIntent ID prevents duplicate ledger posting. Merchant checkout sessions are created through API-key authentication; the buyer can pay through QR or hosted checkout. Signed callbacks notify the merchant website. Dynamic merchant collection sessions expire after 15 minutes. The merchant can issue full refunds and withdraw settlement balance into the wallet. No real-money operation, KYC, multi-currency or partial refunds is documented.

## Receipt splitting
Gemini extracts receipt line items and prices; participants are assigned items. The backend uses largest-remainder rounding so integer shares add up to the intended total and creates payment requests. Avoid claiming that inference happens entirely on-device: the portfolio contains conflicting wording about AI location, while the technical documentation describes server-side Gemini integration.

## Authentication and quality
JWT access tokens, rotating hashed refresh tokens, bcrypt PIN/password hashes, role checks, frozen-account restrictions and server-enforced daily spending limits protect flows. Merchant callbacks use HMAC-SHA256. Documentation records 33 passing Jest tests in two suites, a successful Nest build and clean Flutter analysis; scripts exercise checkout, callbacks and ledger invariants. Do not claim full automated E2E coverage or CI. Local development uses Docker PostgreSQL, NestJS API, Flutter and Vite admin; production hosting is not documented.

## Trade-offs and next steps
Derived balances prioritize accounting consistency at the cost of aggregate reads. Callback retries are not backed by a durable outbox. Stronger merchant secret handling, partial refunds, persistent callback delivery, migration history, rate limiting and broader tests are future improvements, not shipped capabilities. Avoid exposing concrete development credentials or exploitable configuration details.
