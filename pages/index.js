// pages/index.js
"use client";

import Cta from "../components/layout/Cta";
import Hero from "../components/layout/Hero";
import HeroHowItWorks from "../components/layout/HeroHowItWorks";
import SocialProofAndIndustries from "../components/layout/SocialProofAndIndustries";

const HomePageContent = () => {
  return (
    <main className="w-full flex flex-col overflow-x-hidden ">
      <section className="">
        <Hero />
      </section>
      <section className="">
        <HeroHowItWorks />
      </section>
      <section className="">
        <SocialProofAndIndustries />
      </section>
      <Cta />
    </main>
  );
};

export default HomePageContent;
