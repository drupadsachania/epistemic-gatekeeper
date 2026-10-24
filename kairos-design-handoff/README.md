# Kairos design language — handoff for the Kairos Foundation website

This kit carries the design language built for Aegis and Themis over to the Kairos Foundation site, so the Foundation and its projects look like one family. It is a translation guide plus working code: drop the CSS in, follow the rules below, and the Foundation site will match.

Source of truth: the Aegis repository (`design/tokens.json`, `docs/design/DESIGN.md`, `docs/design/motion.md`, `docs/design/FONTS.md`). This kit is a snapshot of those, taken 2026-10-24, with the Foundation-specific guidance added.

## What is in this folder

| File | What it is |
|---|---|
| `kairos-tokens.css` | Every design token as a CSS variable (`--k-*`): colour (light and dark), type, spacing, radius, shadow, layout, motion. Load it first. |
| `kairos-base.css` | Base styles, components (nav, buttons, pills, cards, links, code window, callouts, footer, theme toggle) and the motion patterns. Load it second. |
| `kairos.js` | Theme toggle, sticky-nav hairline, reveal on scroll. Load with `defer`. |
| `index.html` | A starter Foundation homepage using all of the above. Open it to see the language working. |
| `assets/` | Aegis and Themis marks, light and dark variants. |
| `fonts/` | Red Hat Mono 400 and 500 (open licence, SIL OFL; licence text included). |

## Quick start

1. Copy `kairos-tokens.css`, `kairos-base.css`, `kairos.js` and `fonts/` into the site.
2. In `<head>`, in this order:
   ```html
   <script>try{if(localStorage.getItem('kairos-theme')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}</script>
   <link rel="preconnect" href="https://use.typekit.net" crossorigin>
   <link rel="preconnect" href="https://p.typekit.net" crossorigin>
   <link rel="stylesheet" href="https://use.typekit.net/pww4pkx.css">
   <link rel="stylesheet" href="kairos-tokens.css">
   <link rel="stylesheet" href="kairos-base.css">
   <script src="kairos.js" defer></script>
   ```
   The inline script must come first so a saved dark theme applies before the page paints.
3. Build pages with the `k-` classes shown in `index.html`. In your own CSS, reference tokens only (`var(--k-color-text)`), never raw hex.

The Adobe Fonts kit `pww4pkx` serves any domain (checked against `kairos-foundation.org`), so no domain setup is needed. If Adobe ever starts enforcing a domain list, the symptom is Georgia fallbacks; add the hostname in the Adobe Fonts project settings.

## 1. Principles

| # | Principle | In practice |
|---|---|---|
| 1 | **Warm paper, quiet ink** | Cream page, ink text, accent colours used sparingly as fills and single-word emphasis, never as wallpaper. Security tooling is anxious by default; warmth signals care and independence. |
| 2 | **Serif for voice, mono for machinery** | teimer-web for headlines, legitima for reading, Red Hat Mono for labels, navigation, buttons, commands, IDs and dates. What people say versus what the system does. |
| 3 | **Trust is visible** | Show licence, source, state and consent; don't hide them. Licence line in the footer. |
| 4 | **Motion explains; it never gates** | Reveals help orientation, but every page reads fully without JavaScript, without motion and at any zoom. |
| 5 | **One system, many accents** | Shared neutrals, type, radius and motion. Each project owns exactly one accent family. A new project slots in without redesign. |
| 6 | **Accessible by construction** | WCAG 2.2 AA is built into the tokens: every colour pair below is measured. |

## 2. Brand architecture for the Foundation site

```
Kairos Foundation   ink #3A312B on cream #FEF9ED   (the umbrella: neutral, no accent of its own yet)
 |- Argus    accent not yet defined                 the all-seeing watchman
 |- Aegis    gold  #E8B93C fill / #7A5600 ink text  Athena's shield
 `- Themis   blue  #2F4FD8                          the scales of order and law
