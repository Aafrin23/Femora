
import React, { useState } from "react";
import Navbar from "../components/navbar.jsx";
import DomeGallery from "../components/DomeGallery.jsx";
import AuthModal from "../components/authmodal.jsx";

function Home() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF9F7]">

      <Navbar />

      {/* =========================
          HERO
      ========================== */}
      <div className="hero min-h-[85vh]">

        <div className="hero-content text-center w-full">

          <div className="max-w-7xl w-full">

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold p-2 italic text-[#B76E79] font-serif">
              Femora :-) LEVEL UP HER!!
            </h1>


            {/* Dome Gallery */}
            <div className="w-full h-[70vh] rounded-3xl overflow-hidden">

              <DomeGallery
                grayscale={false}
                fit={0.8}
                minRadius={600}
                maxVerticalRotationDeg={0}
                segments={34}
                dragDampening={2}
              />

            </div>


            {/* Description */}
            <p className="py-4 text-xl italic text-black font-serif">
              Move Your Body, Feel Your Power, And Embrace Your Beauty!
              <br />
              Level Up Together With Femora!
            </p>


            {/* Get Started */}
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              className="btn btn-lg bg-[#B76E79] border-none text-white hover:bg-[#9F5966] px-8 shadow-md"
            >
              Get Started

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

            </button>

          </div>

        </div>

      </div>


      {/* =========================
          AUTH POPUP
      ========================== */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />

    </div>
  );
}

export default Home;

