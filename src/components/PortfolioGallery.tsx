import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const projects = [
  { src: portfolio1, title: "Residential Floor Plan", category: "Architectural Drafting", location: "Sydney, NSW" },
  { src: portfolio2, title: "Two-Storey Home", category: "New Build", location: "Melbourne, VIC" },
  { src: portfolio3, title: "Commercial Steel Structure", category: "Structural Drafting", location: "Brisbane, QLD" },
  { src: portfolio4, title: "Granny Flat Elevation", category: "Secondary Dwelling", location: "Perth, WA" },
  { src: portfolio5, title: "Duplex Development", category: "Multi-Dwelling", location: "Adelaide, SA" },
  { src: portfolio6, title: "Slab Reinforcement Detail", category: "Concrete Detailing", location: "Gold Coast, QLD" },
];

const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

const PortfolioGallery = () => {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="section-padding section-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
              Our Work
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Project Portfolio
          </h2>
          <p className="text-secondary-foreground/70 text-lg">
            A selection of drafting and documentation projects delivered for clients across Australia.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-sm text-sm font-display font-medium tracking-wide transition-colors ${
                filter === cat
                  ? "gradient-gold text-secondary"
                  : "bg-slate-deep text-secondary-foreground/60 hover:text-secondary-foreground border border-secondary-foreground/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="group cursor-pointer overflow-hidden rounded-sm border border-secondary-foreground/10"
                onClick={() => setLightbox(projects.indexOf(project))}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={project.src}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="font-display font-bold text-lg text-secondary-foreground mb-1">{project.title}</h3>
                    <p className="text-gold text-sm font-medium">{project.category}</p>
                    <p className="text-secondary-foreground/50 text-xs mt-1">{project.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-secondary/95 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-secondary-foreground/70 hover:text-gold transition-colors"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={projects[lightbox].src}
              alt={projects[lightbox].title}
              className="max-w-full max-h-[80vh] object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 text-center">
              <h3 className="font-display font-bold text-xl text-secondary-foreground">{projects[lightbox].title}</h3>
              <p className="text-gold text-sm">{projects[lightbox].category} — {projects[lightbox].location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioGallery;
