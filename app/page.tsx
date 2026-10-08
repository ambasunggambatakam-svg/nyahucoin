import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Vision from "@/components/Vision";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Shell from "@/components/Shell";

export default function Home() {
  return (
    <Shell>
      <main className="flex-1">
        <Navbar />
        <Hero />
        <Marquee />
        <Vision />
        <Tokenomics />
        <Roadmap />
        <Cta />
        <Footer />
      </main>
    </Shell>
  );
}
