import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificationsSection from "@/components/CertificationsSection";
import WhyMeSection from "@/components/WhyMeSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CursorAnimation from "@/components/CursorAnimation";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CursorAnimation />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <WhyMeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
