const principles = [
  {
    title: "Deferral is a decision",
    desc: "Not a fallback. The system can say I don't know, and that is a valid, logged, auditable outcome.",
  },
  {
    title: "Uncertainty has four dimensions",
    desc: "Model disagreement, semantic agreement, evidence confidence, contradiction — never collapsed into one opaque score.",
  },
  {
    title: "LLMs are untrusted by design",
    desc: "Hypotheses are sanitized, validated, and scored before any gate evaluates them.",
  },
  {
    title: "Every decision is replayable",
    desc: "Full state history, epistemic failures, policy trace, and SHA-256 integrity hash on every run.",
  },
];

const PrinciplesSection = () => (
  <section className="py-32 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-16">
        Built on epistemic humility
      </h2>
      <div className="grid md:grid-cols-2 gap-px">
        {principles.map((p) => (
          <div key={p.title} className="bg-secondary p-10">
            <h3 className="font-mono text-foreground font-medium mb-3 text-sm">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PrinciplesSection;
