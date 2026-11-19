import React from "react";
import Banner from "./Banner/Banner";
import Nabver from "./Nabver/Nabver";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-bangla antialiased selection:bg-emerald-500 selection:text-white">
      {/* ==== Navbar ==== */}
      <Nabver />
      {/* ==== Banner ==== */}
      <Banner />
    </div>
  );
};

export default Home;
