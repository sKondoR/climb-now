---
name: ClimbNow
description: Live climbing competition results from c-f-r.ru, with your team highlighted.
colors:
  signal-blue: "#2563eb"
  signal-blue-deep: "#1d4ed8"
  signal-blue-ink: "#1e40af"
  focus-blue: "#3b82f6"
  own-team-blue: "#bfdbfe"
  badge-blue: "#dbeafe"
  live-green: "#16a34a"
  live-halo: "#4ade80"
  live-tint: "#f0fdf4"
  podium-green: "#bbf7d0"
  podium-line: "#22c55e"
  update-flash: "#fef08a"
  attempt-red: "#fca5a5"
  error-red: "#dc2626"
  error-red-deep: "#b91c1c"
  error-surface: "#fef2f2"
  error-ink: "#991b1b"
  stale-amber: "#b45309"
  fsr-teal: "#0d9488"
  logo-teal: "#14b8a6"
  logo-emerald: "#10b981"
  paper: "#ffffff"
  gym-floor: "#f9fafb"
  chalk: "#f3f4f6"
  chalk-line: "#e5e7eb"
  rule-gray: "#d1d5db"
  muted-ink: "#6b7280"
  soft-ink: "#4b5563"
  label-ink: "#374151"
  ink: "#111827"
typography:
  display:
    fontFamily: "Inter, system-ui, arial, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
  headline:
    fontFamily: "Inter, system-ui, arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 2rem
  title:
    fontFamily: "Inter, system-ui, arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.75rem
  subtitle:
    fontFamily: "Inter, system-ui, arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.75rem
  body:
    fontFamily: "Inter, system-ui, arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5rem
  label:
    fontFamily: "Inter, system-ui, arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25rem
  table:
    fontFamily: "Inter, system-ui, arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "\"tnum\""
  caption:
    fontFamily: "Inter, system-ui, arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1rem
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "9999px"
spacing:
  cell-x: "4px"
  cell-x-md: "8px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-deep}"
  button-danger:
    backgroundColor: "{colors.error-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "6px 16px"
  button-danger-hover:
    backgroundColor: "{colors.error-red-deep}"
  button-round-toggle:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.soft-ink}"
    rounded: "{rounded.full}"
    size: "32px"
  discipline-tab:
    backgroundColor: "{colors.chalk-line}"
    textColor: "{colors.label-ink}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  discipline-tab-hover:
    backgroundColor: "{colors.rule-gray}"
    textColor: "{colors.ink}"
  discipline-tab-active:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.paper}"
  subgroup-tab:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.label-ink}"
    rounded: "{rounded.lg}"
    padding: "8px"
  subgroup-tab-hover:
    backgroundColor: "{colors.chalk-line}"
  group-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 80px 8px 12px"
  badge-climbed:
    backgroundColor: "{colors.badge-blue}"
    textColor: "{colors.signal-blue-ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  row-own-team:
    backgroundColor: "{colors.own-team-blue}"
  row-podium:
    backgroundColor: "{colors.podium-green}"
  error-panel:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error-ink}"
    rounded: "{rounded.lg}"
    padding: "24px 16px"
---

# Design System: ClimbNow

## Overview

**Creative North Star: "The Annotated Scoreboard"**

ClimbNow is the scoreboard at the foot of the wall, carried in a coach's pocket. Two people use the same screen: the fan in the stands who wants to see who is climbing right now and how the order just shifted, and the coach or parent who needs to find their own climbers among dozens of groups without reading every row. The design serves both by treating the results table as the product and everything else as annotation on it: a live dot on what is happening now, a blue band on your people, a green band on the podium, a brief yellow flash when a result changes.

The mood is utilitarian and calm. The surface is a neutral white-on-light-gray field; blue is reserved for things you act on and for "yours"; green is reserved for "live" and "top places". Data density wins over decoration: tables are tight (`leading-none`, 12–14px, tabular numerals), cards are near-flat, and there is exactly one decorative flourish in the whole system, the teal→emerald→blue gradient on the ClimbNow wordmark. The interface is in Russian and must render Cyrillic with real Inter glyphs, never a fallback.

Motion carries meaning, not flair. Rows that change position glide to their new place; rows whose result changed flash. On a phone in a noisy gym, those two signals replace reading the table twice.

**Key Characteristics:**
- Results tables are the hero; chrome stays gray and quiet around them.
- Color is semantic, never decorative: blue = action / your team, green = live / podium / data exists, yellow = just changed, red = boulder attempts or errors.
- Near-flat depth: white cards on `#f9fafb`, `shadow-sm` at rest, `shadow-md` on hover.
- Mobile-first density: sticky discipline tabs, sticky climber-name column, collapsible header.
- One brand gesture: the gradient wordmark. Nothing else gets a gradient.

