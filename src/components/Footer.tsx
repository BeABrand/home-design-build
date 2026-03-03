const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-secondary-foreground/10 px-6 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#" className="font-display text-lg font-bold text-secondary-foreground tracking-tight">
          DRAFT<span className="text-gold">WORKS</span>
        </a>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-foreground/50">
          <a href="#services" className="hover:text-gold transition-colors">Services</a>
          <a href="#residential" className="hover:text-gold transition-colors">Residential</a>
          <a href="#structural" className="hover:text-gold transition-colors">Structural</a>
          <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
        </div>
        <p className="text-xs text-secondary-foreground/40">
          © {new Date().getFullYear()} DraftWorks Australia. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
