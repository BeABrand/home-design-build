import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "James Mitchell",
    role: "Builder",
    company: "Mitchell Constructions",
    location: "Sydney, NSW",
    text: "DraftWorks delivered our DA drawings for a duplex project in under a week. The quality was spot-on, and council had zero issues with the documentation. Highly recommend for any residential work.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Structural Engineer",
    company: "Chen Engineering",
    location: "Melbourne, VIC",
    text: "We've been using DraftWorks for structural steel shop drawings for over two years. Their attention to detail on connection details and fabrication drawings saves us significant review time.",
    rating: 5,
  },
  {
    name: "Mark & Lisa Thompson",
    role: "Homeowners",
    company: "",
    location: "Brisbane, QLD",
    text: "We needed construction drawings for our home renovation and granny flat. DraftWorks made the whole process stress-free — from initial concept plans right through to council approval.",
    rating: 5,
  },
  {
    name: "David Russo",
    role: "Project Manager",
    company: "Russo Developments",
    location: "Perth, WA",
    text: "Fast turnaround, competitive pricing, and they understand Australian building standards inside out. DraftWorks is our go-to drafting partner for every new project.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding section-warm">
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
              Client Reviews
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted Across Australia
          </h2>
          <p className="text-muted-foreground text-lg">
            Builders, engineers, and homeowners rely on DraftWorks for accurate, timely drafting services.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border rounded-sm p-8 relative"
            >
              <Quote size={28} className="text-gold/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div>
                <p className="font-display font-bold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t.role}{t.company ? `, ${t.company}` : ""} — {t.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
