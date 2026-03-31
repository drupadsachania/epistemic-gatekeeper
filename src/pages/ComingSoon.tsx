import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ComingSoonProps {
  title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => (
  <div className="py-32 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-8">
        Coming soon
      </h2>
      <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
        {title}
      </h1>
      <p className="text-secondary-foreground mb-12 max-w-2xl leading-relaxed">
        This page is under development. Check back soon or follow us on GitHub for updates.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
    </div>
  </div>
);

export default ComingSoon;
