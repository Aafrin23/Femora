import React from "react";
import FeaturesNavbar from "../components/FeaturesNavbar";
import { useNavigate } from "react-router-dom";

const beautyVideos = [
  {
    title: "Simple Skincare Routine",
    url: "https://www.youtube.com/embed/OrElyY7MFVs",
  },
  {
    title: "Healthy Skin Habits",
    url: "https://www.youtube.com/embed/nabwuTwtlnM",
  },
  {
    title: "Glowing Skin Routine",
    url: "https://www.youtube.com/embed/9g7SXlFYtaQ",
  },
  {
    title: "Skincare Tips",
    url: "https://www.youtube.com/embed/k9Yo5vYv-B4",
  },
  {
    title: "Daily Beauty Routine",
    url: "https://www.youtube.com/embed/xv0ISHGGw1A",
  },
];

const beautyTips = [
  {
    emoji: "🧴",
    title: "Keep Your Skin Clean",
    description:
      "Cleanse your face gently to remove dirt, sweat and excess oil.",
  },
  {
    emoji: "💧",
    title: "Stay Hydrated",
    description:
      "Drink enough water throughout the day to support healthy-looking skin.",
  },
  {
    emoji: "☀️",
    title: "Never Skip Sunscreen",
    description:
      "Protect your skin from everyday sun exposure with a broad-spectrum sunscreen.",
  },
  {
    emoji: "🌙",
    title: "Night Care Matters",
    description:
      "Give your skin some care before bed and always remove makeup before sleeping.",
  },
  {
    emoji: "🥗",
    title: "Eat for Your Skin",
    description:
      "A balanced diet with fruits, vegetables and nutritious foods can support overall skin health.",
  },
  {
    emoji: "💖",
    title: "Make Time for Yourself",
    description:
      "Beauty is also about feeling good. Take a few minutes every day for self-care.",
  },
];

function Beauty() {
    const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-white text-[#351b2d]">
      <FeaturesNavbar />
 <div className="max-w-7xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-[#B76E79] hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
      {/* HERO */}
      <section className="px-6 pt-16 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-[#f7d8dc] via-[#f9e4e5] to-[#ead2dc] rounded-[32px] px-8 md:px-16 py-14 relative overflow-hidden">
            
            <div className="max-w-2xl relative z-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8d5268] mb-4">
                Femora Beauty
              </p>

              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                Beauty ✨
              </h1>

              <p className="text-lg md:text-xl leading-relaxed text-[#5b3a4c]">
                Glow with confidence through simple skincare, self-care,
                healthy habits and beauty routines that make you feel good
                inside and out. 💗
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("beauty-tips")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-8 px-7 py-3 rounded-full bg-[#6f304d] text-white font-medium hover:bg-[#55243b] transition"
              >
                Explore Beauty
              </button>
            </div>

            <div className="absolute -right-10 -bottom-16 w-64 h-64 rounded-full bg-white/30" />
            <div className="absolute right-20 top-10 w-24 h-24 rounded-full bg-[#b76e79]/20" />
          </div>
        </div>
      </section>

      {/* BEAUTY CATEGORIES */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <p className="text-[#b76e79] font-medium">Explore</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">
            Your Beauty Space 💕
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            ["🧴", "Skincare"],
            ["💄", "Makeup"],
            ["💇‍♀️", "Hair Care"],
            ["💅", "Nail Care"],
          ].map(([emoji, title]) => (
            <div
              key={title}
              className="bg-white rounded-3xl p-6 text-center shadow-sm border border-[#f1dce1] hover:-translate-y-1 hover:shadow-md transition"
            >
              <div className="text-4xl mb-3">{emoji}</div>
              <h3 className="font-semibold text-lg">{title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* BEAUTY TIPS */}
      <section
        id="beauty-tips"
        className="max-w-6xl mx-auto px-6 py-14"
      >
        <div className="mb-10">
          <p className="text-[#b76e79] font-medium">
            Small habits, big glow
          </p>

          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">
            Daily Habits for a Healthy Glow 💖
          </h2>

          <p className="mt-3 text-[#765767] max-w-2xl">
            Simple habits you can add to your everyday routine to take better
            care of yourself.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beautyTips.map((tip) => (
            <div
              key={tip.title}
              className="bg-white rounded-3xl p-6 border border-[#f1dce1] shadow-sm hover:shadow-lg transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fbe8eb] flex items-center justify-center text-3xl mb-5">
                {tip.emoji}
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {tip.title}
              </h3>

              <p className="text-[#765767] leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="bg-[#f9edef] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-[#b76e79] font-medium">
              Watch & Learn
            </p>

            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">
              Beauty Videos 🎥
            </h2>

            <p className="mt-3 text-[#765767]">
              Discover skincare and beauty routines through helpful videos.
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-5 snap-x">
            {beautyVideos.map((video) => (
              <div
                key={video.title}
                className="min-w-[280px] md:min-w-[340px] bg-white rounded-3xl overflow-hidden shadow-sm border border-[#efd9df] snap-start"
              >
                <div className="aspect-video">
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg">
                    {video.title}
                  </h3>

                  <p className="text-sm text-[#876778] mt-2">
                    Beauty & skincare inspiration ✨
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELF CARE */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-[#6f304d] text-white rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-[#f3c9d1] uppercase tracking-widest text-sm mb-3">
              Remember
            </p>

            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Beauty starts with self-love. 💗
            </h2>

            <p className="text-[#f7dfe3] max-w-xl leading-relaxed">
              Take care of your skin, your body and your mind. Your beauty
              routine should be something that makes you feel confident,
              comfortable and happy.
            </p>
          </div>

          <div className="text-7xl">
            🌸
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 text-sm text-[#876778]">
        <p>
          Made with 💗 for every woman — Femora
        </p>
      </footer>
    </div>
  );
}

export default Beauty;