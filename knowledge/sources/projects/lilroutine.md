# LilRoutine — supplementary technical knowledge
Source: LilRoutine project documentation, November 2026, sections 3–14.

## Local-first data model
Android Flutter app with no accounts, sync or backend server. SQLite is the source of truth for logged drinks and meals. Each meal stores nutrition per serving and a portion multiplier; reads scale calories and macros by the portion. Repositories provide CRUD and aggregates for dashboard charts, streaks and insights. Schema version 3 includes on-device migrations; tests reopen a real version-2 file to check migration behavior. The learned food library draws on previously logged food to streamline repeat entries. Daily date keys use yyyy-MM-dd.

## Optional AI and deterministic insights
Gemini REST calls accept a photo or text description to estimate food. Structured JSON is parsed and validated, then shown in an editable form; the user confirms before storage. The key is provided by the user and kept in Android-backed secure storage rather than SQLite. AI is optional, and manual tracking works offline. Local deterministic rules generate insights from aggregates, including cross-domain water and meal signals. The weekly coach uses aggregate numbers rather than food names, with a seven-day cadence, cached recap history and local fallback. AI nutrition estimates are approximate, not verified measurements.

## Android behavior
Water reminders use local notifications, notification permissions, exact-alarm handling and battery-optimization checks. Device behavior cannot be guaranteed under all OEM restrictions. Mascot moods reflect progress; a weekly hearts mechanism makes streaks more forgiving.

## Testing and maturity
Documentation records 119 passing Flutter tests and clean static analysis. Pure logic tests cover insight rules, mood and streak engines and parsing; real in-memory SQLite tests cover repository CRUD, aggregates and migrations; mocked HTTP tests cover malformed responses, quota errors and missing keys; widget tests cover charts and dashboard interactions. Physical Android device launch is documented, not full device integration coverage.

## Limitations
Water/meal tracking is implemented; habit schema and repositories exist but habit UI is not yet shipped. Android-only, not app-store released. No backup/export, CI or release signing is documented. Some profile and goal settings are incomplete. AI swaps, expanded coach chat, habit UI and backup are proposed future features, not current functionality.
