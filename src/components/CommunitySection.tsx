const CommunitySection = () => (
  <section className="py-32 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-16">
        Open standard. Open source.
      </h2>
      <div className="grid md:grid-cols-2 gap-16 mb-12">
        <div className="space-y-4">
          <a
            href="https://github.com/kairos-dev-kairos-ecl/kairos-core"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-mono text-sm text-foreground hover:text-primary transition-colors"
          >
            kairos-framework/kairos-core →
          </a>
          <a
            href="https://github.com/kairos-dev-kairos-ecl/kairos-security"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-mono text-sm text-foreground hover:text-primary transition-colors"
          >
            kairos-framework/kairos-security →
          </a>
        </div>
        <div>
          <p className="text-secondary-foreground leading-relaxed">
            Kairos is designed to be extended. Build a vertical. Contribute a failure mode. Write a domain adapter.
          </p>
        </div>
      </div>
      <a
        href="https://github.com/kairos-framework"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
      >
        Join on GitHub →
      </a>
    </div>
  </section>
);

export default CommunitySection;
