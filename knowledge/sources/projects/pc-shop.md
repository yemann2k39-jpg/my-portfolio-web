# PC Shop — supplementary technical knowledge
Source: PC Shop documentation, sections 2–14. Existing website content supplies project identity and motivation.

## Architecture and domain logic
A single Next.js application serves catalog, customer account, order and admin pages; interactive cart, builder, Three.js viewer and assistant are client components. SQLite/Drizzle stores products (structured JSON specifications), orders (price snapshots), discounts, builds, users, sessions and benchmark data. Pure compatibility/performance modules run in both browser and server contexts. This avoids duplicating rules between builder and AI tools. The catalog has eight component categories: CPU, GPU, motherboard, RAM, storage, PSU, cooler and case. Avoid an exact compatibility-rule count until the inconsistent counts are verified.

## Builder and estimates
Checks cover socket, RAM generation, form factor, physical fit and PSU requirements, with error/warning/info findings. Performance estimates use seeded published GPU and CPU benchmark data from TechPowerUp and GPUCheck and a minimum-of-GPU-and-CPU model for each resolution. Partial builds with CPU and GPU can show provisional estimates; CPU-only builds cannot. These are estimates, not live measured FPS, and game/settings differences can affect results. Builds can be saved and shared using a public identifier.

## Checkout and AI
The server re-prices cart items, validates discounts and creates a pending order before opening a provider session. A common payment-provider interface supports MiniPay, Stripe test mode and a local mock. MiniPay's signed callback verifies the payment amount and changes pending orders to paid with a conditional update so repeated callbacks do not double-resolve. MiniPay is a separate NestJS service with its own PostgreSQL database, communicating over HTTP. Stripe confirmation is return-based in the documented build; do not imply equivalent webhook coverage across all providers. The assistant uses an OpenAI-compatible bounded tool loop to query catalog and rule engines. It relies on returned catalog data rather than model memory for technical claims.

## Verification and limits
Purpose-built scripts check compatibility, benchmark estimates and real-database account behavior; the documentation records a passing production build. Script assertions are not proof of a fresh run. Manual mock checkout tests are documented. There is no unit-test framework or CI. Stock status is tracked, not quantity reservations; the app has a single admin model and a local SQLite database. Real-money operation is outside scope. Stronger admin identity, automated tests, durable payment confirmation and scaling improvements are future work.
