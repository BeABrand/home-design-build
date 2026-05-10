import { motion } from "framer-motion";

const council = [
  "DA & CDC drawings",
  "Site plans & analysis",
  "Building envelope plans",
  "Landscape plans",
  "Traffic Control Plans",
  "Planning documentation",
];

const architectural = [
  "Floor plans (existing & proposed)",
  "Elevations and sections",
  "Renovations and extensions",
  "New residential designs",
  "Alfresco, decks, and outdoor structures",
  "Layout optimisation",
];

const ProjectTypes = () => {
  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-gold" />
          <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
            Project Types
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-foreground">
          Projects We Cover
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display text-xl font-bold mb-6 text-foreground border-l-2 border-gold pl-4">
              Council & Approval
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {council.map((p) => (
                <div
                  key={p}
                  className="bg-card border border-border rounded-sm px-4 py-3 text-sm text-foreground/80"
                >
                  {p}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-display text-xl font-bold mb-6 text-foreground border-l-2 border-gold pl-4">
              Architectural Drafting
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {architectural.map((p) => (
                <div
                  key={p}
                  className="bg-card border border-border rounded-sm px-4 py-3 text-sm text-foreground/80"
                >
                  {p}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectTypes;
