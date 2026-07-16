import FeaturedProject from "@/components/FeaturedProject";
import Hero from "@/components/Hero";
import IntroLoader from "@/components/IntroLoader";

export default function Home() {
  return (
    <main>
      <IntroLoader />
      <Hero />
      <FeaturedProject />
    </main>
  );
}
