const stages = [
  { name: "OBSERVE", desc: "Ingest alert, resolve context and evidence" },
  { name: "ORIENT", desc: "LLM generates hypotheses (untrusted source only)" },
  { name: "DECIDE", desc: "Epistemic gates evaluate uncertainty, failures, risk" },
  { name: "ACT", desc: "System earns the right to act — or defers" },
];

const FrameworkSection = () => (
  <section className="py-32 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-16">
        How Kairos works
      </h2>

      {/* Pipeline */}
      <div className="grid md:grid-cols-4 gap-px mb-20">
        {stages.map((stage, i) => (
          <div key={stage.name} className="relative">
            <div className="bg-secondary p-8 h-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-primary text-sm font-semibold">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-mono text-foreground font-semibold tracking-wide">{stage.name}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{stage.desc}</p>
            </div>
            {i < stages.length - 1 && (
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-muted-foreground text-lg">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Callout */}
      <div className="border border-border bg-muted p-8 rounded-md">
        <div className="font-mono text-sm text-secondary-foreground leading-loose space-y-1">
          <p>The LLM cannot recommend actions.</p>
          <p>It cannot influence control flow.</p>
          <p>It cannot bypass any gate.</p>
          <p className="text-primary">It is a hypothesis source. Nothing more.</p>
        </div>
      </div>

      <div className="mt-8">
        <a
          href="https://github.com/kairos-dev-kairos-ecl/kairos-core"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
        >
          Explore the framework documentation →
        </a>
      </div>
    </div>
  </section>
);

export default FrameworkSection;
