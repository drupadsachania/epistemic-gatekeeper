const ProblemSection = () => (
  <section className="py-32 px-6">
    <div className="max-w-5xl mx-auto">
      <p className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground mb-20 max-w-3xl">
        LLMs act when they shouldn't. Not because they're wrong —{" "}
        <span className="text-primary">because nobody built deferral as a first-class outcome.</span>
      </p>
      <div className="grid md:grid-cols-3 gap-12">
        {[
          "They escalate confident guesses into automated actions",
          "They have no way to say: I don't know enough to act",
          "Uncertainty is collapsed into a single opaque score and ignored",
        ].map((text, i) => (
          <div key={i} className="border-l border-border pl-6">
            <p className="text-secondary-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
