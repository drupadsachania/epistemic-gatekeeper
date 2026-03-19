# Kairos — Open Epistemic Decision Framework

**Know when to act. Know when not to.**

Kairos is an open epistemic decision framework for autonomous systems in high-stakes domains. It constrains LLMs to hypothesis generation, enforces uncertainty-aware decision gating, and treats deferral as a first-class outcome.

## Core Principles

- **Hypothesis-Only**: LLMs generate hypotheses — they never make decisions
- **Earn the Right to Act**: Default is defer; action requires positive evidence across all gates
- **Uncertainty is Structure**: 4-dimensional uncertainty vector, never collapsed to a single score
- **No Silent Failures**: Every epistemic failure is named, logged, and acted upon

## Links

- [Read the Paper](https://kairos.dev/EARNING_THE_RIGHT_TO_ACT.pdf)
- [Framework Documentation](https://github.com/kairos-dev-kairos-ecl/kairos-core)
- [Security Implementation](https://github.com/kairos-dev-kairos-ecl/kairos-security)
- [VANGUARD OS — Reference SOC Dashboard](https://github.com/kairos-dev-kairos-ecl)

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + Shadcn UI
- Hosted on GitHub Pages at [kairos.dev](https://kairos.dev)

## Development

```bash
npm install
npm run dev
```

## License

MIT
