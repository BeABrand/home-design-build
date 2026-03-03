import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Residential", href: "#residential" },
  { label: "Structural", href: "#structural" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-border/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        <a href="#" className="font-display text-xl font-bold text-secondary-foreground tracking-tight">
          DRAFT<span className="text-gold">WORKS</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-secondary-foreground/70 hover:text-gold transition-colors font-medium tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#enquiry"
            className="gradient-gold text-sm font-semibold px-5 py-2 rounded-sm tracking-wide uppercase text-secondary"
          >
            Get a Quote
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-secondary-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-secondary border-t border-border/20 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-secondary-foreground/70 hover:text-gold transition-colors font-medium tracking-wide uppercase py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#enquiry"
                onClick={() => setOpen(false)}
                className="gradient-gold text-sm font-semibold px-5 py-2.5 rounded-sm tracking-wide uppercase text-secondary text-center mt-2"
              >
                Get a Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
