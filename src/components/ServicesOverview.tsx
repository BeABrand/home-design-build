import { motion } from "framer-motion";
import {
  ShieldCheck,
  Home,
  HardHat,
  Boxes,
  Cog,
  Calculator,
  Zap,
} from "lucide-react";

const services = [
  {
    icon: ShieldCheck,
    title: "Council & Approval Drawings",
    description:
      "Complete documentation for Development Applications (DA), Complying Development Certificates (CDC), and all council submission requirements across Australia.",
    items: [
      "DA & CDC drawings",
      "Site plans (setbacks, FSR, coverage)",
      "Building envelope plans",
      "Landscape plans",
      "Traffic Control Plans (TCP)",
      "Planning documentation support",
    ],
  },
  {
    icon: Home,
    title: "Architectural Drafting & Design",
    description:
      "Comprehensive architectural drafting from existing conditions through to proposed designs, covering residential renovations, new builds, and outdoor living spaces.",
    items: [
      "Floor plans (existing & proposed)",
      "Elevations and sections",
      "Renovations and extensions",
      "New residential designs",
      "Alfresco, decks, and outdoor structures",
      "Layout optimisation and space planning",
    ],
  },
  {
    icon: HardHat,
    title: "Construction Documentation",
    description:
      "Full construction drawing sets and build-ready documentation coordinated with structural details for a seamless build process.",
    items: [
      "Full construction drawing sets",
      "Structural detailing coordination",
      "Footing and slab details",
      "Roof plans and framing layouts",
      "Build-ready documentation",
    ],
  },
  {
    icon: Boxes,
    title: "Revit & BIM Documentation",
    description:
      "CAD to Revit conversion and BIM-ready modelling for modern design workflows, collaboration, and clash detection.",
    items: [
      "CAD to Revit conversion",
      "General Arrangement (GA) plans",
      "Reflected Ceiling Plans (RCP)",
      "Finishes plans",
      "Joinery and interior elevations",
      "BIM-ready modelling and documentation",
    ],
  },
  {
    icon: Cog,
    title: "Shop Drawings & Fabrication",
    description:
      "Detailed shop drawings for steel, timber, and custom fabrication elements. Mezzanines, stairs, gates, fences, and more.",
    items: [
      "Steel and timber shop drawings",
      "Mezzanine, stairs, and structural elements",
      "Gates, fences, and custom fabrication drawings",
      "Material cut lists and detailing",
    ],
  },
  {
    icon: Calculator,
    title: "Estimation & Planning Support",
    description:
      "Pre-construction quantity takeoffs, cost planning, and feasibility studies to keep your project on budget and on track.",
    items: [
      "Quantity takeoffs",
      "Cost planning and estimation",
      "Cut and fill calculations",
      "Feasibility and layout studies",
    ],
  },
  {
    icon: Zap,
    title: "Small Drafting & Updates",
    description:
      "Quick-turnaround drafting tasks, redline markups, and minor plan updates when you need them fast.",
    items: [
      "Roof plans and shed drawings",
      "Redline markups and revisions",
      "Minor plan updates and edits",
      "Quick turnaround drafting tasks",
    ],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
          From council approvals and architectural design through to construction documentation, shop drawings, and BIM — we deliver precise, compliant drafting tailored to Australian standards.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="group block bg-card border border-border rounded-sm p-6 md:p-8 hover:border-gold/50 transition-colors"
            >
              <service.icon size={28} className="text-gold mb-5" />
              <h3 className="font-display text-lg md:text-xl font-bold mb-3 text-foreground group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-1.5">
                {service.items.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
