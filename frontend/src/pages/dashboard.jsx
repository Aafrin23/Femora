import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeaturesNavbar from "../components/featuresnavbar";

import API from "../api/User.js";

import { getGoals } from "../api/goalapi.js";
import { getJournals } from "../api/journalapi.js";
import { getCommunityPosts } from "../api/communityapi";
import { getInspirations } from "../api/inspiration.js";
import { getLearningPosts } from "../api/learning.js";

function Dashboard() {
  const navigate = useNavigate();

  // ============================================================
  // USER
  // ============================================================

  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // ============================================================
  // DATE
  // ============================================================

  const [currentDate, setCurrentDate] = useState(new Date());

  const days = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);

      let label = "";

      if (index === 0) {
        label = "Today";
      } else if (index === 1) {
        label = "Tomorrow";
      }

      return {
        dateObject: date,
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        date: date.getDate(),
        label,
        fullDate: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };
    });
  }, [currentDate]);

  const [selectedDay, setSelectedDay] = useState("Today");

  // ============================================================
  // WELLNESS
  // ============================================================

  const [wellness, setWellness] = useState({
    score: 0,

    categoryScores: {
      mental: 0,
      physical: 0,
      emotional: 0,
      spiritual: 0,
      social: 0,
    },

    completedHabits: {
      mental: [],
      physical: [],
      emotional: [],
      spiritual: [],
      social: [],
    },
  });

  const [loadingWellness, setLoadingWellness] = useState(true);

  // ============================================================
  // GOALS
  // ============================================================

  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);

  // ============================================================
  // JOURNALS
  // ============================================================

  const [journals, setJournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(true);

  // ============================================================
  // PLANNER
  // ============================================================

  const [planners, setPlanners] = useState([]);
  const [loadingPlanners, setLoadingPlanners] = useState(true);

  // ============================================================
  // COMMUNITY / LEARNING / INSPIRATION
  // ============================================================

  const [communityPosts, setCommunityPosts] = useState([]);
  const [learningPosts, setLearningPosts] = useState([]);
  const [inspirationPosts, setInspirationPosts] = useState([]);

  const [loadingCommunity, setLoadingCommunity] = useState(true);

  // ============================================================
  // NOTES
  // ============================================================

  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");

  // ============================================================
  // LOAD NOTES FROM LOCAL STORAGE
  // ============================================================

  useEffect(() => {
    const savedNotes = localStorage.getItem("femoraDashboardNotes");

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error("Failed to load dashboard notes:", error);
        setNotes([]);
      }
    }
  }, []);

  // ============================================================
  // KEEP DATE DYNAMIC
  // ============================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // LOAD WELLNESS
  // ============================================================

  const loadWellnessData = async () => {
    try {
      if (!token) {
        navigate("/");
        return;
      }

      setLoadingWellness(true);

      const response = await API.get("/wellness/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      const categories = data?.categories || {};

      const categoryScores = {
        mental: Math.round(
          ((categories.mental?.completed?.length || 0) / 6) * 100
        ),

        physical: Math.round(
          ((categories.physical?.completed?.length || 0) / 6) * 100
        ),

        emotional: Math.round(
          ((categories.emotional?.completed?.length || 0) / 6) * 100
        ),

        spiritual: Math.round(
          ((categories.spiritual?.completed?.length || 0) / 6) * 100
        ),

        social: Math.round(
          ((categories.social?.completed?.length || 0) / 6) * 100
        ),
      };

      setWellness({
        score: data?.wellnessScore || 0,

        categoryScores,

        completedHabits: {
          mental: categories.mental?.completed || [],
          physical: categories.physical?.completed || [],
          emotional: categories.emotional?.completed || [],
          spiritual: categories.spiritual?.completed || [],
          social: categories.social?.completed || [],
        },
      });
    } catch (error) {
      console.error("Failed to load dashboard wellness:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("age");

        navigate("/");
      }
    } finally {
      setLoadingWellness(false);
    }
  };

  // ============================================================
  // LOAD GOALS
  // ============================================================

  const loadGoals = async () => {
    try {
      setLoadingGoals(true);

      const data = await getGoals();

      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load goals:", error);
      setGoals([]);
    } finally {
      setLoadingGoals(false);
    }
  };

  // ============================================================
  // LOAD JOURNALS
  // ============================================================

  const loadJournals = async () => {
    try {
      setLoadingJournals(true);

      const data = await getJournals();

      setJournals(data?.journals || []);
    } catch (error) {
      console.error("Failed to load journals:", error);
      setJournals([]);
    } finally {
      setLoadingJournals(false);
    }
  };

  // ============================================================
  // LOAD PLANNERS
  // ============================================================

  const loadPlanners = async () => {
    try {
      setLoadingPlanners(true);

      const response = await fetch(
        "http://localhost:5000/api/planner",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load planners"
        );
      }

      setPlanners(data?.planners || []);
    } catch (error) {
      console.error("Failed to load planners:", error);
      setPlanners([]);
    } finally {
      setLoadingPlanners(false);
    }
  };

  // ============================================================
  // LOAD COMMUNITY
  // ============================================================

  const loadCommunityPosts = async () => {
    try {
      setLoadingCommunity(true);

      const data = await getCommunityPosts();

      setCommunityPosts(data?.posts || []);
    } catch (error) {
      console.error("Failed to load community posts:", error);
      setCommunityPosts([]);
    } finally {
      setLoadingCommunity(false);
    }
  };

  // ============================================================
  // LOAD INSPIRATION
  // ============================================================

  const loadInspirationPosts = async () => {
    try {
      const data = await getInspirations("All", "");

      setInspirationPosts(data?.inspirations || []);
    } catch (error) {
      console.error(
        "Failed to load inspiration posts:",
        error
      );

      setInspirationPosts([]);
    }
  };

  // ============================================================
  // LOAD LEARNING HUB
  // ============================================================

  const loadLearningPosts = async () => {
    try {
      const data = await getLearningPosts();

      /*
        getLearningPosts() directly returns the API response.

        Supporting both:
        1. Array response
        2. { posts: [] } response
      */

      if (Array.isArray(data)) {
        setLearningPosts(data);
      } else {
        setLearningPosts(data?.posts || []);
      }
    } catch (error) {
      console.error(
        "Failed to load learning posts:",
        error
      );

      setLearningPosts([]);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadWellnessData();
    loadGoals();
    loadJournals();
    loadPlanners();
    loadCommunityPosts();
    loadLearningPosts();
    loadInspirationPosts();
  }, []);

  // ============================================================
  // REFRESH WHEN USER RETURNS TO DASHBOARD
  // ============================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadWellnessData();
        loadGoals();
        loadJournals();
        loadPlanners();
        loadCommunityPosts();
        loadLearningPosts();
        loadInspirationPosts();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("age");
    localStorage.removeItem("userId");

    navigate("/");
  };

  // ============================================================
  // WELLNESS CALCULATIONS
  // ============================================================

  const activitiesCompleted = Object.values(
    wellness.completedHabits || {}
  )
    .flat()
    .length;

  const wellnessData = {
    score: wellness.score,
    activitiesCompleted,
  };

  const getWellnessMessage = () => {
    if (wellnessData.score >= 80) {
      return "You're doing amazing ✨";
    }

    if (wellnessData.score >= 60) {
      return "You're doing beautifully 💕";
    }

    if (wellnessData.score > 0) {
      return "Keep taking small steps 🌷";
    }

    return "Start your wellness journey 🌸";
  };

  // ============================================================
  // GOAL DATA
  // ============================================================

  const activeGoals = goals.filter(
    (goal) => !goal.completed
  );

  const completedGoals = goals.filter(
    (goal) => goal.completed
  );

  const dashboardGoals = goals.slice(0, 3);

  // ============================================================
  // JOURNAL DATA
  // ============================================================

  const latestJournal = journals.length
    ? [...journals].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )[0]
    : null;

  const journalStreak = useMemo(() => {
    if (!journals.length) return 0;

    const uniqueDates = [
      ...new Set(
        journals.map((journal) =>
          new Date(
            journal.createdAt
          ).toLocaleDateString("en-CA")
        )
      ),
    ];

    const sortedDates = uniqueDates
      .map((date) => new Date(date))
      .sort((a, b) => b - a);

    let count = 0;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);

      expectedDate.setDate(
        today.getDate() - i
      );

      if (
        sortedDates[i].toDateString() ===
        expectedDate.toDateString()
      ) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }, [journals]);

  // ============================================================
  // PLANNER DATA
  // ============================================================

  const dashboardPlanners = planners.slice(0, 3);

  // ============================================================
  // COMMUNITY / LEARNING / INSPIRATION FEED
  // ============================================================

  const activityFeed = useMemo(() => {
    const community = communityPosts.map(
      (post) => ({
        id: `community-${post._id}`,
        source: "Community",
        icon: "👩‍🤝‍👩",
        title:
          post.title ||
          "New community post",
        content:
          post.content ||
          "Someone shared something in the community.",
        author:
          post.author?.name ||
          post.authorName ||
          "Femora member",
        createdAt: post.createdAt,
        path: "/community",
      })
    );

    const learning = learningPosts.map(
      (post) => ({
        id: `learning-${post._id}`,
        source: "Learning Hub",
        icon: "📚",
        title:
          post.title ||
          "New learning insight",
        content:
          post.content ||
          "Someone shared something they learned.",
        author:
          post.authorName ||
          post.author?.name ||
          "Femora learner",
        createdAt: post.createdAt,
        path: "/learninghub",
      })
    );

    const inspiration = inspirationPosts.map(
      (post) => ({
        id: `inspiration-${post._id}`,
        source: "Inspiration Hub",
        icon: "✨",
        title:
          post.title ||
          "New inspiration",
        content:
          post.description ||
          post.content ||
          "Someone shared an inspiring achievement.",
        author:
          post.user?.name ||
          post.author?.name ||
          post.authorName ||
          "Femora member",
        createdAt: post.createdAt,
        path: "/inspirationhub",
      })
    );

    return [
      ...community,
      ...learning,
      ...inspiration,
    ]
      .filter((item) => item.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 6);
  }, [
    communityPosts,
    learningPosts,
    inspirationPosts,
  ]);

  // ============================================================
  // RELATIVE DATE
  // ============================================================

  const formatRelativeDate = (date) => {
    if (!date) return "";

    const created = new Date(date);
    const now = new Date();

    const difference = Math.floor(
      (now - created) / 1000
    );

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 60 * 60) {
      return `${Math.floor(
        difference / 60
      )}m ago`;
    }

    if (difference < 60 * 60 * 24) {
      return `${Math.floor(
        difference / (60 * 60)
      )}h ago`;
    }

    if (difference < 60 * 60 * 24 * 7) {
      return `${Math.floor(
        difference / (60 * 60 * 24)
      )}d ago`;
    }

    return created.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  };

  // ============================================================
  // NOTES
  // ============================================================

  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes);

    localStorage.setItem(
      "femoraDashboardNotes",
      JSON.stringify(updatedNotes)
    );
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    const newNote = {
      id: Date.now(),
      text: noteText.trim(),
      createdAt: new Date().toISOString(),
    };

    saveNotes([newNote, ...notes]);

    setNoteText("");
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(
      (note) => note.id !== id
    );

    saveNotes(updatedNotes);
  };

  // ============================================================
  // FEATURES
  // ============================================================

  const features = [
    {
      icon: "🌿",
      title: "Wellness",
      path: "/wellness",
    },
    {
      icon: "📖",
      title: "Journal",
      path: "/journal",
    },
    {
      icon: "🗓️",
      title: "Planner",
      path: "/planner",
    },
    {
      icon: "🎯",
      title: "Goals",
      path: "/goals",
    },
    {
      icon: "🌸",
      title: "Women's Health",
      path: "/hormonalhealth",
    },
    {
      icon: "📚",
      title: "Learning Hub",
      path: "/learninghub",
    },
    {
      icon: "✨",
      title: "Inspiration",
      path: "/inspirationhub",
    },
    {
      icon: "👩‍🤝‍👩",
      title: "Community",
      path: "/community",
    },
  ];

  // ============================================================
  // LOADING
  // ============================================================

  if (loadingWellness) {
    return (
      <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838]">
        <FeaturesNavbar />

        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="text-5xl mb-4">
              🌸
            </div>

            <p className="font-semibold">
              Loading your dashboard...
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Getting everything ready for you
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838]">

      <FeaturesNavbar />

      <main className="max-w-[1400px] mx-auto px-5 md:px-8 py-7">

        {/* =====================================================
            TOP HEADER
        ====================================================== */}

        <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">

          <div>

            <p className="text-sm text-[#B76E79] font-medium mb-2">
              Femora ✨
            </p>

            <h1 className="text-3xl md:text-4xl font-bold ruge-boogie-regular">
              Hello, {name || "there"} 🌸
            </h1>

            <p className="text-gray-500 mt-2">
              Let's take care of you today.
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-[#B76E79] font-medium">
              Today
            </p>

            <p className="text-lg font-semibold">
              {currentDate.toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </p>

          </div>

        </section>

        {/* =====================================================
            DYNAMIC DATE SELECTOR
        ====================================================== */}

        <div className="bg-white rounded-2xl p-2 border border-[#F2E2E6] shadow-sm mb-7 overflow-x-auto">

          <div className="flex gap-2 min-w-max">

            {days.map((item) => (
              <button
                key={item.dateObject.toISOString()}
                onClick={() =>
                  setSelectedDay(
                    item.label ||
                      item.dateObject.toISOString()
                  )
                }
                className={`min-w-[100px] rounded-xl px-4 py-3 transition-all ${
                  selectedDay ===
                  (item.label ||
                    item.dateObject.toISOString())
                    ? "bg-[#4A1838] text-white shadow-md"
                    : "hover:bg-[#FFF1F3] text-gray-600"
                }`}
              >

                <p className="text-xs opacity-70">
                  {item.day}
                </p>

                <p className="text-lg font-semibold">
                  {item.date}
                </p>

                {item.label && (
                  <p className="text-[10px] mt-0.5">
                    {item.label}
                  </p>
                )}

              </button>
            ))}

          </div>

        </div>

        {/* =====================================================
            WHAT'S HAPPENING + RIGHT SIDE
        ====================================================== */}

        <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6 mb-6">

          {/* =================================================
              WHAT'S HAPPENING
          ================================================== */}

          <div className="bg-white rounded-[2rem] p-7 border border-[#F2E2E6] shadow-sm">

            <div className="flex items-start justify-between mb-6">

              <div>

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-2xl bg-[#F8E6ED] flex items-center justify-center text-xl">
                    🔔
                  </div>

                  <div>

                    <h2 className="text-2xl font-semibold">
                      What's happening ✨
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      See what the Femora community is sharing
                    </p>

                  </div>

                </div>

              </div>

              <button
                onClick={() =>
                  navigate("/community")
                }
                className="text-sm text-[#B76E79] font-medium hover:underline"
              >
                Explore →
              </button>

            </div>

            {loadingCommunity ? (

              <div className="py-10 text-center text-sm text-gray-400">
                Checking for new updates...
              </div>

            ) : activityFeed.length === 0 ? (

              <div className="bg-[#FFF9F7] rounded-2xl p-8 text-center">

                <div className="text-4xl mb-3">
                  🌷
                </div>

                <p className="font-medium">
                  No new updates yet
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Be the first to share something!
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {activityFeed
                  .slice(0, 3)
                  .map((item) => (

                    <button
                      key={item.id}
                      onClick={() =>
                        navigate(item.path)
                      }
                      className="w-full text-left flex items-center gap-4 bg-[#FFF9F7] hover:bg-[#FFF1F4] rounded-2xl p-4 transition group"
                    >

                      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                        {item.icon}
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2">

                          <span className="text-[10px] uppercase tracking-wide font-semibold text-[#B76E79]">
                            {item.source}
                          </span>

                          <span className="text-[10px] text-gray-400">
                            •
                          </span>

                          <span className="text-[10px] text-gray-400">
                            {formatRelativeDate(
                              item.createdAt
                            )}
                          </span>

                        </div>

                        <p className="font-semibold text-sm mt-1 truncate">
                          {item.title}
                        </p>

                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {item.author} shared something new
                        </p>

                      </div>

                      <span className="text-[#B76E79] opacity-60 group-hover:opacity-100 transition">
                        →
                      </span>

                    </button>

                  ))}

              </div>

            )}

            {/* =================================================
                ALWAYS VISIBLE HUB LINKS
            ================================================== */}

            <div className="grid grid-cols-3 gap-2 mt-5">

              <button
                onClick={() =>
                  navigate("/community")
                }
                className="rounded-xl bg-[#F8E9EE] p-3 text-xs font-medium hover:bg-[#F3DDE5]"
              >
                👥 Community
              </button>

              <button
                onClick={() =>
                  navigate("/learninghub")
                }
                className="rounded-xl bg-[#F8E9EE] p-3 text-xs font-medium hover:bg-[#F3DDE5]"
              >
                📚 Learning Hub
              </button>

              <button
                onClick={() =>
                  navigate("/inspirationhub")
                }
                className="rounded-xl bg-[#F8E9EE] p-3 text-xs font-medium hover:bg-[#F3DDE5]"
              >
                ✨ Inspiration Hub
              </button>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="grid grid-cols-2 gap-4">

            {/* WELLNESS SCORE */}

            <div className="bg-white rounded-3xl p-5 border border-[#F2E2E6] shadow-sm">

              <div className="flex justify-between items-center">

                <span className="text-2xl">
                  🌸
                </span>

                <span className="text-xs text-[#B76E79]">
                  Today
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-5">
                Wellness Score
              </p>

              <div className="flex items-end gap-1 mt-1">

                <span className="text-4xl font-bold">
                  {wellnessData.score}
                </span>

                <span className="text-sm text-gray-400 mb-1">
                  /100
                </span>

              </div>

              <p className="text-xs text-[#B76E79] mt-2">
                {getWellnessMessage()}
              </p>

            </div>

            {/* DAILY PROGRESS */}

            <div className="bg-white rounded-3xl p-5 border border-[#F2E2E6] shadow-sm">

              <div className="flex justify-between">

                <span className="text-2xl">
                  🌷
                </span>

                <span className="text-xs text-gray-400">
                  Today
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-5">
                Daily Progress
              </p>

              <p className="text-3xl font-bold mt-1">
                {activitiesCompleted}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                wellness habits completed
              </p>

              <div className="h-2 bg-[#F3E5E8] rounded-full mt-3 overflow-hidden">

                <div
                  className="h-full bg-[#B76E79] rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      activitiesCompleted * 10,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* TODAY'S WELLNESS */}

            <div className="col-span-2 bg-white rounded-3xl p-6 border border-[#F2E2E6] shadow-sm">

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h2 className="font-semibold text-lg">
                    Today's Wellness
                  </h2>

                  <p className="text-xs text-gray-400">
                    Your overall progress
                  </p>

                </div>

                <button
                  onClick={() =>
                    navigate("/wellness")
                  }
                  className="text-xs text-[#B76E79] hover:underline"
                >
                  View details →
                </button>

              </div>

              <div className="flex flex-col sm:flex-row items-center gap-7">

                {/* CIRCLE */}

                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `conic-gradient(
                      #B76E79 ${wellnessData.score}%,
                      #F3E6E9 ${wellnessData.score}% 100%
                    )`,
                  }}
                >

                  <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">

                    <span className="text-2xl font-bold">
                      {wellnessData.score}
                    </span>

                    <span className="text-[10px] text-gray-400">
                      wellness
                    </span>

                  </div>

                </div>

                {/* STATS */}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-7 gap-y-4 flex-1 w-full">

                  <div>
                    <p className="text-xs text-gray-400">
                      Mental
                    </p>

                    <p className="font-semibold mt-1">
                      {wellness.categoryScores.mental}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Physical
                    </p>

                    <p className="font-semibold mt-1">
                      {wellness.categoryScores.physical}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Emotional
                    </p>

                    <p className="font-semibold mt-1">
                      {wellness.categoryScores.emotional}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Spiritual
                    </p>

                    <p className="font-semibold mt-1">
                      {wellness.categoryScores.spiritual}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Social
                    </p>

                    <p className="font-semibold mt-1">
                      {wellness.categoryScores.social}%
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            TODAY'S NOTES + GOALS
        ====================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 mb-8">

          {/* TODAY'S NOTES */}

          <div className="bg-white rounded-3xl p-6 border border-[#F2E2E6] shadow-sm">

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-xl font-semibold">
                  Today's Notes 📝
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Quickly write down anything you want to remember
                </p>

              </div>

            </div>

            <div className="flex gap-2 mb-5">

              <input
                type="text"
                value={noteText}
                onChange={(e) =>
                  setNoteText(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddNote();
                  }
                }}
                placeholder="Write a quick note..."
                className="flex-1 bg-[#FFF9F7] border border-[#F0DFE5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#B76E79]"
              />

              <button
                onClick={handleAddNote}
                className="px-5 rounded-xl bg-[#4A1838] text-white text-sm font-medium hover:opacity-90"
              >
                Add
              </button>

            </div>

            {notes.length === 0 ? (

              <div className="bg-[#FFF9F7] rounded-2xl p-7 text-center">

                <div className="text-3xl mb-2">
                  📝
                </div>

                <p className="text-sm font-medium">
                  No notes yet
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Add something you want to remember today.
                </p>

              </div>

            ) : (

              <div className="space-y-2 max-h-[250px] overflow-y-auto">

                {notes.slice(0, 6).map((note) => (

                  <div
                    key={note.id}
                    className="flex items-center gap-3 bg-[#FFF9F7] rounded-xl p-3"
                  >

                    <span className="text-lg">
                      📌
                    </span>

                    <p className="flex-1 text-sm">
                      {note.text}
                    </p>

                    <button
                      onClick={() =>
                        handleDeleteNote(note.id)
                      }
                      className="text-gray-400 hover:text-red-500 text-sm"
                    >
                      ×
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* GOALS */}

          <div className="bg-white rounded-3xl p-6 border border-[#F2E2E6] shadow-sm">

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-xl font-semibold">
                  Your Goals 🎯
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  {activeGoals.length} active ·{" "}
                  {completedGoals.length} completed
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/goals")
                }
                className="text-sm text-[#B76E79] hover:underline"
              >
                View →
              </button>

            </div>

            {loadingGoals ? (

              <p className="text-sm text-gray-400">
                Loading your goals...
              </p>

            ) : dashboardGoals.length === 0 ? (

              <div className="bg-[#FFF9F7] rounded-2xl p-6 text-center">

                <div className="text-3xl mb-2">
                  🎯
                </div>

                <p className="font-medium">
                  No goals yet
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Create your first goal.
                </p>

                <button
                  onClick={() =>
                    navigate("/goals")
                  }
                  className="mt-4 px-4 py-2 rounded-xl bg-[#4A1838] text-white text-sm"
                >
                  Create Goal
                </button>

              </div>

            ) : (

              <div className="space-y-4">

                {dashboardGoals.map((goal) => {

                  const progress = Math.min(
                    Math.max(
                      Number(goal.progress) || 0,
                      0
                    ),
                    100
                  );

                  return (

                    <div key={goal._id}>

                      <div className="flex items-center gap-3 mb-2">

                        <div className="w-9 h-9 rounded-xl bg-[#FFF1F3] flex items-center justify-center">
                          {goal.type ===
                          "long-term"
                            ? "🌱"
                            : "🎯"}
                        </div>

                        <div className="flex-1">

                          <div className="flex justify-between gap-3">

                            <p className="text-sm font-medium line-clamp-1">
                              {goal.title}
                            </p>

                            <span className="text-xs font-semibold text-[#B76E79]">
                              {progress}%
                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="h-2 bg-[#F2E5E8] rounded-full overflow-hidden">

                        <div
                          className="h-full bg-[#B76E79] rounded-full transition-all"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>

                  );
                })}

              </div>

            )}

            <div className="mt-5 bg-[#FFF1F3] rounded-2xl p-3 text-center">

              <p className="text-xs font-medium">
                Small progress is still progress 💕
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            JOURNAL + PLANNER
        ====================================================== */}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* JOURNAL */}

          <button
            onClick={() =>
              navigate("/journal")
            }
            className="text-left bg-white rounded-3xl p-6 border border-[#F2E2E6] shadow-sm hover:shadow-md transition"
          >

            <div className="flex justify-between">

              <div className="flex gap-3">

                <span className="text-2xl">
                  📖
                </span>

                <div>

                  <h2 className="font-semibold">
                    Today's Journal
                  </h2>

                  <p className="text-xs text-gray-400">
                    Your latest reflection
                  </p>

                </div>

              </div>

              <span className="text-[#B76E79]">
                →
              </span>

            </div>

            {loadingJournals ? (

              <div className="mt-5 bg-[#FFF9F7] rounded-2xl p-5">
                <p className="text-sm text-gray-400">
                  Loading your journal...
                </p>
              </div>

            ) : latestJournal ? (

              <div className="mt-5 bg-[#FFF9F7] rounded-2xl p-5">

                <div className="flex items-center justify-between gap-3">

                  <p className="text-xs text-[#B76E79] font-medium">
                    {latestJournal.title ||
                      "Today's Thoughts"}
                  </p>

                  <span className="text-lg">
                    {latestJournal.mood ===
                    "Happy"
                      ? "😊"
                      : latestJournal.mood ===
                        "Loved"
                      ? "🥰"
                      : latestJournal.mood ===
                        "Sad"
                      ? "😔"
                      : latestJournal.mood ===
                        "Stressed"
                      ? "😣"
                      : latestJournal.mood ===
                        "Angry"
                      ? "😤"
                      : latestJournal.mood ===
                        "Grateful"
                      ? "🙏"
                      : latestJournal.mood ===
                        "Tired"
                      ? "😴"
                      : "😌"}
                  </span>

                </div>

                <p className="text-sm italic text-gray-600 leading-relaxed mt-3 line-clamp-4">
                  "{latestJournal.content}"
                </p>

                <div className="flex items-center gap-2 mt-4">

                  <span>
                    🔥
                  </span>

                  <span className="text-xs font-medium">
                    {journalStreak} day journal streak
                  </span>

                </div>

              </div>

            ) : (

              <div className="mt-5 bg-[#FFF9F7] rounded-2xl p-5 text-center">

                <div className="text-3xl mb-2">
                  📖
                </div>

                <p className="text-sm font-medium">
                  Your journal is waiting
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Write your first entry today.
                </p>

              </div>

            )}

          </button>

          {/* PLANNER */}

          <button
            onClick={() =>
              navigate("/planner")
            }
            className="text-left bg-white rounded-3xl p-6 border border-[#F2E2E6] shadow-sm hover:shadow-md transition"
          >

            <div className="flex justify-between">

              <div className="flex gap-3">

                <span className="text-2xl">
                  🗓️
                </span>

                <div>

                  <h2 className="font-semibold">
                    My Planner
                  </h2>

                  <p className="text-xs text-gray-400">
                    Your saved plans
                  </p>

                </div>

              </div>

              <span className="text-[#B76E79]">
                →
              </span>

            </div>

            {loadingPlanners ? (

              <div className="mt-5 bg-[#FFF9F7] rounded-2xl p-5">

                <p className="text-sm text-gray-400">
                  Loading your planner...
                </p>

              </div>

            ) : dashboardPlanners.length === 0 ? (

              <div className="mt-5 bg-[#FFF9F7] rounded-2xl p-5 text-center">

                <div className="text-3xl mb-2">
                  🗓️
                </div>

                <p className="text-sm font-medium">
                  No plans yet
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Create a planner to organize your days.
                </p>

              </div>

            ) : (

              <div className="mt-5 space-y-2">

                {dashboardPlanners.map(
                  (planner) => (

                    <div
                      key={planner._id}
                      className="flex items-center gap-3 bg-[#FFF9F7] rounded-xl p-3"
                    >

                      <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                        {planner.type ===
                        "Trip"
                          ? "✈️"
                          : planner.type ===
                            "Study"
                          ? "📚"
                          : planner.type ===
                            "Work"
                          ? "💼"
                          : planner.type ===
                            "Fitness"
                          ? "🏃‍♀️"
                          : planner.type ===
                            "Event"
                          ? "🎉"
                          : "🌸"}
                      </span>

                      <div className="flex-1 min-w-0">

                        <p className="text-sm font-medium truncate">
                          {planner.title}
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">

                          {planner.startDate
                            ? new Date(
                                planner.startDate
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "No date"}

                          {planner.location
                            ? ` · ${planner.location}`
                            : ""}

                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </button>

        </section>

        {/* =====================================================
            EXPLORE FEMORA
        ====================================================== */}

        <section className="pb-10">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl font-semibold">
                Explore Femora ✨
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Everything you need to level up your life.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

            {features.map((feature) => (

              <button
                key={feature.title}
                onClick={() =>
                  navigate(feature.path)
                }
                className="bg-white rounded-2xl p-4 border border-[#F2E2E6] hover:shadow-md hover:-translate-y-1 transition-all text-left"
              >

                <span className="text-2xl">
                  {feature.icon}
                </span>

                <p className="font-medium text-sm mt-3">
                  {feature.title}
                </p>

              </button>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;