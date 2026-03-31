import { Link } from "react-router-dom";
import { ArrowRight, Github, MessageCircle, Hash, ExternalLink, BookOpen, Code, Shield } from "lucide-react";

const repos = [
  {
    name: "kairos-core",
    description: "The Kairos ECL framework specification — decision states, signals, failure modes, and the formal state machine.",
    url: "https://github.com/kairos-dev-kairos-ecl/kairos-core",
    icon: BookOpen,
  },
  {
    name: "kairos-security",
    description: "Reference implementation of the Epistemic Decision Engine for security automation. 57/57 tests passing.",
    url: "https://github.com/kairos-dev-kairos-ecl/kairos-security",
    icon: Shield,
  },
  {
    name: "argus",
    description: "Reference architecture for epistemic governance — signal extraction, decision gates, and audit trails.",
    url: "https://github.com/kairos-dev-kairos-ecl/argus",
    icon: Code,
  },
];

const socials = [
  {
    name: "Discord",
    description: "Join the conversation — discuss the framework, share implementations, ask questions.",
    url: "https://discord.gg/W6PkgexUU",
    icon: MessageCircle,
    cta: "Join Discord",
  },
  {
    name: "Reddit",
    description: "r/Kairos_Foundation — long-form discussion, case studies, and community posts.",
    url: "https://www.reddit.com/r/Kairos_Foundation/",
    icon: Hash,
    cta: "Visit Subreddit",
  },
  {
    name: "GitHub",
    description: "Star the repos, open issues, submit PRs. All code is open source.",
    url: "https://github.com/kairos-dev-kairos-ecl",
    icon: Github,
    cta: "View Organization",
  },
];

const Community = () => (
  <div>
    {/* Hero */}
    <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-foreground">
          Community
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Kairos is an open framework. Join the community building epistemic governance
          for autonomous systems — researchers, engineers, security teams.
        </p>
      </div>
    </section>

    {/* Social Channels */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Connect</h2>
        <div className="grid sm:grid-cols-3 gap-4 animate-stagger">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border rounded-lg p-5 card-hover flex flex-col"
            >
              <s.icon className="h-7 w-7 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">{s.name}</h3>
              <p className="text-xs text-muted-foreground mb-4 flex-1 leading-relaxed">{s.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                {s.cta} <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* Repositories */}
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Repositories</h2>
        <div className="space-y-3 animate-stagger">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 border border-border rounded-lg p-4 card-hover"
            >
              <repo.icon className="h-5 w-5 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-medium text-foreground group-hover:text-primary transition-colors">{repo.name}</p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{repo.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* Contribute */}
    <section className="px-6 pb-24">
      <div className="max-w-3xl mx-auto border-t border-border pt-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">How to Contribute</h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kairos is licensed CC BY-SA 4.0. The reference implementations are open source.
            We welcome contributions from researchers, security practitioners, and engineers.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-1">For researchers</p>
              <p className="text-xs text-muted-foreground">Validate the framework, propose new failure modes, extend the signal taxonomy, or test in new domains.</p>
            </div>
            <div className="border border-border rounded-lg p-4 card-hover">
              <p className="text-sm font-medium text-foreground mb-1">For engineers</p>
              <p className="text-xs text-muted-foreground">Build integrations, add signal extractors, write plugins, or improve the Argus reference architecture.</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex gap-6">
          <Link to="/adoption" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            Start with Adoption Guide <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link to="/framework" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Read the Framework <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Community;