```

- **The Foundation is the neutral host.** On the Foundation site the primary colour is ink (`--k-color-foundation`), not a product accent. Product colours appear only inside that product's own card or section (`k-accent-aegis`, `k-accent-themis`). This keeps the Foundation above its projects rather than looking like one of them.
- **Greek theme.** Projects are named for figures from Greek myth. Keep it for new projects, and use one line of the myth to introduce each one (as the starter page does).
- **Wordmark.** The Foundation has no logo yet. Until it does, set "Kairos Foundation" in teimer-web 300, ink colour, as text. Do not invent a mark and do not combine the product logos into a Foundation lockup.
- **Which projects to list is your call.** Aegis is now an independent project with its own maintainer and copyright. If you show it on the Foundation site, describe it as a related or member project as you prefer; the starter page uses neutral copy.

## 3. Colour

Use semantic tokens only. Light is the default; dark appears only when the visitor presses the toggle (it never follows the OS setting).

| Token (`--k-color-*`) | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FEF9ED` | `#020E1C` | page |
| `surface` | `#F7F1E3` | `#051A2E` | cards, bands, footer |
| `surface-raised` | `#F7ECD9` | `#0A2540` | hover rows, pills, secondary buttons |
| `text` | `#3A312B` | `#F0E8D4` | headings, strong text |
| `text-muted` | `#5D524B` | `#C9C0AB` | body |
| `text-subtle` | `#6E6259` | `#9A9384` | captions, eyebrows, metadata |
| `border` | `#8C7F73` | `#6F7F92` | control outlines (buttons, inputs): passes 3:1 |
| `line` | `#D9CFBA` | `#1E3148` | decorative hairlines only |
| `foundation` / `on-foundation` | `#3A312B` / `#FEF9ED` | `#F0E8D4` / `#020E1C` | Foundation primary button and chrome |
| `aegis` / `aegis-ink` / `aegis-soft` / `on-aegis` | `#E8B93C` / `#7A5600` / `#F6E7B8` / `#3A312B` | `#E3BD48` / `#E3BD48` / `#1D2321` / `#020E1C` | gold family |
| `themis` / `themis-soft` / `on-themis` | `#2F4FD8` / `#E4E9FA` / `#FFFFFF` | `#9C9AF0` / `#18223A` / `#020E1C` | blue family |
| `link` / `focus` | `#2F4FD8` / `#2F4FD8` | `#9C9AF0` / `#E3BD48` | links, focus ring |
| `success` / `warning` / `danger` (+ `-bg`) | `#1B6B3A` / `#8A5A00` / `#B42318` | `#6FCF8A` / `#E3B341` / `#FF8A80` | status, always with a label |
| `code-bg` / `code-text` | `#2A241F` / `#F0E8D4` | `#0A1626` / `#F0E8D4` | terminal windows are dark in both themes |

Rules:
1. **Gold is a fill, never text, on cream.** Gold on cream is 1.75:1. For gold-toned text use `aegis-ink` (6.3:1). A gold button is gold fill with an `on-aegis` label.
2. **Blue carries meaning:** link, selected, focus, Themis. Don't use it as decoration next to links.
3. **Never show state by colour alone.** Status pills always have a text label and a dot or icon.
4. `line` is for dividers only; anything that marks a control uses `border`.
5. **Separate sections with tinted bands, not borders:** alternate `bg` and `surface` (`k-section--band`).
6. Shadows are small and low-chroma; depth mostly comes from a tint plus a 1 px hairline.
7. **Logo artwork colours** (`--k-brand-gold #D4AF37`, `--k-brand-blue #0080FF`) are for artwork only, never text, links or thin lines (2.0:1 and 3.6:1 on cream).

Measured contrast (light / dark): text on bg 12.1 / 15.9; body text 7.2 / 10.7; captions 5.6 / 6.4; control borders 3.7 / 4.7; Themis blue as text 6.2 / 7.7; `aegis-ink` text 6.3 / 10.8; gold button label 6.9 / 10.8; Foundation button 12.1 / 15.9. All meet WCAG AA.

## 4. Typography

| Role | Family | Weights | Fallback |
|---|---|---|---|
| Display and headings | **teimer-web** (Adobe Fonts) | 300; 300 italic for the accent phrase; 600 only for small strong headings | Georgia, serif |
| Reading | **legitima** (Adobe Fonts) | 500 and 500 italic only | Georgia, serif |
| Labels, nav, buttons, code | **Red Hat Mono** (self-hosted, OFL) | 400, 500 | system monospace |

