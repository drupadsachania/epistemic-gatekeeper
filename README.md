# Kairos Foundation website

Source for [kairos-foundation.org](https://kairos-foundation.org): the research-led site for **Kairos**, an open framework in which an AI system has to *earn the right to act*, and for the projects around it (Argus, Aegis, Themis).

## What the site covers

- **Kairos (the thesis):** three gates and a provenance veto evaluated outside the language model, with an interactive decision-gate simulator. Research: *Earning the Right to Act* (preprint, October 2026), with preliminary results shown beside their limitations.
- **Products:** Argus XDR / SDK (observability), Aegis (defensive skills for AI assistants), Themis (governed security-operations agent).
- **Framework pages:** gates and uncertainty, decision states and risk tiers, threat model and failure modes, adoption guide, cross-reference.

Framework specifications live in [kairos-core](https://github.com/kairos-dev-kairos-ecl/kairos-core); the security-operations profile and reference engine in [kairos-security](https://github.com/kairos-dev-kairos-ecl/kairos-security).

## Design language

The site follows the Kairos design language in [`kairos-design-handoff/`](kairos-design-handoff/README.md): warm paper and deep navy, teimer-web and legitima (Adobe Fonts kit `pww4pkx`) for voice, Red Hat Mono for machinery, one accent per project, light by default with an opt-in dark theme, WCAG 2.2 AA.

| | |
|---|---|
| Tokens | `src/styles/kairos-tokens.css` (handoff tokens + Kairos slate and Argus teal accents) |
| Components | `src/styles/kairos-base.css`, `src/styles/kairos-site.css` |
| Legacy bridge | `src/styles/colors.css` maps older variable names onto the tokens |
| Behaviour | `src/lib/kairos.ts` (theme toggle, sticky nav, reveal on scroll) |

Use `--k-*` tokens and `k-` classes in new code, never raw hex.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run test     # vitest
npm run lint
```

## Deployment

Every push to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`); `public/CNAME` points the site at kairos-foundation.org.

The previous site (the "Epistemic Prism" design, live until October 2026) is archived at the `archive-epistemic-prism-2026-10` tag (commit `fd92183`).

## License

MIT
