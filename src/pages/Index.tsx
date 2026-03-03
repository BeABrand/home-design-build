import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesOverview from "@/components/ServicesOverview";
import ResidentialSection from "@/components/ResidentialSection";
import StructuralSection from "@/components/StructuralSection";
import ProjectTypes from "@/components/ProjectTypes";
import DeliverablesSection from "@/components/DeliverablesSection";
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
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Index;
