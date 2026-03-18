const PaperSection = () => (
  <section id="paper" className="py-32 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-16">
        The founding paper
      </h2>
      <h3 className="text-2xl md:text-3xl font-medium text-foreground leading-snug max-w-3xl mb-6">
        Earning the Right to Act: Epistemic Control Loops for Trustworthy LLM-Based Security Automation
      </h3>
      <p className="text-secondary-foreground mb-2">Drupad Sachania</p>
      <span className="inline-block font-mono text-xs text-primary bg-primary/10 px-3 py-1 rounded-sm mb-10">
        arXiv preprint · cs.CR · cs.AI
      </span>
      <div className="mb-12">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md text-foreground hover:bg-secondary transition-colors text-sm font-medium"
        >
          Read Preprint →
        </a>
      </div>
      <blockquote className="border-l-2 border-primary pl-6 font-mono text-sm italic text-muted-foreground leading-loose max-w-2xl">
        "The question is not whether an LLM can generate a hypothesis.
        <br />
        The question is whether the system knows when not to believe it."
      </blockquote>
    </div>
  </section>
);

export default PaperSection;
