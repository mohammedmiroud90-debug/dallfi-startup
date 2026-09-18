import EcosystemCards from "@/components/EcosystemCards";
import Hero from "@/components/Hero";
import HomeIntro from "@/components/HomeIntro";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <HomeIntro />
      <EcosystemCards />
    </main>
  );
}
