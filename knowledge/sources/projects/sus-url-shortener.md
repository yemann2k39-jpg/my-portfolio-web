# Sus URL Shortener — supplementary technical knowledge
Source: Sus URL Shortener documentation, sections 3–14. Use the website descriptions for public framing. Exact language and styling claims are withheld here because sources disagree.

## Identifier and data model
The short-code generator uses a four-round Feistel permutation with 17-bit halves over a 2^34 domain. Database row IDs are mapped bijectively into this space, then encoded into a six-character Base62 band. An optional sanitized name is prefixed to the code. Within the supported domain the permutation avoids random collision retries; it is obfuscation, not encryption. LibSQL supports local SQLite development and remote Turso storage. Users, sessions, verification tokens and links are stored separately; link ownership is scoped to an owner key.

## Redirect design
One dynamic route handles immediate HTTP 307 redirects and warning interstitials. Recent slug lookups are cached with least-recently-used eviction and expiry; writes invalidate relevant cache entries. Click updates are buffered and flushed in batches every five seconds. This reduces synchronous database writes in the redirect path but introduces a loss window on restart. In-memory rate limits, caches and buffers are instance-local, not distributed guarantees.

## Accounts and verification
Accounts require email verification; Brevo HTTP API sends verification messages. Passwords use scrypt, and session and verification tokens are hashed. Session lifetime depends on remember-me selection (7 or 30 days). Dashboard ownership checks restrict link management. QR PNGs are generated client-side. The product is intended for playful links, not impersonation; the actual app domain remains visible.

## Quality and evolution
A PowerShell/curl HTTP regression script covers registration validation, duplicate accounts, auth, no hash leakage, logout, link creation and rate limiting. A separate Turso smoke script checks storage connectivity and basic operations. No unit-test framework or CI is documented. Link editing, richer analytics, distributed rate limiting and cache infrastructure remain future improvements. Do not claim production load-test results or exact throughput.
