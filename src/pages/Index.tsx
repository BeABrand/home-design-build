import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesOverview from "@/components/ServicesOverview";
import ResidentialSection from "@/components/ResidentialSection";
import StructuralSection from "@/components/StructuralSection";
import ProjectTypes from "@/components/ProjectTypes";
import DeliverablesSection from "@/components/DeliverablesSection";
import PortfolioGallery from "@/components/PortfolioGallery";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesOverview />
      <ResidentialSection />
      <StructuralSection />
      <ProjectTypes />
      <DeliverablesSection />
      <PortfolioGallery />
      <Testimonials />
      <ContactForm />
      <FAQSection />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Index;
