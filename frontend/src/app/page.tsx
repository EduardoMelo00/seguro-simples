import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { ValueProps } from "@/components/landing/ValueProps";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppCTA } from "@/components/shared/WhatsAppCTA";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustStrip />
      <ValueProps />
      <HowItWorks />
      <Footer />
      <WhatsAppCTA />
    </main>
  );
}
