const HeroSection = () => (
  <section className="min-h-screen flex items-center justify-center px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8 text-foreground">
        Know when to act.
        <br />
        Know when not to.
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
        Kairos is an open epistemic decision framework for autonomous systems in high-stakes domains.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <a
          href="#paper"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md text-foreground hover:bg-secondary transition-colors text-sm font-medium"
        >
          Read the Paper →
        </a>
        <a
          href="https://github.com/kairos-framework"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
        >
          View on GitHub →
        </a>
      </div>
      <p className="font-mono text-xs text-muted-foreground tracking-wide">
        kairos-security v0.1 · 57/57 tests passing · arXiv preprint
      </p>
    </div>
  </section>
);

export default HeroSection;