## Colors

A neutral Tailwind-gray field with a single action blue and a strictly semantic green; every other hue exists to encode one specific state in the results table.

### Primary
- **Signal Blue** (#2563eb): primary buttons, the active discipline tab, the active subgroup-tab border, text-style icon buttons (refresh, share, team/names toggle). Hover deepens to **Signal Blue Deep** (#1d4ed8); icon-link hover to **Signal Blue Ink** (#1e40af).
- **Focus Blue** (#3b82f6): the 2px keyboard focus ring (`.focus-ring`) on every interactive element.
- **Own-Team Blue** (#bfdbfe): background of table rows belonging to the selected team or listed names, and the selected/hovered row in autocomplete dropdowns.
- **Badge Blue** (#dbeafe) with Signal Blue Ink text: the "N / M пролезло" counter pill.

### Secondary (status green)
- **Live Green** (#16a34a): the solid "live" dot, the border of a group card with a live subgroup, and the check mark meaning "results data exists". Chosen for ≥3:1 contrast on white.
- **Live Halo** (#4ade80): the pulsing ring around the live dot (`animate-ping`, 75% opacity, motion-safe only).
- **Live Tint** (#f0fdf4): background of current/upcoming events in the competition dropdown.
- **Podium Green** (#bbf7d0): background of rows in prize places in finals, and rows the source marks as highlighted (qualified).
- **Podium Line** (#22c55e): 2px top border that separates the last highlighted row from the rest.

### Tertiary (state accents)
- **Update Flash** (#fef08a): 1.8s fade on a row whose result just changed. Deliberately yellow so it is never confused with team blue or podium green.
- **Attempt Red** (#fca5a5): filled halves of a boulder cell (zone / top attempts).
- **Error Red** (#dc2626 → hover #b91c1c): the danger button inside error panels. **Error Surface** (#fef2f2) with **Error Ink** (#991b1b): the error panel itself.
- **Stale Amber** (#b45309): the small "showing last loaded results" note when a refresh fails but data is still on screen.
- **FSR Teal** (#0d9488): the external-link icon to the event on c-f-r.ru.
- **Logo Teal → Emerald → Blue** (#14b8a6 → #10b981 → #3b82f6): the wordmark gradient only.

### Neutral
- **Paper** (#ffffff): header, cards, table rows, inputs, dropdowns, round toggle buttons.
- **Gym Floor** (#f9fafb): page background and the sticky discipline-tab strip.
- **Chalk** (#f3f4f6): subgroup tab fill; disabled discipline tab fill.
- **Chalk Line** (#e5e7eb): card borders, inactive discipline tab fill, boulder-cell base, sticky-name-column divider.
- **Rule Gray** (#d1d5db): input borders, header bottom border, dropdown borders, disabled tab text.
- **Muted Ink** (#6b7280): subtitles, footer, "например" hints, empty-table messages.
- **Soft Ink** (#4b5563): state-message titles, chevron icons.
- **Label Ink** (#374151): form labels, tab text.
- **Ink** (#111827): group and subgroup headings, values in the collapsed header.

### Named Rules
**The Semantic Color Rule.** Every non-gray color in a table means exactly one thing: blue is yours, green is live or podium, yellow just changed, red is a boulder attempt. Never reuse these hues for decoration or for a different meaning.

**The Green Check Rule.** The green check on a subgroup tab means "results data exists" (in progress or finished), not "finished". It stays green; do not gray it out or recolor it for completed rounds.

**The One Gradient Rule.** The teal→emerald→blue gradient belongs to the ClimbNow wordmark and nothing else.

## Typography

**Display Font:** Inter (with system-ui, arial, sans-serif)
**Body Font:** Inter
**Label/Mono Font:** Inter with tabular numerals (`tabular-nums`) for all scores and counters

**Character:** One neutral grotesk throughout, loaded with the `latin` and `cyrillic` subsets as a variable font so 500/600/700 are real weights. Hierarchy comes from weight and size, not from font pairing.

### Hierarchy
- **Display** (700, 48px, line-height 1): the ClimbNow wordmark in the expanded header, gradient-clipped. Collapses to 20px bold in the compact header.
- **Headline** (600, 24px): full-page state titles ("Загружаем соревнование…", "Соревнование не найдено").
- **Title** (700, 20px): group card title (e.g. age group / gender).
- **Subtitle** (600, 18px): subgroup/round title above a table; discipline tabs at `md+` (500, 18px).
- **Body** (400, 16px): inputs, state explanations (max width `28rem`), discipline tabs on mobile.
- **Label** (500, 14px): form labels, checkbox labels, subgroup tabs, buttons.
- **Table** (500, 12px mobile / 14px `md+`, line-height 1, tabular numerals): every results cell and header.
- **Caption** (400–500, 12px): the climbed-count badge, collapsed-header values, footer, stale warning, boulder cells.

### Named Rules
**The Tabular Numbers Rule.** Any number that can change during a live round (rank, score, attempts, counters) is set in tabular numerals so columns do not jitter on update.

## Layout

A single full-height scroll container (`#page-scroll`, `h-dvh`) holds a collapsible white header and a gray main area. Page gutters are 12px on mobile, 24px at `sm` (640px), 32px at `lg` (1024px); top padding is 12px mobile and 32px at `md`.

Groups sit in a 1-column grid on mobile and 2 columns from `md` (768px), with a 24px gap. Each card is at least 400px tall when expanded and unfiltered, so the grid does not jump while tables lazy-load (via `IntersectionObserver` on the scroll container).

The discipline tab strip is sticky at the top of the scroll area on a Gym Floor background and bleeds to the page edges with negative margins; it scrolls horizontally on narrow screens and centers on wide ones. Results tables scroll horizontally inside their card, and the climber-name column is sticky left on mobile with a 1px Chalk Line divider, so a wide boulder table always shows whose row it is.

On phones (≤767px wide or ≤500px tall), opening a link that already has `?code=` collapses the header immediately to a one-line summary, so results are on the first screen. Hover styles apply only on devices that support hover (`hoverOnlyWhenSupported`), so taps do not leave tabs stuck highlighted.

Spacing is Tailwind's 4px grid: 4/8px table cell padding, 12/16px card padding, 24px between cards, 32px footer top gap.

## Elevation & Depth

Nearly flat. Depth comes mostly from white surfaces on the Gym Floor gray plus 1px Chalk Line borders; shadows are small and used to signal "this lifts" or "this floats".

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`, Tailwind `shadow-sm`): group cards at rest.
- **Card hover** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`, `shadow-md`): group cards on hover; also the round collapse toggles at all times.
- **Dropdown** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`, `shadow-lg`): autocomplete lists floating over the header.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Only cards (`shadow-sm` → `shadow-md` on hover), floating dropdowns and the round toggle buttons cast shadows. Don't add shadows to tabs, tables, badges or panels.

## Shapes

Soft but not bubbly. Controls and containers use an 8px radius (cards, buttons, tabs, error panels); text fields and dropdown lists use 6px; icon buttons use 4px (visible mostly through their focus ring). Full rounding is reserved for the circular 32px collapse toggles, the climbed-count pill and the live dot. Tables and boulder cells are square-cornered: data stays in a grid.

Small icon targets are enlarged with an invisible `::before` pseudo-element (`-inset-1.5` to `-inset-3.5`) instead of adding padding, so the visual stays compact while the tap target meets mobile size.

## Components

### Buttons
Quiet and direct; buttons appear only where recovery or a primary action is needed.
- **Shape:** 8px radius.
- **Primary:** Signal Blue fill, white 14–16px medium text, 8px × 16px padding; hover Signal Blue Deep; focus ring Focus Blue with 2px offset.
- **Danger:** Error Red fill, 14px text, 6px × 16px padding; used only for "Повторить" inside a red error panel.
- **Round toggle:** 32px white circle, Rule Gray border, `shadow-md`, Soft Ink 12px chevron; collapses the header or a group card.
- **Icon button:** bare Signal Blue icon (refresh, share, team/names switch), hover Signal Blue Ink. The refresh icon spins for at least 600ms and until the request finishes.

### Tabs
- **Discipline tabs:** 8px radius, Chalk Line fill, Label Ink text, 16px (18px `md+`) medium; active is Signal Blue with white text; disabled (speed) is Chalk with Rule Gray text and a tooltip. One row, horizontally scrollable, sticky.
- **Subgroup tabs:** 8px radius, Chalk fill, 2px border; active is marked by a Signal Blue border, not a fill change. Each tab leads with a status icon: pulsing live dot, green check (data exists), or nothing (pending).

### Cards / Containers
- **Group card:** white, 8px radius, 1px Chalk Line border (Live Green when any subgroup is live), `shadow-sm` → `shadow-md` on hover, 12px / 16px (`md+`) padding. Title row is the click target for collapsing; a round toggle sits bottom-right of it.
- **State message:** centered, 48px vertical padding, Headline title in Soft Ink, Muted Ink explanation capped at 28rem, optional primary button below.
- **Error panel:** Error Surface, Error Ink text, 8px radius, 24px × 16px padding, 18px semibold title, danger button.

### Inputs / Fields
- **Style:** white, 1px Rule Gray border, 6px radius, 8px × 12px padding with 80px right padding reserved for inline icon buttons (caret, expand, share, external link).
- **Focus:** border stays; a 2px Focus Blue ring appears, no outline.
- **Label:** 14px medium Label Ink above the field with a 12px Muted Ink "(например: …)" hint.
- **Autocomplete list:** white, Rule Gray border, 6px radius, `shadow-lg`, max height `min(500px, 50dvh)`, rows separated by Chalk Line; selected/hovered row is Own-Team Blue; current events get Live Tint. It is an ARIA combobox: focus stays in the field, ↑/↓ move a 2px Focus Blue outline over the options, Enter picks, Escape closes.
- **Checkboxes:** native 16px checkbox tinted Signal Blue, label 14px medium with enlarged tap padding on mobile.

### Navigation
The header is the only navigation. Expanded: centered gradient wordmark with a Muted Ink tagline, the three-field form, white background, Rule Gray bottom border. Collapsed: a single row with a 20px gradient wordmark and the current code / team / filters as 12–14px captions with bold Ink values. The transition animates `max-height` and opacity over 300ms, and the collapsed part is `inert`.

### Results Table (signature component)
- Full width, square, `leading-none`, tabular numerals, 500 weight, 12px mobile / 14px `md+`.
- Header row white with a bottom border; data rows white with white 1px separators, so tinted rows read as continuous bands.
- Row tints: Own-Team Blue for your team/names (wins over everything), Podium Green for prize places in finals and qualified rows, Podium Line under the last highlighted row.
- Tint is never the only signal: your climbers' names are also set bold (700), and every tinted row carries a screen-reader suffix after the name (", ваш скалолаз" / ", призёр" / ", проходит дальше"). Status icons carry "идёт сейчас" / "есть результаты" the same way.
- Climbed counter pill ("N / M пролезло") and refresh icon sit right of the round title.
- **Live motion:** a row that changes position translates from its old offset over 450ms with `cubic-bezier(0.16, 1, 0.3, 1)`; a row whose data changed flashes Update Flash, fading over 1800ms. Movement is skipped under `prefers-reduced-motion`; the flash is kept because it carries meaning.
- **Loading:** a translucent white overlay (30%) with a spinner and "Загружаем протокол…", keeping the previous table visible.
- **Boulder cell:** a stacked two-line cell on Chalk Line; each filled half (zone/top attempts) is Attempt Red, empty halves stay blank.

### Live indicator
A 10px Live Green dot with a Live Halo ring pinging behind it (only when motion is allowed). The dot itself never animates, so "live" is readable even with reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep the results table as the visual center; new UI around it stays gray, white and small.
- **Do** use Signal Blue (#2563eb) for actions and Own-Team Blue (#bfdbfe) for "your climbers", and nothing else.
- **Do** use Live Green (#16a34a) for live state and the "data exists" check, and keep that check green for finished rounds.
- **Do** set every changing number in tabular numerals.
- **Do** use `.focus-ring` (2px Focus Blue) on every new interactive element; add `ring-inset` inside overflow containers and `ring-offset-2` on filled buttons.
- **Do** enlarge small icon hit areas with an invisible `::before` inset rather than extra visible padding.
- **Do** keep meaningful feedback (flash, live dot) under reduced motion and drop only movement (row glide, ping, spin).
- **Do** pair every color signal with a non-color one: bold, a line, or screen-reader text. Selected tabs use `aria-pressed`.
- **Do** write UI copy in Russian and check it with Cyrillic glyphs in Inter.
- **Do** show an explicit state (loading, error with "Повторить", not found, no protocols yet, welcome) instead of an empty area.

### Don't:
- **Don't** introduce new hues for decoration; the color set above is already fully assigned to meanings.
- **Don't** use the wordmark gradient on buttons, headings or backgrounds.
- **Don't** add shadows beyond card rest/hover, dropdowns and round toggles.
- **Don't** loosen table density (line-height, padding) to "breathe"; coaches scan dozens of rows on a phone.
- **Don't** hide already loaded results on a failed refresh; show the Stale Amber note above the table instead.
- **Don't** rely on hover for anything essential; hover is disabled on touch devices.
