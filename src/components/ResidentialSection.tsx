import { motion } from "framer-motion";
import draftingImg from "@/assets/drafting-detail.jpg";

const categories = [
  {
    title: "Concept & Design Drafting",
    items: ["Site plans", "Floor plans", "Elevations & sections", "Basic 3D views", "Space planning"],
  },
  {
    title: "Council Submission Drawings",
    items: ["DA drawings", "CDC drawings", "Planning package layouts", "Shadow diagrams", "Site analysis plans"],
  },
  {
    title: "Construction / Working Drawings",
    items: ["Detailed floor plans", "Window & door schedules", "Set-out plans", "Dimensioned plans", "Material notations"],
  },
  {
    title: "As-Built Drawings",
    items: ["Existing condition drawings", "Redrawing old plans", "PDF to CAD conversion"],
  },
];

const ResidentialSection = () => {
  return (
    <section id="residential" className="section-padding section-warm">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
                Residential
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Residential Architectural Drafting
            </h2>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              We prepare complete residential drawing sets for new homes, extensions, renovations, granny flats, decks, pergolas, carports, garage conversions, and secondary dwellings across Australia.
            </p>

            <div className="rounded-sm overflow-hidden mb-8">
              <img
                src={draftingImg}
                alt="Architectural drafting blueprints and tools on desk"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {categories.map((cat) => (
              <div key={cat.title} className="bg-card border border-border rounded-sm p-6">
                <h3 className="font-display text-lg font-bold mb-3 text-foreground">{cat.title}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResidentialSection;
