import { motion } from "framer-motion";
import draftingImg from "@/assets/drafting-detail.jpg";

const categories = [
  {
    title: "Development Application (DA) Drawings",
    items: [
      "DA-ready plans and elevations",
      "Statement of environmental effects support",
      "Schedule of materials and finishes",
    ],
  },
  {
    title: "Complying Development Certificate (CDC)",
    items: [
      "CDC-compliant documentation",
      "Code-checking against SEPP and local codes",
      "Certifier-ready drawing sets",
    ],
  },
  {
    title: "Site Analysis & Planning",
    items: [
      "Site plans with setbacks and FSR",
      "Site coverage calculations",
      "Shadow diagrams (if required)",
    ],
  },
  {
    title: "Building Envelope, Landscape & TCP",
    items: [
      "Building envelope plans",
      "Landscape plans",
      "Traffic Control Plans (TCP)",
      "Planning documentation support",
    ],
  },
];

const CouncilSection = () => {
  return (
    <section id="council" className="section-padding section-warm">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
                Council & Approval
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Council & Approval Drawings
            </h2>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              We prepare complete documentation for Development Applications (DA), Complying Development Certificates (CDC), and all council submission requirements across Australia. Our drawings are formatted to meet council standards and certifier expectations.
            </p>

            <div className="rounded-sm overflow-hidden mb-8">
              <img
                src={draftingImg}
                alt="Council approval drafting blueprints and planning documents"
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
                <ul className="grid grid-cols-1 gap-2">
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

export default CouncilSection;
