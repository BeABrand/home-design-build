import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactCTA = () => {
  return (
    <section id="contact" className="section-padding section-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
              Get Started
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-secondary-foreground/70 text-lg">
            Get in touch for a free quote. We work with builders, engineers, architects, and homeowners across Australia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <a
            href="mailto:info@buildplananddrafting.com.au"
            className="bg-slate-deep border border-secondary-foreground/10 rounded-sm p-6 text-center hover:border-gold/50 transition-colors group"
          >
            <Mail size={24} className="text-gold mx-auto mb-3" />
            <h3 className="font-display font-bold mb-1 group-hover:text-gold transition-colors">Email Us</h3>
            <p className="text-sm text-secondary-foreground/60">info@buildplananddrafting.com.au</p>
          </a>
          <a
            href="tel:+61480024017"
            className="bg-slate-deep border border-secondary-foreground/10 rounded-sm p-6 text-center hover:border-gold/50 transition-colors group"
          >
            <Phone size={24} className="text-gold mx-auto mb-3" />
            <h3 className="font-display font-bold mb-1 group-hover:text-gold transition-colors">Call Us</h3>
            <p className="text-sm text-secondary-foreground/60">+61 480 024 017</p>
          </a>
          <div className="bg-slate-deep border border-secondary-foreground/10 rounded-sm p-6 text-center">
            <MapPin size={24} className="text-gold mx-auto mb-3" />
            <h3 className="font-display font-bold mb-1">Location</h3>
            <p className="text-sm text-secondary-foreground/60">Servicing All of Australia</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
