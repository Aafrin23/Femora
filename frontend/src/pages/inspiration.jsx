import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Trophy,
  Heart,
  MessageCircle,
  Bookmark,
  Plus,
  Sparkles,
  GraduationCap,
  Briefcase,
  Dumbbell,
  Target,
  Wallet,
  Leaf,
  Search,
  X,
  Image as ImageIcon,
  Trash2,
  Loader2,
} from "lucide-react";

import FeaturesNavbar from "../components/featuresnavbar.jsx";

import {
  getInspirations,
  createInspiration,
  toggleInspire,
  deleteInspiration,
} from "../api/inspiration.js";

function Inspiration() {
  // ============================================================
  // USER
  // ============================================================

  const currentUser =
    localStorage.getItem("name") ||
    "You";

  // ============================================================
  // STATES
  // ============================================================

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [showCreate, setShowCreate] =
    useState(false);

  const [newPost, setNewPost] =
    useState({
      title: "",
      description: "",
      category: "Self Growth",
      image: "",
    });

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories = [
    {
      name: "All",
      icon: Sparkles,
    },

    {
      name: "Education",
      icon: GraduationCap,
    },

    {
      name: "Career",
      icon: Briefcase,
    },

    {
      name: "Fitness",
      icon: Dumbbell,
    },

    {
      name: "Habits",
      icon: Target,
    },

    {
      name: "Finance",
      icon: Wallet,
    },

    {
      name: "Self Growth",
      icon: Leaf,
    },
  ];

  // ============================================================
  // LOAD POSTS
  // ============================================================

  const loadInspirations =
    async () => {
      try {
        setLoading(true);

        const data =
          await getInspirations(
            activeCategory,
            search
          );

        setPosts(
          data.inspirations || []
        );
      } catch (error) {
        console.error(
          "Failed to load inspirations:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          alert(
            "Please login again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // FETCH WHEN FILTER CHANGES
  // ============================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        loadInspirations();
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [
    activeCategory,
    search,
  ]);

  // ============================================================
  // INSPIRE
  // ============================================================

  const handleInspire =
    async (id) => {
      try {
        const data =
          await toggleInspire(id);

        setPosts((previous) =>
          previous.map((post) =>
            post._id === id
              ? {
                  ...post,
                  inspired:
                    data.inspired,
                  inspires:
                    data.inspires,
                }
              : post
          )
        );
      } catch (error) {
        console.error(
          "Failed to inspire:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Something went wrong."
        );
      }
    };

  // ============================================================
  // CREATE POST
  // ============================================================

  const handleCreatePost =
    async (e) => {
      e.preventDefault();

      if (
        !newPost.title.trim() ||
        !newPost.description.trim()
      ) {
        alert(
          "Please fill in your achievement title and story."
        );

        return;
      }

      try {
        setCreating(true);

        const data =
          await createInspiration(
            newPost
          );

        const createdPost =
          {
            ...data.inspiration,
            inspired: false,
            inspires: 0,
          };

        setPosts((previous) => [
          createdPost,
          ...previous,
        ]);

        setNewPost({
          title: "",
          description: "",
          category: "Self Growth",
          image: "",
        });

        setShowCreate(false);
      } catch (error) {
        console.error(
          "Failed to create post:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to share achievement."
        );
      } finally {
        setCreating(false);
      }
    };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this achievement?"
        );

      if (!confirmed) return;

      try {
        await deleteInspiration(id);

        setPosts((previous) =>
          previous.filter(
            (post) =>
              post._id !== id
          )
        );
      } catch (error) {
        console.error(
          "Failed to delete:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to delete achievement."
        );
      }
    };

  // ============================================================
  // FILTERED POSTS
  // ============================================================

  const filteredPosts =
    useMemo(() => {
      return posts;
    }, [posts]);

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    date
  ) => {
    if (!date) return "";

    const created =
      new Date(date);

    const now =
      new Date();

    const difference =
      Math.floor(
        (now - created) /
          1000
      );

    if (difference < 60) {
      return "Just now";
    }

    if (
      difference <
      60 * 60
    ) {
      return `${Math.floor(
        difference / 60
      )}m ago`;
    }

    if (
      difference <
      60 * 60 * 24
    ) {
      return `${Math.floor(
        difference /
          (60 * 60)
      )}h ago`;
    }

    if (
      difference <
      60 * 60 * 24 * 7
    ) {
      return `${Math.floor(
        difference /
          (60 * 60 * 24)
      )}d ago`;
    }

    return created.toLocaleDateString();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838]">

      <FeaturesNavbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="px-6 pt-10 pb-8">

        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-center">

            {/* LEFT */}

            <div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EBD8E1] text-sm font-medium mb-5">

                <Sparkles
                  size={16}
                />

                Celebrate progress

              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">

                Inspiration

                <span className="block">
                  Hub ✨
                </span>

              </h1>

              <p className="mt-5 text-[#76566A] text-lg max-w-xl leading-relaxed">

                Your journey might be
                the motivation someone
                else needs. Share your
                achievements, celebrate
                your progress, and inspire
                women around you.

              </p>

              <button
                onClick={() =>
                  setShowCreate(true)
                }
                className="mt-7 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#4A1838] text-white font-semibold hover:opacity-90 transition"
              >

                <Plus size={20} />

                Share Your Win

              </button>

            </div>

            {/* RIGHT CARD */}

            <div className="bg-white rounded-[30px] p-7 shadow-sm border border-[#F0E2E8]">

              <div className="flex items-center gap-4 mb-6">

                <div className="w-14 h-14 rounded-2xl bg-[#F8E6EE] flex items-center justify-center">

                  <Trophy
                    size={28}
                  />

                </div>

                <div>

                  <h3 className="font-bold text-lg">
                    Every achievement matters
                  </h3>

                  <p className="text-sm text-[#8B6B7D]">
                    Big or small, celebrate it.
                  </p>

                </div>

              </div>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    🎓
                  </span>

                  <span className="text-sm">
                    Completed something you've
                    been working on
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    💪
                  </span>

                  <span className="text-sm">
                    Reached a fitness milestone
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    💼
                  </span>

                  <span className="text-sm">
                    Achieved a career goal
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    🌱
                  </span>

                  <span className="text-sm">
                    Became a better version
                    of yourself
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-6">

        <div className="relative max-w-md">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B7A8B]"
          />

          <input
            type="text"
            placeholder="Search achievements..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#EBD8E1] outline-none focus:ring-2 focus:ring-[#D9A6BA]"
          />

        </div>

        {/* CATEGORIES */}

        <div className="flex gap-3 overflow-x-auto py-6 scrollbar-hide">

          {categories.map(
            (category) => {

              const Icon =
                category.icon;

              return (
                <button
                  key={
                    category.name
                  }
                  onClick={() =>
                    setActiveCategory(
                      category.name
                    )
                  }
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition ${
                    activeCategory ===
                    category.name
                      ? "bg-[#4A1838] text-white"
                      : "bg-white border border-[#EBD8E1] hover:bg-[#FAEEF3]"
                  }`}
                >

                  <Icon
                    size={17}
                  />

                  {
                    category.name
                  }

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* ======================================================
          FEED
      ====================================================== */}

      <main className="max-w-7xl mx-auto px-6 pb-16">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold">
              Latest Inspiration
            </h2>

            <p className="text-[#806275] text-sm mt-1">
              Real people. Real progress.
              Real motivation.
            </p>

          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-[#806275]">

            <Trophy
              size={17}
            />

            {filteredPosts.length}
            {" "}
            achievements

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="flex justify-center py-20">

            <Loader2
              size={40}
              className="animate-spin"
            />

          </div>

        ) : filteredPosts.length ===
          0 ? (

          /* EMPTY */

          <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E2E8]">

            <Trophy
              size={45}
              className="mx-auto mb-4"
            />

            <h3 className="text-xl font-bold">
              No inspiration found
            </h3>

            <p className="text-[#806275] mt-2">
              Be the first to share an
              achievement!
            </p>

            <button
              onClick={() =>
                setShowCreate(true)
              }
              className="mt-5 px-5 py-3 rounded-xl bg-[#4A1838] text-white font-semibold"
            >
              Share Your Win
            </button>

          </div>

        ) : (

          /* POSTS */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredPosts.map(
              (post) => {

                const userName =
                  post.user?.name ||
                  "Femora User";

                const isOwnPost =
                  userName ===
                  currentUser;

                return (
                  <article
                    key={
                      post._id
                    }
                    className="bg-white rounded-[28px] overflow-hidden border border-[#F0E2E8] shadow-sm hover:shadow-md transition"
                  >

                    {/* IMAGE */}

                    {post.image ? (

                      <div className="relative h-56 overflow-hidden">

                        <img
                          src={
                            post.image
                          }
                          alt={
                            post.title
                          }
                          className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        />

                        <div className="absolute top-4 left-4">

                          <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-semibold">

                            {
                              post.category
                            }

                          </span>

                        </div>

                      </div>

                    ) : (

                      <div className="relative h-32 bg-[#F8E6EE] flex items-center justify-center">

                        <Trophy
                          size={42}
                        />

                        <div className="absolute top-4 left-4">

                          <span className="px-3 py-1.5 rounded-full bg-white/90 text-xs font-semibold">

                            {
                              post.category
                            }

                          </span>

                        </div>

                      </div>

                    )}

                    {/* CONTENT */}

                    <div className="p-5">

                      {/* USER */}

                      <div className="flex items-center justify-between mb-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-[#F3DDE7] flex items-center justify-center font-bold">

                            {userName
                              .charAt(
                                0
                              )
                              .toUpperCase()}

                          </div>

                          <div>

                            <p className="font-semibold text-sm">

                              {
                                userName
                              }

                            </p>

                            <p className="text-xs text-[#927386]">

                              {formatDate(
                                post.createdAt
                              )}

                            </p>

                          </div>

                        </div>

                        <Trophy
                          size={19}
                          className="text-[#B16C8D]"
                        />

                      </div>

                      {/* TITLE */}

                      <h3 className="font-bold text-lg leading-snug">

                        {
                          post.title
                        }

                      </h3>

                      {/* DESCRIPTION */}

                      <p className="text-sm text-[#76566A] leading-relaxed mt-3 line-clamp-4">

                        {
                          post.description
                        }

                      </p>

                      {/* ACTIONS */}

                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F2E7EC]">

                        <div className="flex items-center gap-4">

                          {/* INSPIRE */}

                          <button
                            onClick={() =>
                              handleInspire(
                                post._id
                              )
                            }
                            className={`flex items-center gap-1.5 text-sm transition ${
                              post.inspired
                                ? "font-semibold text-[#B04C78]"
                                : "text-[#806275]"
                            }`}
                          >

                            <Heart
                              size={
                                19
                              }
                              fill={
                                post.inspired
                                  ? "currentColor"
                                  : "none"
                              }
                            />

                            Inspire{" "}
                            {post.inspires ||
                              post.inspiredBy
                                ?.length ||
                              0}

                          </button>

                          {/* COMMENTS */}

                          <button
                            className="flex items-center gap-1.5 text-sm text-[#806275]"
                          >

                            <MessageCircle
                              size={
                                18
                              }
                            />

                            0

                          </button>

                        </div>

                        {/* DELETE */}

                        {isOwnPost && (

                          <button
                            onClick={() =>
                              handleDelete(
                                post._id
                              )
                            }
                            className="text-[#A66B83] hover:text-red-600 transition"
                            title="Delete achievement"
                          >

                            <Trash2
                              size={
                                18
                              }
                            />

                          </button>

                        )}

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </main>

      {/* ======================================================
          CREATE MODAL
      ====================================================== */}

      {showCreate && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">

          <div className="bg-white rounded-[30px] w-full max-w-xl max-h-[90vh] overflow-y-auto">

            {/* HEADER */}

            <div className="flex items-center justify-between p-6 border-b border-[#F0E2E8]">

              <div>

                <h2 className="text-2xl font-bold">
                  Share Your Win ✨
                </h2>

                <p className="text-sm text-[#806275] mt-1">
                  Your achievement could inspire someone today.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowCreate(
                    false
                  )
                }
                className="w-10 h-10 rounded-full bg-[#FAEEF3] flex items-center justify-center"
              >

                <X
                  size={20}
                />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleCreatePost
              }
              className="p-6 space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm font-semibold mb-2">

                  What did you
                  achieve?

                </label>

                <input
                  type="text"
                  placeholder="Example: Completed my first certification!"
                  value={
                    newPost.title
                  }
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      title:
                        e.target
                          .value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-[#EBD8E1] outline-none focus:ring-2 focus:ring-[#D9A6BA]"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-semibold mb-2">

                  Tell your story

                </label>

                <textarea
                  rows="5"
                  placeholder="Share your journey, what you learned, or how you feel..."
                  value={
                    newPost.description
                  }
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      description:
                        e.target
                          .value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-[#EBD8E1] outline-none resize-none focus:ring-2 focus:ring-[#D9A6BA]"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="block text-sm font-semibold mb-2">

                  Category

                </label>

                <select
                  value={
                    newPost.category
                  }
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      category:
                        e.target
                          .value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-[#EBD8E1] bg-white outline-none"
                >

                  <option>
                    Education
                  </option>

                  <option>
                    Career
                  </option>

                  <option>
                    Fitness
                  </option>

                  <option>
                    Habits
                  </option>

                  <option>
                    Finance
                  </option>

                  <option>
                    Self Growth
                  </option>

                </select>

              </div>

              {/* IMAGE */}

              <div>

                <label className="block text-sm font-semibold mb-2">

                  Image URL
                  <span className="text-xs text-[#927386] font-normal ml-2">
                    Optional
                  </span>

                </label>

                <div className="relative">

                  <ImageIcon
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B7A8B]"
                  />

                  <input
                    type="text"
                    placeholder="Paste an image URL"
                    value={
                      newPost.image
                    }
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        image:
                          e.target
                            .value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#EBD8E1] outline-none"
                  />

                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={creating}
                className="w-full py-4 rounded-2xl bg-[#4A1838] text-white font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >

                {creating ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Sharing...

                  </>
                ) : (
                  <>
                    Share Achievement ✨
                  </>
                )}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Inspiration;