import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/sections/Hero";
import { FactsStrip } from "@/sections/FactsStrip";
import { Features } from "@/sections/Features";
import { FreeSection } from "@/sections/FreeSection";
import { Faq } from "@/sections/Faq";
import { FinalCta } from "@/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <FactsStrip />
        <Features />
        <FreeSection />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