| Style | Token (`--k-text-*`) | Size | Line height | Tracking | Weight |
|---|---|---|---|---|---|
| Hero | `display-xl` | clamp(2.75rem → 5.5rem) | 1.1 | -0.025em | 300 |
| Display | `display` | clamp(2.25rem → 3.75rem) | 1.1 | -0.025em | 300 |
| H2 | `h2` | clamp(1.75rem → 2.5rem) | 1.18 | -0.015em | 300 |
| H3 | `h3` | clamp(1.375rem → 1.75rem) | 1.18 | -0.015em | 300 |
| H4 | `h4` | 1.25rem | 1.4 | 0 | 600 |
| Body large | `body-l` | 1.125rem | 1.58 | 0 | 500 |
| Body | `body` | 1rem | 1.58 | 0 | 500 |
| Small | `small` | 0.875rem | 1.4 | 0 | 500 |
| Label (mono, uppercase) | `label` | 0.75rem | 1.4 | +0.08em | 500 |

Rules:
- **The accent phrase.** Each headline may have one italic phrase (`<em>`), optionally in an accent colour: "Open tools for defenders, *made with care.*"
- **Sizes and spacing.** Sizes use rem and `clamp()`, never `vw` alone (it breaks zoom). Minimum text size is 12 px. Keep prose to about 68 characters per line (`--k-layout-prose`).
- **legitima's single weight.** It only comes in 500, so never ask for 600 on body text; emphasise with colour instead. `font-synthesis: none` and `lining-nums` are already set on `body`.
- **Case.** Headlines use sentence case. Mono labels are uppercase with at most +0.08em tracking.

## 5. Spacing, radius, elevation

- **Spacing** is on a 4 px base: `--k-space-1` to `-10` are 4, 8, 12, 16, 24, 32, 48, 64, 96 and 128 px. Two values are fluid: `--k-space-gutter` (20–48 px) for page side padding, and `--k-space-section` (64–128 px) for space between sections.
- **Radius** is soft on purpose: `xs` 4, `sm` 8, `md` 12, `lg` 20, `xl` 28, `2xl` 36, `pill` 999.
  - cards: `xl`
  - hero and feature panels: `2xl`
  - buttons and chips: `pill`
  - code windows: `lg`
- **Elevation** is mostly flat:
  - page
  - `surface` plus a hairline
  - `shadow-md` for menus
  - `shadow-lift` for card hover and dialogs

## 6. Layout

- Container is 1200 px (`--k-layout-container`) plus gutter; prose column is 680 px.
- Hero is two columns (copy, then art or code), collapsing to one below 768 px.
- Breakpoints are `min-width` at 480, 768, 1024, 1280 and 1536 px (`--k-layout-bp-*`; media queries need the literal value).
- No sideways scroll at 320 px wide or at 400 % zoom.
- Touch targets are at least 44 px (`--k-layout-target-min`).

## 7. Navigation

- **Top bar.** Sticky, 64 px high, translucent paper (`nav-bg`) with a 12 px backdrop blur. A 1 px hairline fades in after 8 px of scroll (`kairos.js` handles this).
- **Layout.** Wordmark on the left. Links in mono on the right, with the theme toggle (sun or moon, `aria-pressed`) and an optional primary button.
- **Active page.** Use `aria-current="page"` plus a raised pill background, never colour alone.
- **Mobile, below 768 px.** Wordmark on the left and a 44 px menu button on the right, opening a full-width sheet from the top. Trap focus in it, close it on Escape, and make the page behind inert. The starter only hides the links on mobile; add the sheet.
- **Skip link.** It's the first element in the page and becomes visible on focus.

## 8. Components (all in `kairos-base.css`)

| Component | Class | Notes |
|---|---|---|
| Primary button | `k-btn k-btn--primary` | Foundation ink fill. Mono 14 px label, pill shape, optional `→` arrow that shifts 3 px on hover. |
| Product buttons | `k-btn--aegis`, `k-btn--themis` | Only inside that product's section. |
| Secondary button | `k-btn k-btn--secondary` | 1 px `border` outline. |
| Eyebrow | `k-eyebrow` | Mono uppercase label with a small diamond in the accent colour. Numbered verbs are allowed: "#1 Projects". |
| Pill / status | `k-pill`, `--live`, `--building`, `--aegis`, `--themis` | Always text plus dot. |
| Card | `k-card`, `k-card--accent` + `k-accent-*` | `surface` with a hairline and `xl` radius. The accent appears as a 4 px top edge. A whole-card link uses one real `<a class="k-card__link">`, never nested links. Lifts 3 px on hover. |
| Link with underline wipe | `k-link` | Underline grows from the left and exits to the right. |
| Code / terminal | `k-code` | Dark in both themes, three decorative dots, gold `$` prompt. |
| Callout | `k-callout--note/--tip/--warning` | 3 px left bar, tint and a bold mono lead word; never colour alone. |
| Footer | `k-footer` | `surface` band; keep the licence line and contact details here. |

