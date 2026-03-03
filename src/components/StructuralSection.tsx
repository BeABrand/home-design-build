import { motion } from "framer-motion";

const categories = [
  {
    title: "Structural Documentation",
    items: ["Footing & slab plans", "Beam & column layouts", "Structural framing plans", "Roof structure layouts", "Retaining wall drawings"],
  },
  {
    title: "Reinforced Concrete Detailing",
    items: ["Slab reinforcement detailing", "Footing reinforcement schedules", "Beam reinforcement detailing", "Concrete section detailing"],
  },
  {
    title: "Structural Steel Drafting",
    items: ["Steel shop drawings", "Connection details", "Plate detailing", "Fabrication drawings", "GA drawings"],
  },
  {
    title: "Drafting Support Services",
    items: ["Engineer mark-up revisions", "Sketch-to-CAD conversion", "PDF to DWG conversion", "As-built structural drawings", "Redline updates"],
  },
];

const StructuralSection = () => {
  return (
    <section id="structural" className="section-padding section-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-gold" />
          <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
            Structural
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Structural Engineering Drafting
        </h2>
        <p className="text-secondary-foreground/70 max-w-2xl mb-12 text-lg leading-relaxed">
          We provide structural drafting support for engineers, fabricators, and builders across Australia. Services include preparation of structural documentation based on engineer markups and calculations.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-slate-deep border border-secondary-foreground/10 rounded-sm p-6"
            >
              <h3 className="font-display text-lg font-bold mb-4 text-gold">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StructuralSection;
