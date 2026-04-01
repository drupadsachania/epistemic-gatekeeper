import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const frameworkLinks = [
  { to: "/framework", label: "Overview", desc: "What Kairos ECL is and how it works" },
  { to: "/framework/decision-states", label: "Decision States", desc: "ACT / ESCALATE / DEFER / FAIL_SAFE" },
  { to: "/framework/signal-reference", label: "Signal Reference", desc: "5 core epistemic signals" },
  { to: "/framework/ooda-mapping", label: "OODA Mapping", desc: "OODA loop integration" },
];

const argusLinks = [
  { to: "/argus", label: "Overview", desc: "Reference architecture for epistemic governance" },
  { to: "/argus/examples", label: "Examples", desc: "Threat detection, compliance, incident response" },
];

// --- Desktop Nav ---

const DropdownItem = ({ to, label, desc, soon }: { to: string; label: string; desc: string; soon?: boolean }) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        to={to}
        className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary focus:bg-secondary"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
          {label}
          {soon && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Soon</Badge>}
        </div>
        <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
      </Link>
    </NavigationMenuLink>
  </li>
);

const DesktopNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/problem"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-foreground/70 hover:text-foreground transition-colors",
                isActive("/problem") && "text-foreground font-semibold"
              )}
            >
              Problem
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn("bg-transparent text-foreground/70 hover:text-foreground transition-colors", isActive("/framework") && "text-foreground font-semibold")}
          >
            Framework
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[320px] p-2">
              {frameworkLinks.map((link) => (
                <DropdownItem key={link.to} {...link} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn("bg-transparent text-foreground/70 hover:text-foreground transition-colors", isActive("/argus") && "text-foreground font-semibold")}
          >
            Argus
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[320px] p-2">
              {argusLinks.map((link) => (
                <DropdownItem key={link.to} {...link} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/docs/signal-framework-map"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-foreground/70 hover:text-foreground transition-colors",
                isActive("/docs") && "text-foreground font-semibold"
              )}
            >
              Docs
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/research"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-foreground/70 hover:text-foreground transition-colors",
                isActive("/research") && "text-foreground font-semibold"
              )}
            >
              Research
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/adoption"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-foreground/70 hover:text-foreground transition-colors",
                isActive("/adoption") && "text-foreground font-semibold"
              )}
            >
              Adoption
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// --- Mobile Nav ---

const MobileNavLink = ({
  to,
  label,
  soon,
  onClick,
}: {
  to: string;
  label: string;
  soon?: boolean;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2 py-2 px-3 text-sm text-secondary-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
  >
    {label}
    {soon && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Soon</Badge>}
  </Link>
);

const MobileNavSection = ({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: typeof frameworkLinks;
  onNavigate: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-3 text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-colors">
        {title}
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-3">
        {links.map((link) => (
          <MobileNavLink key={link.to} to={link.to} label={link.label} soon={link.soon} onClick={onNavigate} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] bg-background border-border p-0">
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <Link to="/" onClick={close} className="flex items-center gap-2">
            <img src="/kairos-logo.png" alt="Kairos" className="h-6" />
            <span className="font-mono text-sm text-foreground">Kairos</span>
          </Link>
        </div>
        <nav className="px-3 py-4 space-y-1">
          <MobileNavLink to="/problem" label="Problem" onClick={close} />
          <MobileNavSection title="Framework" links={frameworkLinks} onNavigate={close} />
          <MobileNavSection title="Argus" links={argusLinks} onNavigate={close} />
          <MobileNavLink to="/docs/signal-framework-map" label="Docs" onClick={close} />
          <MobileNavLink to="/research" label="Research" onClick={close} />
          <MobileNavLink to="/community" label="Community" onClick={close} />
          <MobileNavLink to="/adoption" label="Adoption" onClick={close} />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

// --- Main Navbar ---

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: 'hsl(0, 0%, 18%)', borderBottomColor: 'hsl(0, 0%, 25%)', WebkitBackdropFilter: 'blur(10px)' }}>
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/kairos-logo.png" alt="Kairos" className="h-7" />
          <span className="font-mono text-sm font-medium text-foreground hidden sm:inline">Kairos</span>
        </Link>
        {isMobile ? <MobileNav /> : <DesktopNav />}
      </div>
    </nav>
  );
};

export default Navbar;
