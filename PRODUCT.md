# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, all following live climbing competitions of the Russian Climbing Federation, very often from a phone at the venue:

- **Coaches and parents** tracking their own team or their own kids across many age groups and disciplines at once, without reading every row of every protocol.
- **Fans** watching who is climbing right now and how the order shifts.
- **Athletes** checking their own results and their rivals'.

## Product Purpose

ClimbNow shows live results of a competition from c-f-r.ru in a form that is readable on a phone: every group and round of the competition on one screen, live-updating, with your own climbers highlighted. Success is a coach finding where their climbers stand in seconds, without opening protocols one by one.

## Positioning

The official live site (c-f-r.ru) publishes one legacy HTML page per protocol. ClimbNow's two core differences:

1. **All groups on one screen.** Every age group, discipline and round of a competition in one view, instead of opening protocols one at a time.
2. **Your climbers highlighted.** Rows of the chosen team, or of climbers listed by surname, are highlighted and can be filtered down to only them.

## Operating Context

- Used during competitions, mostly on phones in a noisy, crowded venue, sometimes on a laptop at home. Results change live during a round.
- The user enters a competition code (e.g. `2602vrn`, chosen from the FSR calendar) and a team (e.g. `СПБ`) or a list of surnames. Settings live in the browser and in the URL, so a link can be shared with a team.
- Disciplines: lead (трудность), boulder (боулдеринг), speed (скорость), and classic speed (скорость (К)). Rounds: qualification, qualification 2, combined qualification, finals; speed finals are a knockout bracket.

## Capabilities and Constraints

- **Data comes only from scraping:** c-f-r.ru live protocols (results) and rusclimbing.ru (competition calendar). No own database. The external markup can change; the parser follows it.
- **No accounts, no registration.** State is kept in the browser and the URL.
- **Free, no advertising.** A non-commercial project; no monetization.
- **Russian only.** No other UI language is planned.
- Data may be up to ~10 s older than c-f-r.ru (server cache); open live tables poll every 30 s.
- A separate React Native/Expo app (`../climb-now-mobile`) is in progress and consumes this app's `/api/groups` and `/api/results`; their response shapes are a contract.

## Brand Commitments

- Name: **ClimbNow**, at climbnow.ru.
- UI copy is Russian, plain and short, in the sport's own terms (протокол, группа, квалификация, финал, пролезло, срыв).

## Evidence on Hand

- Real live competition data on c-f-r.ru (e.g. `https://c-f-r.ru/live/2602vrn/index.html`), with parser fixtures in `src/shared/parser/mocks/mockHtml.ts`.
- No testimonials, usage numbers, partners or press exist; do not fabricate them.

## Product Principles

1. **Results are the product.** Everything else is annotation on the results table.
2. **Find your own in seconds.** Highlighting and filtering your team or surnames always comes before generic features.
3. **The whole competition at a glance.** Prefer showing every group together over sending the user from page to page.
4. **Readable on a phone in the gym.** Density and legibility on a small screen beat decoration.
5. **Nothing to sign up for, nothing to pay for.** Every feature works without an account and without ads.
