import { Shield, HeartPulse, Landmark, Scale, Building2, Swords } from "lucide-react";

const domains = [
  { icon: Shield, label: "Security" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Landmark, label: "Finance" },
  { icon: Scale, label: "Legal" },
  { icon: Building2, label: "Infrastructure" },
  { icon: Swords, label: "Defence" },
];

const DomainsSection = () => (
  <section className="py-32 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4">
        Kairos is not a security tool
      </h2>
      <p className="text-secondary-foreground mb-16">
        Security is the first domain rigorous enough to prove it.
      </p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-px mb-12">
        {domains.map(({ icon: Icon, label }) => (
          <div key={label} className="bg-secondary flex flex-col items-center justify-center py-10 gap-3">
            <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            <span className="font-mono text-xs text-secondary-foreground">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground font-mono">
        kairos-security is the reference implementation. Other verticals are open for contribution.
      </p>
    </div>
  </section>
);

export default DomainsSection;
