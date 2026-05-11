import axisLogo from "@/assets/axis-logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-secondary-foreground/10 px-6 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#" className="flex items-center">
          <img src={axisLogo} alt="Build Plan & Drafting" className="h-9 w-auto" />
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
