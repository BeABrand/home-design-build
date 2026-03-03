import { motion } from "framer-motion";
import { Home, Wrench } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Residential Architectural Drafting",
    description:
      "Complete residential drafting solutions from concept design through to council submissions and construction documentation for homes across Australia.",
    items: [
      "Floor plans & elevations",
      "DA & CDC drawings",
      "Construction working drawings",
      "As-built documentation",
    ],
    href: "#residential",
  },
  {
    icon: Wrench,
    title: "Structural Engineering Drafting",
    description:
      "Structural documentation support for engineers, fabricators, and builders. Steel shop drawings, reinforced concrete detailing, and engineer markup revisions.",
    items: [
      "Footing & slab plans",
      "Steel shop drawings",
      "Reinforcement detailing",
      "Fabrication drawings",
    ],
    href: "#structural",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ServicesOverview = () => {
  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-gold" />
          <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
            Our Services
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
          Drafting Solutions for
          <br />
          Every Stage of Your Project
        </h2>
        <p className="text-muted-foreground max-w-2xl mb-16 text-lg">
          From initial concept sketches to council-ready documentation and full construction sets — we deliver precise, compliant drafting tailored to Australian standards.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {services.map((service) => (
            <motion.a
              key={service.title}
              variants={item}
              href={service.href}
              className="group block bg-card border border-border rounded-sm p-8 md:p-10 hover:border-gold/50 transition-colors"
            >
              <service.icon size={32} className="text-gold mb-6" />
              <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.items.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
