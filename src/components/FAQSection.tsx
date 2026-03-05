import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What areas in Australia do you service?",
    answer:
      "We service all states and territories across Australia. Most of our work is delivered remotely via email and cloud-sharing, so location is never a barrier. For physical site visits, we currently cover the Greater Sydney, Melbourne, and Brisbane metro areas.",
  },
  {
    question: "How long does a typical residential drafting project take?",
    answer:
      "Turnaround depends on the project scope. A standard set of DA drawings for a home extension typically takes 5–10 business days. Full construction drawing sets for new homes usually take 10–15 business days. We'll confirm exact timelines during our initial consultation.",
  },
  {
    question: "What file formats do you deliver?",
    answer:
      "We deliver PDF drawing sets as standard, along with DWG (AutoCAD) files if required. All deliverables are print-ready in A3 and A1 formats. Revision updates are included as agreed in the project scope.",
  },
  {
    question: "Do you work directly with councils for DA submissions?",
    answer:
      "We prepare all required documentation for Development Application (DA) and Complying Development Certificate (CDC) submissions. While we don't lodge directly with councils, our drawings are formatted to meet council requirements and we can liaise with your certifier or planner.",
  },
  {
    question: "Can I upload my existing plans or vision boards?",
    answer:
      "Absolutely! You can upload existing blueprints, sketches, vision boards, or reference images directly through our enquiry form. We accept PDF, JPG, PNG, and DWG files. This helps us understand your project vision from the start.",
  },
  {
    question: "What's included in a free quote?",
    answer:
      "Our free quote includes an assessment of your project scope, estimated turnaround time, a detailed breakdown of deliverables, and a fixed-price proposal. There are no hidden fees — what we quote is what you pay.",
  },
  {
    question: "Do you provide structural engineering drafting as well?",
    answer:
      "Yes. We provide structural drafting services for engineers, fabricators, and builders. This includes footing & slab plans, steel shop drawings, reinforcement detailing, and fabrication drawings. We work from engineer markups and calculations.",
  },
  {
    question: "Can I book a physical site visit?",
    answer:
      "Yes, we offer site visits for projects in the Greater Sydney, Melbourne, and Brisbane areas. You can select a preferred date when submitting your enquiry, and we'll confirm availability within 24 hours.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
              FAQ
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our drafting and design services across Australia.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-foreground font-display hover:text-gold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
