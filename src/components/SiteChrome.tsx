import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Ticket,Github, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/vendors", label: "Vendors" },
  { to: "/food", label: "Food Explorer" },
  { to: "/schedule", label: "Schedule" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex flex-col leading-none" aria-label="Street Bites home">
      <span className="sticker -rotate-3 bg-chili text-lg text-sun">Street</span>
      <span className="sticker -mt-1 ml-5 rotate-1 bg-sky text-lg text-primary">Bites</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              activeProps={{ className: "bg-secondary text-primary" }}
              inactiveProps={{ className: "text-ink/80 hover:text-primary" }}
              className="rounded-full px-4 py-2 text-sm font-bold transition">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/schedule" className="hidden items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold uppercase text-primary-foreground shadow-[4px_4px_0_0_var(--chili)] transition hover:-translate-y-0.5 md:inline-flex">
          <Ticket className="h-4 w-4" /> 12–14 June · Plan visit
        </Link>
        <button className="rounded-full p-2 text-primary md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-5 py-4 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: true }}
              activeProps={{ className: "bg-secondary" }} className="rounded-2xl px-4 py-3 font-display text-xl text-primary">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr_1.4fr]">
        <div>
          <div className="font-display text-5xl text-sun">Street Bites</div>
          <p className="mt-3 max-w-sm text-primary-foreground/80">A world of flavor. One incredible festival. 12–14 June 2027 · Riverside Park, Old Harbour.</p>
        <div className="mt-5 flex gap-3">
  {[
    { icon: Github, url: "https://github.com/Hadil-Ben-Abdallah", label: "GitHub" },
    { icon: Linkedin, url: "https://www.linkedin.com/in/hadil-ben-abdallah/", label: "LinkedIn" },
    { icon: Twitter, url: "https://x.com/hadilbnabdallah", label: "Twitter" },
  ].map(({ icon: Icon, url, label }) => (
    <a
      key={label}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="rounded-full bg-primary-foreground/10 p-2.5 hover:bg-chili"
    >
      <Icon className="h-4 w-4" />
    </a>
  ))}
</div>
        </div>
        <nav className="flex flex-col gap-2 text-sm font-semibold">
          <span className="mb-1 text-xs uppercase tracking-widest text-sun">Explore</span>
          {NAV.map((n) => <Link key={n.to} to={n.to} className="hover:text-sun">{n.label}</Link>)}
        </nav>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email");
            return;
          }
          toast.success("You're on the list!", { description: "Lineup drops and early-bird bites, straight to your inbox." });
          setEmail("");
        }}>
          <span className="text-xs font-bold uppercase tracking-widest text-sun">Get the first bite</span>
          <p className="mt-2 text-sm text-primary-foreground/80">Vendor reveals, secret menus and chef lineups.</p>
          <div className="mt-4 flex rounded-full bg-primary-foreground p-1">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" aria-label="Email" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none" />
            <button className="rounded-full bg-chili px-5 py-2.5 text-sm font-extrabold uppercase">Subscribe</button>
          </div>
        </form>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
  © 2026 Street Bites Festival · Fictional festival · Made with 💛 by{" "}
  <a
    href="https://dev.to/hadil"
    target="_blank"
    rel="noopener noreferrer"
    className="relative inline-block font-semibold text-primary-foreground transition-colors duration-300 hover:text-chili after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:w-0 after:bg-chili after:transition-all after:duration-300 hover:after:w-full"
  >
    Hadil Ben Abdallah
  </a>
</div>
    </footer>
  );
}
