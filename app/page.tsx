import AboutSection from "@/components/AboutSection";
import ContactFooter from "@/components/ContactFooter";
import FeaturedProject from "@/components/FeaturedProject";
import Hero from "@/components/Hero";
import IntroLoader from "@/components/IntroLoader";
import ProjectArchive from "@/components/ProjectArchive";

export default function Home() {
  return (
    <main id="main-content">
      <IntroLoader />
      <Hero />
      <FeaturedProject />
      <ProjectArchive />
      <AboutSection />
      <ContactFooter />
    </main>
  );
}
