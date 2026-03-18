const FooterSection = () => (
  <footer className="border-t border-border py-16 px-6">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <p className="font-mono text-sm text-foreground mb-1">Kairos</p>
        <p className="text-xs text-muted-foreground">Open Epistemic Decision Framework</p>
      </div>
      <div className="flex items-center gap-6">
        <a href="#paper" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Paper</a>
        <a href="https://github.com/kairos-framework" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
        <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">License (MIT)</a>
      </div>
    </div>
    <div className="max-w-5xl mx-auto mt-8">
      <p className="text-xs text-muted-foreground font-mono">Built first for security. Designed for everywhere.</p>
    </div>
  </footer>
);

export default FooterSection;
