import { motion } from "framer-motion";
import heroImage from "@/assets/hero-architecture.jpg";

const categories = [
  {
    title: "Floor Plans (Existing & Proposed)",
    items: [
      "Existing condition plans",
      "Proposed floor layouts",
      "Room-by-room dimensions",
      "Furniture and fixture layouts",
    ],
  },
  {
    title: "Elevations, Sections & Detailing",
    items: [
      "Front, rear, and side elevations",
      "Section cuts through key areas",
      "Detail callouts and enlargements",
      "Material and finish annotations",
    ],
  },
  {
    title: "Renovations, Extensions & New Builds",
    items: [
      "Renovation and extension drafting",
      "New residential home designs",
      "Secondary dwellings and granny flats",
      "Garage conversions and carports",
    ],
  },
  {
    title: "Outdoor Structures & Space Planning",
    items: [
      "Alfresco, decks, and pergolas",
      "Outdoor kitchens and entertainment areas",
      "Layout optimisation and space planning",
      "Flow and circulation analysis",
    ],
  },
];

const ArchitecturalSection = () => {
  return (
    <section id="architectural" className="section-padding section-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-gold" />
          <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
            Architectural
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Architectural Drafting & Design
        </h2>
        <p className="text-secondary-foreground/70 max-w-2xl mb-12 text-lg leading-relaxed">
          Comprehensive architectural drafting from existing conditions through to proposed designs. We cover residential renovations, new builds, extensions, and outdoor living spaces with precision and attention to detail.
        </p>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
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

          <div>
            <div className="rounded-sm overflow-hidden">
              <img
                src={heroImage}
                alt="Architectural drafting and design residential project"
                className="w-full h-80 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitecturalSection;
