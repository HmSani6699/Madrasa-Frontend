import React from "react";
import Banner from "./Banner/Banner";
import Nabver from "./Nabver/Nabver";
import TrustedByMadrasa from "./TrustedByMadrasa/TrustedByMadrasa";
import OurServicesSection from "./OurServicesSection/OurServicesSection";
import Package from "./Package/Package";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-bangla antialiased selection:bg-emerald-500 selection:text-white">
      {/* ==== Navbar ==== */}
      <Nabver />
      {/* ==== Banner ==== */}
      <Banner />
      {/* ==== Trusted By Madrasas (Marquee Section) ==== */}
      <TrustedByMadrasa />
      {/* ==== Our Services / Digital Solution Section ==== */}
      <OurServicesSection />
      {/* ==== Package / Pricing Section ==== */}
      <Package />
    </div>
  );
};

export default Home;
