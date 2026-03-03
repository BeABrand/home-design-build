import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone must be under 20 characters"),
  projectType: z.string().trim().min(1, "Please select a project type"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be under 2000 characters"),
});

type EnquiryForm = z.infer<typeof enquirySchema>;

const projectTypes = [
  "New Residential Home",
  "House Extension",
  "Renovation",
  "Granny Flat",
  "Deck & Pergola",
  "Structural Drafting",
  "Steel Shop Drawings",
  "As-Built Drawings",
  "Other",
];

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", email: "", phone: "", projectType: "", message: "" },
  });

  const onSubmit = (data: EnquiryForm) => {
    // In production, this would send to a backend
    console.log("Enquiry submitted:", { ...data, email: "[redacted]" });
    setSubmitted(true);
  };

  return (
    <section id="enquiry" className="section-padding bg-background">
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
              Enquire Now
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Request a Free Quote
          </h2>
          <p className="text-muted-foreground text-lg">
            Tell us about your project and we'll get back to you within 24 hours with a tailored quote.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <div className="text-center py-16 px-6 border border-border rounded-sm bg-card">
              <CheckCircle size={48} className="text-gold mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Thank You!
              </h3>
              <p className="text-muted-foreground">
                Your enquiry has been received. We'll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 border border-border rounded-sm p-8 bg-card">
                <div className="grid md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-display">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-display">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com.au" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-display">Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="04XX XXX XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-display">Project Type</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Select a project type</option>
                            {projectTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-display">Project Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project, location, and any specific requirements..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full gradient-gold text-secondary font-display font-semibold tracking-wide uppercase h-12">
                  <Send size={18} />
                  Submit Enquiry
                </Button>
              </form>
            </Form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
