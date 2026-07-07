import React from "react";
import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import LiveIntelligence from "@/components/sections/LiveIntelligence";
import FlagshipProducts from "@/components/sections/FlagshipProducts";
import HowItWorks from "@/components/sections/HowItWorks";
import GlobalCoverage from "@/components/sections/GlobalCoverage";
import PlatformCapabilities from "@/components/sections/PlatformCapabilities";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <LiveIntelligence />
      <FlagshipProducts />
      <HowItWorks />
      <GlobalCoverage />
      <PlatformCapabilities />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}