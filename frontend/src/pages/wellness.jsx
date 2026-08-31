
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeaturesNavbar from "../components/featuresnavbar.jsx";
import API from "../api/User.js";

function Wellness() {
  const navigate = useNavigate();

  // ============================================================
  // USER DATA
  // ============================================================

  const name = localStorage.getItem("name");

  const age =
    Number(localStorage.getItem("age")) || 20;

  const token = localStorage.getItem("token");

  // ============================================================
  // WELLNESS CATEGORIES
  // ============================================================

  const wellnessCategories = [
    {
      id: "mental",
      title: "Mental Wellness",
      shortTitle: "Mental",
      icon: "🧠",
      image:
        "https://i.pinimg.com/736x/91/87/c8/9187c8c23d8d49d69644305bbc74d870.jpg",

      description:
        "Take care of your thoughts, manage stress, and build a healthier mindset.",

      color:
        "from-[#FBE4EA] to-[#FFF5F7]",

      habits: [
        {
          id: "mental-1",
          text: "Practice gratitude every morning",
        },
        {
          id: "mental-2",
          text: "Meditate for 10 minutes",
        },
        {
          id: "mental-3",
          text: "Journal your thoughts",
        },
        {
          id: "mental-4",
          text: "Take a digital break",
        },
        {
          id: "mental-5",
          text: "Practice deep breathing",
        },
        {
          id: "mental-6",
          text: "Speak kindly to yourself",
        },
      ],

      video:
        "https://www.youtube.com/results?search_query=mental+wellness+meditation",
    },

    {
      id: "physical",
      title: "Physical Wellness",
      shortTitle: "Physical",
      icon: "🏃‍♀️",
      image:
        "https://i.pinimg.com/736x/0c/8b/f4/0c8bf4da3e2a69edc0daa47fb4f9fca1.jpg",

      description:
        "Keep your body strong and energetic through movement, nutrition, hydration and rest.",

      color:
        "from-[#F5E5E8] to-[#FFF7F5]",

      habits: [
        {
          id: "physical-1",
          text: "Exercise for at least 30 minutes",
        },
        {
          id: "physical-2",
          text: "Drink enough water",
        },
        {
          id: "physical-3",
          text: "Eat a nutritious meal",
        },
        {
          id: "physical-4",
          text: "Stretch for 10 minutes",
        },
        {
          id: "physical-5",
          text: "Get 7–9 hours of sleep",
        },
        {
          id: "physical-6",
          text: "Take a short walk",
        },
      ],

      video:
        "https://www.youtube.com/results?search_query=beginner+workout+for+women",
    },

    {
      id: "emotional",
      title: "Emotional Wellness",
      shortTitle: "Emotional",
      icon: "💕",
      image:
        "https://i.pinimg.com/vwebp/1200x/92/f6/d5/92f6d5871925840143fd60c7a8efb574.webp",

      description:
        "Understand your emotions, practice self-care, and create space for how you feel.",

      color:
        "from-[#F8E4EE] to-[#FFF5F8]",

      habits: [
        {
          id: "emotional-1",
          text: "Check in with your mood",
        },
        {
          id: "emotional-2",
          text: "Practice positive self-talk",
        },
        {
          id: "emotional-3",
          text: "Write about your feelings",
        },
        {
          id: "emotional-4",
          text: "Take time for yourself",
        },
        {
          id: "emotional-5",
          text: "Do something that makes you happy",
        },
        {
          id: "emotional-6",
          text: "Give yourself a break",
        },
      ],

      video:
        "https://www.youtube.com/results?search_query=emotional+wellness+self+care",
    },

    {
      id: "spiritual",
      title: "Spiritual Wellness",
      shortTitle: "Spiritual",
      icon: "🌿",
      image:
        "https://i.pinimg.com/vwebp/1200x/35/d4/b8/35d4b8067b908ff52cf023500e48794a.webp",

      description:
        "Find inner peace through mindfulness, gratitude, reflection and connection with yourself.",

      color:
        "from-[#EDE9E0] to-[#FFF9F3]",

      habits: [
        {
          id: "spiritual-1",
          text: "Meditate for 10 minutes",
        },
        {
          id: "spiritual-2",
          text: "Write 3 things you're grateful for",
        },
        {
          id: "spiritual-3",
          text: "Spend quiet time with yourself",
        },
        {
          id: "spiritual-4",
          text: "Practice deep breathing",
        },
        {
          id: "spiritual-5",
          text: "Connect with nature",
        },
        {
          id: "spiritual-6",
          text: "Read something inspiring",
        },
      ],

      video:
        "https://www.youtube.com/results?search_query=guided+meditation+for+beginners",
    },

    {
      id: "social",
      title: "Social Wellness",
      shortTitle: "Social",
      icon: "🤝",
      image:
        "https://i.pinimg.com/1200x/0a/58/e2/0a58e295321268d5a766baeadd2e4011.jpg",

      description:
        "Build meaningful relationships, communicate openly and create a supportive community.",

      color:
        "from-[#F7E5EA] to-[#FFF5F6]",

      habits: [
        {
          id: "social-1",
          text: "Talk with someone you care about",
        },
        {
          id: "social-2",
          text: "Spend quality time with family",
        },
        {
          id: "social-3",
          text: "Practice active listening",
        },
        {
          id: "social-4",
          text: "Do something kind for someone",
        },
        {
          id: "social-5",
          text: "Take part in a social activity",
        },
        {
          id: "social-6",
          text: "Express your feelings honestly",
        },
      ],

      video:
        "https://www.youtube.com/results?search_query=social+wellness+healthy+relationships",
    },
  ];

  // ============================================================
  // STATES
  // ============================================================

  const [activeWellness, setActiveWellness] =
    useState("mental");

  const [wellnessData, setWellnessData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  // ============================================================
  // GET TODAY'S WELLNESS FROM BACKEND
  // ============================================================

  const fetchWellness = async () => {
    try {
      setLoading(true);

      const response =
        await API.get("/wellness/today", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      setWellnessData(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch wellness:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchWellness();
  }, []);

  // ============================================================
  // COMPLETED HABITS
  // ============================================================

  const completedHabits =
    wellnessData?.categories?.[
      activeWellness
    ]?.completed || [];

  // ============================================================
  // CATEGORY SCORE
  // ============================================================

  const getCategoryProgress = (
    category
  ) => {
    const completed =
      wellnessData?.categories?.[
        category.id
      ]?.completed?.length || 0;

    return Math.round(
      (completed /
        category.habits.length) *
        100
    );
  };

  // ============================================================
  // ACTIVE CATEGORY
  // ============================================================

  const activeCategory =
    wellnessCategories.find(
      (category) =>
        category.id === activeWellness
    );

  const completedCount =
    completedHabits.length;

  const progress =
    activeCategory
      ? Math.round(
          (completedCount /
            activeCategory.habits.length) *
            100
        )
      : 0;

  // ============================================================
  // WELLNESS SCORE
  // ============================================================

  const wellnessScore =
    wellnessData?.wellnessScore || 0;

  // ============================================================
  // HANDLE HABIT
  // ============================================================

  const handleHabitChange = async (
    habitId
  ) => {
    try {
      setUpdating(true);

      const response =
        await API.patch(
          "/wellness/habit",
          {
            category: activeWellness,
            habitId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setWellnessData(
        response.data.wellness
      );
    } catch (error) {
      console.error(
        "Failed to update habit:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update habit"
      );
    } finally {
      setUpdating(false);
    }
  };

  // ============================================================
  // MOTIVATION
  // ============================================================

  const getMotivation = () => {
    if (progress === 100) {
      return "Amazing! You completed everything today. ✨";
    }

    if (progress >= 60) {
      return "You're doing beautifully. Keep going! 💕";
    }

    if (progress > 0) {
      return "Small steps create big changes. 🌷";
    }

    return "Start with one small habit today. You got this! 🌸";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F7]">

        <FeaturesNavbar />

        <div className="flex items-center justify-center min-h-[70vh]">

          <div className="text-center">

            <div className="text-5xl mb-4">
              🌸
            </div>

            <p className="text-[#4A1838] font-semibold">
              Loading your wellness...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7] ">

      <FeaturesNavbar />
      {/* HEADER */}

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-8">

        <div className="text-center">

          <p className="text-sm uppercase tracking-[0.3em] text-[#B76E79] font-semibold">
            Take care of you
          </p>

          <h1 className="mt-3 text-5xl md:text-6xl font-bold text-[#4A1838] font-serif italic">
            Wellness 🌸
          </h1>

          <p className="max-w-2xl mx-auto mt-4 text-gray-600 text-lg leading-8">
            Your wellness journey is personalized
            for you, {name || "there"}.
          </p>

          {/* AGE */}

          <div className="mt-4 inline-flex items-center gap-2 bg-white border border-[#F2E2E6] rounded-full px-4 py-2 shadow-sm">

            <span>✨</span>

            <span className="text-sm text-gray-500">
              Personalized for age {age}
            </span>

          </div>

        </div>

      </section>

      {/* MAIN */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">

          {/* LEFT */}

          <div className="lg:sticky lg:top-24">

            <div className="mb-4">

              <h2 className="text-xl font-bold text-[#4A1838]">
                Explore Wellness
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Choose an area to focus on
              </p>

            </div>

            <div className="space-y-3">

              {wellnessCategories.map(
                (category) => {

                  const isActive =
                    activeWellness ===
                    category.id;

                  const categoryProgress =
                    getCategoryProgress(
                      category
                    );

                  return (

                    <button
                      key={category.id}
                      onClick={() =>
                        setActiveWellness(
                          category.id
                        )
                      }
                      className={`
                        group relative w-full overflow-hidden
                        rounded-2xl text-left
                        transition-all duration-500
                        ${
                          isActive
                            ? "h-28 shadow-xl scale-[1.03]"
                            : "h-20 shadow-sm hover:shadow-lg hover:scale-[1.02]"
                        }
                      `}
                    >

                      <img
                        src={category.image}
                        alt={category.title}
                        className={`
                          absolute inset-0 w-full h-full object-cover
                          transition-transform duration-700
                          ${
                            isActive
                              ? "scale-110"
                              : "group-hover:scale-105"
                          }
                        `}
                      />

                      <div className="absolute inset-0 bg-gradient-to-r from-[#4A1838]/90 via-[#4A1838]/55 to-black/20" />

                      <div className="relative z-10 h-full flex items-center px-5">

                        <div
                          className={`
                            flex items-center justify-center rounded-full
                            bg-white/20 backdrop-blur-sm
                            ${
                              isActive
                                ? "w-14 h-14 text-2xl"
                                : "w-11 h-11 text-xl"
                            }
                          `}
                        >
                          {category.icon}
                        </div>

                        <div className="ml-4">

                          <p
                            className={`
                              font-bold text-white
                              ${
                                isActive
                                  ? "text-xl"
                                  : "text-base"
                              }
                            `}
                          >
                            {category.shortTitle}
                          </p>

                          <p className="text-white/70 text-xs mt-1">
                            {categoryProgress}% complete
                          </p>

                        </div>

                        <span
                          className={`
                            ml-auto text-white
                            ${
                              isActive
                                ? "opacity-100"
                                : "opacity-0"
                            }
                          `}
                        >
                          →
                        </span>

                      </div>

                    </button>

                  );
                }
              )}

            </div>

          </div>

          {/* RIGHT */}

          <div>

            {/* HERO */}

            <div
              className={`
                relative overflow-hidden rounded-[2rem]
                bg-gradient-to-br ${activeCategory.color}
                shadow-xl border border-white
                p-8 md:p-10
              `}
            >

              <div className="grid md:grid-cols-[1fr_220px] gap-8 items-center">

                <div>

                  <div className="flex items-center gap-3">

                    <span className="text-4xl">
                      {activeCategory.icon}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-white/70 text-xs font-semibold text-[#B76E79]">
                      WELLNESS
                    </span>

                  </div>

                  <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#4A1838] font-serif">
                    {activeCategory.title}
                  </h2>

                  <p className="mt-4 text-gray-600 leading-7 max-w-xl">
                    {activeCategory.description}
                  </p>

                </div>

                <div>

                  <img
                    src={activeCategory.image}
                    alt={activeCategory.title}
                    className="w-full h-44 object-cover rounded-3xl shadow-lg"
                  />

                </div>

              </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-6 bg-white rounded-3xl shadow-lg p-6">

              <div className="flex justify-between items-center mb-3">

                <div>

                  <h3 className="font-bold text-[#4A1838]">
                    Today's Progress
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {completedCount} of{" "}
                    {activeCategory.habits.length}{" "}
                    habits completed
                  </p>

                </div>

                <div className="text-2xl font-bold text-[#B76E79]">
                  {progress}%
                </div>

              </div>

              <div className="w-full h-3 bg-[#F5E8EB] rounded-full overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-[#B76E79] to-[#8E4059] rounded-full transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              <p className="mt-4 text-sm text-[#B76E79] font-medium">
                {getMotivation()}
              </p>

            </div>

            {/* HABITS */}

            <div className="mt-6 bg-white rounded-3xl shadow-lg p-6 md:p-8">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h3 className="text-2xl font-bold text-[#4A1838]">
                    Today's Habits ✨
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Small actions. Better you.
                  </p>

                </div>

                <div className="hidden sm:flex w-12 h-12 rounded-full bg-[#FFF0F3] items-center justify-center text-xl">
                  🌷
                </div>

              </div>

              <div className="space-y-3">

                {activeCategory.habits.map(
                  (habit) => {

                    const completed =
                      completedHabits.includes(
                        habit.id
                      );

                    return (

                      <label
                        key={habit.id}
                        className={`
                          flex items-center gap-4 p-4 rounded-2xl
                          cursor-pointer border
                          transition-all duration-300
                          ${
                            completed
                              ? "bg-[#FFF0F3] border-[#E7B7C2]"
                              : "bg-[#FCFAFA] border-transparent hover:border-[#E7B7C2]"
                          }
                        `}
                      >

                        <input
                          type="checkbox"
                          checked={completed}
                          disabled={updating}
                          onChange={() =>
                            handleHabitChange(
                              habit.id
                            )
                          }
                          className="checkbox checkbox-primary"
                        />

                        <span
                          className={`
                            text-base md:text-lg
                            ${
                              completed
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }
                          `}
                        >
                          {habit.text}
                        </span>

                        {completed && (

                          <span className="ml-auto text-[#B76E79]">
                            ✓
                          </span>

                        )}

                      </label>

                    );
                  }
                )}

              </div>

            </div>

            {/* OVERALL SCORE */}

            <div className="mt-6 bg-white rounded-3xl shadow-lg p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-widest text-[#B76E79] font-semibold">
                    Today's Wellness
                  </p>

                  <h3 className="text-2xl font-bold text-[#4A1838] mt-1">
                    Wellness Score
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Your progress across all wellness areas.
                  </p>

                </div>

                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(
                      #B76E79 ${wellnessScore}%,
                      #F3E6E9 ${wellnessScore}% 100%
                    )`,
                  }}
                >

                  <div className="w-[68px] h-[68px] rounded-full bg-white flex flex-col items-center justify-center">

                    <span className="text-xl font-bold text-[#4A1838]">
                      {wellnessScore}
                    </span>

                    <span className="text-[9px] text-gray-400">
                      / 100
                    </span>

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">

                {wellnessCategories.map(
                  (category) => (

                    <div
                      key={category.id}
                      className="bg-[#FFF9F7] rounded-2xl p-3 text-center"
                    >

                      <div className="text-xl">
                        {category.icon}
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {category.shortTitle}
                      </p>

                      <p className="font-bold text-[#B76E79] mt-1">
                        {getCategoryProgress(
                          category
                        )}
                        %
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* COMPLETE */}

            {progress === 100 && (

              <div className="mt-6 rounded-3xl bg-gradient-to-r from-[#B76E79] to-[#8E4059] text-white p-8 text-center shadow-xl">

                <div className="text-4xl mb-3">
                  🌸
                </div>

                <h3 className="text-2xl font-bold">
                  You did it!
                </h3>

                <p className="mt-2 text-white/80">
                  You've completed all your{" "}
                  {activeCategory.shortTitle.toLowerCase()}{" "}
                  wellness habits today.
                </p>

              </div>

            )}

            {/* VIDEO */}

            <div className="mt-6 bg-white rounded-3xl shadow-lg p-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="text-xs uppercase tracking-widest text-[#B76E79] font-semibold">
                    Recommended for you
                  </p>

                  <h3 className="text-2xl font-bold text-[#4A1838] mt-1">
                    Continue your wellness journey 🎧
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    Explore guided content for your current wellness focus.
                  </p>

                </div>

                <a
                  href={activeCategory.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-[#B76E79] hover:bg-[#8E4059] border-none text-white rounded-full px-6"
                >
                  Explore Videos ▶
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Wellness;