## 9. Motion

| | Values |
|---|---|
| Durations | 80, 150, 240, 360, 600, 720 ms; stagger 60 ms |
| Easings | standard, decelerate, accelerate, smooth `(.22,1,.36,1)`, arrival `(.16,1,.3,1)`, fold `(.65,0,.35,1)` |
| What uses what | Hovers 150 ms; underline and indicator 240 ms; menus 360 ms; reveals 720 ms decelerate. Entrances decelerate; exits accelerate and are shorter. |

Hard rules:
- **Gating.** Everything that moves sits inside `@media (prefers-reduced-motion: no-preference)`, and hover effects also inside `(hover: hover) and (pointer: fine)`. Under reduced motion the tokens collapse to 0.01 ms.
- **Nothing starts hidden without JavaScript.** `kairos.js` hides only elements that start below the fold, and only when IntersectionObserver exists and motion is allowed.
- **Restraint.** No continuous animation, parallax, spin or glow on logos. Infinite loops are reserved for "something is working" spinners.

Mark anything you want revealed on scroll with `data-reveal`. Stagger a list by putting `k-stagger` on the parent and `style="--i:0"`, `--i:1` and so on on the children, up to 8 items.

## 10. Imagery and logos

- **Illustration.** Warm, flat, paper-cut shapes in the palette, built from geometric motifs (diamonds, discs, arcs).
- **Avoid stock security clichés:** hooded hackers, padlocks, glowing shields, green matrix code.
- **Diagrams.** Mono labels, 1.5 px strokes and a single accent for the one point the diagram makes. Every diagram needs a text equivalent.
- **Product logos** have light and dark artwork. Both sit in the page and the theme shows the right one (`k-theme-light-only` and `k-theme-dark-only`, see the starter).
  - Keep 25 % clear space around them.
  - Minimum size is 96 px for a full mark.
  - Show Aegis before Themis.
  - Never recolour, stretch, add effects to, or animate them.
- **Image attributes.** Every `<img>` has `width`, `height` and `alt`. Use `loading="lazy"` below the fold.

## 11. Voice

- **Tone.** Plain, direct, specific. Say what a tool does and does not do. Be humble about limits and firm about governance.
- **Headlines.** Sentence case, concrete nouns and verbs. No fear, war metaphors or hype ("military-grade", "AI-powered", "unleash").
- **Buttons.** Verb plus object: "See the projects", "Install Aegis". Not "Submit" or "OK".
- **Errors.** Give the cause, the effect and the next step.
- **Licences.** State them where they matter, for example "Apache-2.0 or MIT".

## 12. Accessibility checklist (WCAG 2.2 AA)

- [ ] Contrast pairs above hold; no gold text on cream; no logo colours used as text.
- [ ] Visible focus everywhere: a 2 px ring, offset 3 px, never animated away.
- [ ] Status shown with a label plus a glyph, never colour alone.
- [ ] Targets at least 44 px on touch and 24 px minimum.
- [ ] Reflow at 320 px and 400 % zoom; text survives the WCAG text-spacing override.
- [ ] Keyboard reaches everything, with a skip link first; the mobile menu traps focus and closes on Escape.
- [ ] Reduced motion honoured; the page is fully readable with JavaScript off.
- [ ] Sticky nav doesn't cover focused elements (`scroll-padding-top: 5rem` is set).
- [ ] Both themes checked; the toggle has `aria-pressed` and persists.

## 13. Open decisions for the Foundation

1. **Foundation logo and accent.** Both are placeholders: neutral ink and a text wordmark. When a mark exists, set it in teimer-web style and ink, and keep product colours out of it.
2. **Argus accent and artwork.** Neither exists yet. A project accent is exactly five tokens: fill, hover, ink (a text-safe version), soft (a tint background) and "on" (the label colour on the fill). Each needs light and dark values that meet these contrast targets:

   | Pair | Target |
   |---|---|
   | "on" label on the fill | at least 4.5:1 |
   | ink colour as text on the page | at least 4.5:1 |
   | fill as a control | at least 3:1 |

   Add the family to `tokens.json` in the Aegis repo, or to `kairos-tokens.css` here, and check the ratios before using it.
3. **Project list and wording.** Decide which projects appear, and how to describe Aegis given it's now independent.
4. **Mobile menu.** Implement the sheet described in section 7.
