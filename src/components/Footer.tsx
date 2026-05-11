import { Compass } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-secondary-foreground/10 px-6 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2.5" aria-label="Build Plan & Drafting">
          <span className="flex items-center justify-center w-9 h-9 rounded-sm bg-gold/15 border border-gold/40">
            <Compass className="w-5 h-5 text-gold" strokeWidth={2} />
          </span>
          <span className="text-secondary-foreground font-bold text-base tracking-tight leading-none">
            Build <span className="text-gold">Plan</span>
            <span className="block text-[10px] font-medium text-secondary-foreground/60 tracking-[0.2em] uppercase mt-0.5">& Drafting</span>
          </span>
        </a>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-foreground/50">
          <a href="#services" className="hover:text-gold transition-colors">Services</a>
          <a href="#council" className="hover:text-gold transition-colors">Council</a>
          <a href="#architectural" className="hover:text-gold transition-colors">Architectural</a>
          <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
        </div>
        <p className="text-xs text-secondary-foreground/40">
          © {new Date().getFullYear()} Build Plan & Drafting. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
