import { motion } from "framer-motion";
import { ArrowRight, Ruler, Building2 } from "lucide-react";
import heroImage from "@/assets/hero-architecture.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
              Build Plan & Drafting
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-secondary-foreground leading-[1.1] mb-6">
            Precision Drafting
            <br />
            for Australian
            <br />
            <span className="text-gold">Construction</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-xl mb-10 font-body leading-relaxed">
            Professional council approval drawings, architectural drafting, construction documentation, and shop drawing services. From DA submissions to fabrication details — built for builders, engineers, and architects across Australia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#enquiry"
              className="gradient-gold inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold tracking-wide uppercase text-secondary rounded-sm hover:opacity-90 transition-opacity"
            >
              Request a Quote <ArrowRight size={16} />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold tracking-wide uppercase text-secondary-foreground border border-secondary-foreground/30 rounded-sm hover:border-gold hover:text-gold transition-colors"
            >
              View Services
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-secondary-foreground/10 pt-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Ruler size={16} className="text-gold" />
                <span className="text-2xl font-display font-bold text-secondary-foreground">500+</span>
              </div>
              <span className="text-sm text-secondary-foreground/50">Projects Delivered</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={16} className="text-gold" />
                <span className="text-2xl font-display font-bold text-secondary-foreground">100%</span>
              </div>
              <span className="text-sm text-secondary-foreground/50">Australian Focused</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-display font-bold text-secondary-foreground">DA & CDC</span>
              </div>
              <span className="text-sm text-secondary-foreground/50">Council Submissions</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
