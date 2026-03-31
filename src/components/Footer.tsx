import { Link } from "react-router-dom";
import { Github, MessageCircle, Hash } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-16 px-6">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img src="/kairos-logo.png" alt="Kairos" className="h-8" />
        </Link>
        <div>
          <p className="font-mono text-sm text-foreground mb-1">Kairos</p>
          <p className="text-xs text-muted-foreground">Open Epistemic Decision Framework</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/research" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Paper
        </Link>
        <Link to="/framework" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Framework
        </Link>
        <Link to="/argus" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Argus
        </Link>
        <Link to="/docs/signal-framework-map" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Docs
        </Link>
        <a
          href="https://github.com/kairos-dev-kairos-ecl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
    <div className="max-w-5xl mx-auto mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-xs text-muted-foreground font-mono">
        Built first for security. Designed for everywhere.
      </p>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/kairos-dev-kairos-ecl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
        <a
          href="https://discord.gg/W6PkgexUU"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Discord"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
        <a
          href="https://www.reddit.com/r/Kairos_Foundation/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Reddit"
        >
          <Hash className="w-4 h-4" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
