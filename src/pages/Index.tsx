import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Code, FlaskConical, Shield, AlertTriangle, Eye } from "lucide-react";

const pathCards = [
  {
    icon: BookOpen,
    title: "Learn",
    description: "Understand the epistemic decision framework and why observable isn't trustworthy.",
    link: "/framework",
    linkText: "Explore the Framework",
  },
  {
    icon: Code,
    title: "Build",
    description: "Use the Argus reference architecture to add epistemic governance to your agents.",
    link: "/argus",
    linkText: "Get Started with Argus",
  },
  {
    icon: FlaskConical,
    title: "Research",
    description: "Read the paper, review validation results, and dive into the theory.",
    link: "/research",
    linkText: "Read the Paper",
  },
];

const previewItems = [
  {
    icon: AlertTriangle,
    title: "The Problem",
    text: "Autonomous agents make high-stakes decisions with no epistemic accountability. Logs show what happened — not whether it was safe to act.",
    link: "/problem",
  },
  {
    icon: Shield,
    title: "Four Decision States",
    text: "Every decision maps to ACT, ESCALATE, DEFER, or FAIL_SAFE — based on confidence, grounding, and risk, not just model output.",
    link: "/framework/decision-states",
  },
  {
    icon: Eye,
    title: "Five Core Signals",
    text: "Confidence, grounding, contradiction, temporal alignment, and reversibility — the epistemic inputs that drive every gate.",
    link: "/framework/signal-reference",
  },
];

const Index = () => (
  <div>
    {/* Hero */}
    <section className="flex items-center justify-center px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-4xl mx-auto text-center">
        <img
          src="/kairos-logo.png"
          alt="Kairos"
          className="h-16 md:h-24 mx-auto mb-8"
        />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-foreground">
          Epistemic Governance
          <br />
          for Autonomous Systems
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Make uncertain decisions visible. Trustworthy autonomy starts with understanding.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/problem"
            className="inline-flex items-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-all text-sm font-medium shadow-lg shadow-destructive/20 hover:shadow-destructive/40"
          >
            Read the Problem <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/argus"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md text-foreground hover:bg-secondary hover:border-primary/50 transition-all text-sm font-medium"
          >
            Try Argus <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    {/* Quick Problem Statement */}
    <section className="px-6 pb-20">
      <blockquote className="max-w-3xl mx-auto border-l-2 border-primary/40 pl-6 text-muted-foreground text-lg italic leading-relaxed">
        When autonomous agents make decisions, you see logs. But logs don't tell you if the decision was safe.
        Kairos ECL makes uncertainty visible.
      </blockquote>
    </section>

    {/* Three Paths */}
    <section className="px-6 pb-24">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 animate-stagger">
        {pathCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="group border border-border rounded-lg p-6 hover:border-primary/50 hover:bg-secondary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <card.icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{card.description}</p>
            <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
              {card.linkText} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>

    {/* Preview Cards */}
    <section className="px-6 pb-24 border-t border-border pt-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-10 text-center">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {previewItems.map((item) => (
            <Link key={item.title} to={item.link} className="group border border-transparent rounded-lg p-4 -m-4 hover:border-border hover:bg-secondary/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <h3 className="font-medium text-foreground">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{item.text}</p>
              <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Index;
