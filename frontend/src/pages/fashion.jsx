import React from "react";
import Navbar from "../components/Navbar";
import Card from "../components/card.jsx";
import { useNavigate } from "react-router-dom";
import Button from "../components/button.jsx";
import FeaturesNavbar from "../components/featuresnavbar.jsx";
import { useState } from "react";


function Fashion() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inspiration");

  const fashionCategories = [
    {
      icon: "👗",
      title: "Everyday Style",
      description:
        "Simple and comfortable outfit ideas for your everyday life.",
    },
    {
      icon: "💼",
      title: "Workwear",
      description:
        "Elegant and confident looks for work, meetings and professional occasions.",
    },
    {
      icon: "🌙",
      title: "Party Looks",
      description:
        "Dress up and discover ideas for dinners, parties and special occasions.",
    },
    {
      icon: "🌸",
      title: "Casual Looks",
      description:
        "Relaxed outfits that keep you comfortable while looking stylish.",
    },
    {
      icon: "👠",
      title: "Occasion Wear",
      description:
        "Find outfit inspiration for weddings, celebrations and special events.",
    },
    {
      icon: "👜",
      title: "Accessories",
      description:
        "Complete your outfit with bags, jewellery, shoes and other accessories.",
    },
  ];

  const colorIdeas = [
    {
      colors: ["🤍", "🖤"],
      title: "Classic",
      description: "Black & White",
    },
    {
      colors: ["🌸", "🤍"],
      title: "Soft Feminine",
      description: "Blush & White",
    },
    {
      colors: ["🍷", "🖤"],
      title: "Elegant",
      description: "Burgundy & Black",
    },
    {
      colors: ["🌿", "🤎"],
      title: "Earthy",
      description: "Olive & Brown",
    },
  ];

  const styleTips = [
    {
      icon: "✨",
      title: "Know Your Basics",
      text: "Build your wardrobe around versatile pieces that can be styled in different ways.",
    },
    {
      icon: "🎨",
      title: "Play With Colors",
      text: "Try combining neutral colors with one statement shade.",
    },
    {
      icon: "👜",
      title: "Accessorize",
      text: "A simple outfit can feel completely different with the right accessories.",
    },
    {
      icon: "👠",
      title: "Dress For Yourself",
      text: "The best style is one that makes you feel confident and comfortable.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#4A1838]">

         <FeaturesNavbar /> 

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-[#B76E79] hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-8">

        <div className="rounded-3xl bg-gradient-to-r from-[#FFF0F3] to-[#F8EDF3]
                        p-8 md:p-12">

          <p className="text-[#B76E79] text-sm font-semibold tracking-wider">
            STYLE • CONFIDENCE • YOU
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-3 ruge-boogie-regular">
            Fashion 👗
          </h1>

          <p className="text-gray-500 max-w-2xl mt-4 text-lg">
            Discover your personal style, experiment with new looks
            and dress in a way that makes you feel confident. ✨
          </p>

        </div>

      </section>

      {/* Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-6 mt-8">

        <div className="bg-white rounded-2xl p-2 shadow-sm flex flex-wrap gap-2">

          {[
            ["inspiration", "✨ Inspiration"],
            ["categories", "👗 Outfits"],
            ["colors", "🎨 Colors"],
            ["tips", "💡 Style Tips"],
          ].map(([value, label]) => (

            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`px-5 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === value
                  ? "bg-[#B76E79] text-white"
                  : "text-gray-500 hover:bg-[#FFF1F3]"
              }`}
            >
              {label}
            </button>

          ))}

        </div>

      </section>

      {/* ================= INSPIRATION ================= */}
      {activeTab === "inspiration" && (

        <main className="max-w-7xl mx-auto px-6 py-10">

          <div className="mb-7">

            <h2 className="text-2xl font-semibold">
              Find Your Style ✨
            </h2>

            <p className="text-gray-400 mt-2">
              Fashion is not about following every trend. It's about
              finding what feels like you.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {fashionCategories.map((category) => (

              <button
                key={category.title}
                onClick={() => setActiveTab("categories")}
                className="bg-white rounded-2xl p-6 text-left
                           border border-[#F4E4E7]
                           shadow-sm hover:shadow-lg
                           hover:-translate-y-1
                           transition-all duration-300"
              >

                <div className="w-14 h-14 rounded-2xl bg-[#FFF1F3]
                                flex items-center justify-center text-3xl">
                  {category.icon}
                </div>

                <h3 className="text-lg font-semibold mt-5">
                  {category.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-6">
                  {category.description}
                </p>

                <span className="inline-block mt-5 text-sm
                                 font-medium text-[#B76E79]">
                  Explore →
                </span>

              </button>

            ))}

          </div>

          {/* Style Quote */}
          <div className="mt-10 bg-[#FFF1F3] rounded-3xl p-8 text-center">

            <p className="text-2xl md:text-3xl font-semibold
                          ruge-boogie-regular">
              "Your style is your story. Wear it your way." ✨
            </p>

            <p className="text-sm text-gray-400 mt-3">
              There are no rules — just possibilities.
            </p>

          </div>

        </main>
      )}

      {/* ================= OUTFITS ================= */}
      {activeTab === "categories" && (

        <main className="max-w-7xl mx-auto px-6 py-10">

          <h2 className="text-2xl font-semibold">
            Outfit Inspiration 👗
          </h2>

          <p className="text-gray-400 mt-2 mb-7">
            Choose an occasion and discover styling ideas.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {[
              {
                icon: "☀️",
                title: "Everyday",
                text: "Easy outfits for your daily routine.",
              },
              {
                icon: "💼",
                title: "Office",
                text: "Polished looks for work and meetings.",
              },
              {
                icon: "☕",
                title: "Brunch",
                text: "Cute and effortless weekend looks.",
              },
              {
                icon: "🌙",
                title: "Date Night",
                text: "Elegant looks for an evening out.",
              },
              {
                icon: "🎉",
                title: "Party",
                text: "Fun looks for celebrations.",
              },
              {
                icon: "💍",
                title: "Wedding",
                text: "Beautiful ideas for special occasions.",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 shadow-sm
                           hover:shadow-lg transition-all"
              >

                <div className="text-3xl">
                  {item.icon}
                </div>

                <h3 className="font-semibold text-lg mt-4">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  {item.text}
                </p>

                <button
                  className="mt-5 text-sm text-[#B76E79]
                             font-medium hover:underline"
                >
                  View Ideas →
                </button>

              </div>

            ))}

          </div>

        </main>
      )}

      {/* ================= COLORS ================= */}
      {activeTab === "colors" && (

        <main className="max-w-7xl mx-auto px-6 py-10">

          <h2 className="text-2xl font-semibold">
            Color Combinations 🎨
          </h2>

          <p className="text-gray-400 mt-2 mb-7">
            Experiment with different color combinations to create
            outfits that feel balanced and expressive.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            {colorIdeas.map((idea) => (

              <div
                key={idea.title}
                className="bg-white rounded-2xl p-6 shadow-sm
                           hover:shadow-lg transition-all"
              >

                <div className="flex gap-2 text-4xl">
                  {idea.colors.map((color, index) => (
                    <span key={index}>
                      {color}
                    </span>
                  ))}
                </div>

                <h3 className="font-semibold text-lg mt-5">
                  {idea.title}
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  {idea.description}
                </p>

              </div>

            ))}

          </div>

          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">

            <h3 className="font-semibold">
              🎨 Simple Styling Rule
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              Start with a neutral base, add one main color and
              finish with a small accent through accessories.
            </p>

          </div>

        </main>
      )}

      {/* ================= STYLE TIPS ================= */}
      {activeTab === "tips" && (

        <main className="max-w-7xl mx-auto px-6 py-10">

          <h2 className="text-2xl font-semibold">
            Style Tips 💡
          </h2>

          <p className="text-gray-400 mt-2 mb-7">
            Small changes can make a big difference to your personal style.
          </p>

          <div className="grid md:grid-cols-2 gap-5">

            {styleTips.map((tip) => (

              <div
                key={tip.title}
                className="bg-white rounded-2xl p-6 shadow-sm
                           border border-[#F4E4E7]"
              >

                <div className="text-3xl">
                  {tip.icon}
                </div>

                <h3 className="font-semibold text-lg mt-4">
                  {tip.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2 leading-6">
                  {tip.text}
                </p>

              </div>

            ))}

          </div>

          {/* Fashion Reminder */}
          <div className="mt-8 bg-[#FFF1F3] rounded-2xl p-6">

            <h3 className="font-semibold">
              💗 A little reminder
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              Trends come and go, but your personal style is yours.
              Choose clothes that make you feel comfortable, confident
              and happy.
            </p>

          </div>

        </main>
      )}

    </div>
  );
}

export default Fashion;