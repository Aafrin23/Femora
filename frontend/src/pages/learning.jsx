import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeaturesNavbar from "../components/featuresnavbar.jsx";

import {
  getLearningPosts,
  createLearningPost,
  deleteLearningPost,
  toggleLearningLike,
  toggleLearningSave,
  addLearningComment,
} from "../api/learning.js";

import {
  BookOpen,
  Lightbulb,
  Wrench,
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  Plus,
  Trash2,
  X,
  Sparkles,
  Trophy,
  Clock,
  Send,
} from "lucide-react";

function LearningHub() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  const [newPost, setNewPost] = useState({
    type: "insight",
    title: "",
    content: "",
    category: "Personal Growth",
    skillName: "",
    skillLevel: "",
    tags: "",
  });

  const [commentText, setCommentText] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const userId = localStorage.getItem("userId");

  // ============================================================
  // LOAD POSTS
  // ============================================================

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);

      const data = await getLearningPosts();

      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CREATE POST
  // ============================================================

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert("Please enter a title and content.");
      return;
    }

    try {
      const created = await createLearningPost({
        ...newPost,
        tags: newPost.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      setPosts((prev) => [created, ...prev]);

      setNewPost({
        type: "insight",
        title: "",
        content: "",
        category: "Personal Growth",
        skillName: "",
        skillLevel: "",
        tags: "",
      });

      setShowCreate(false);
    } catch (error) {
      alert(error.message);
    }
  };

  // ============================================================
  // LIKE
  // ============================================================

  const handleLike = async (postId) => {
    try {
      const result = await toggleLearningLike(postId);

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;

          const likes = post.likes || [];

          return {
            ...post,
            likes: result.liked
              ? [...likes, userId]
              : likes.filter((id) => String(id) !== String(userId)),
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async (postId) => {
    try {
      const result = await toggleLearningSave(postId);

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;

          const saves = post.saves || [];

          return {
            ...post,
            saves: result.saved
              ? [...saves, userId]
              : saves.filter((id) => String(id) !== String(userId)),
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await deleteLearningPost(postId);

      setPosts((prev) =>
        prev.filter((post) => post._id !== postId)
      );
    } catch (error) {
      alert(error.message);
    }
  };

  // ============================================================
  // COMMENT
  // ============================================================

  const handleComment = async (postId) => {
    const text = commentText[postId];

    if (!text?.trim()) return;

    try {
      const updatedPost = await addLearningComment(
        postId,
        text
      );

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? updatedPost : post
        )
      );

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTab =
        activeTab === "all" ||
        post.type === activeTab;

      const matchesCategory =
        category === "All" ||
        post.category === category;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        post.title?.toLowerCase().includes(searchText) ||
        post.content?.toLowerCase().includes(searchText) ||
        post.authorName?.toLowerCase().includes(searchText) ||
        post.skillName?.toLowerCase().includes(searchText);

      return (
        matchesTab &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [posts, activeTab, category, search]);

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838]">

      <FeaturesNavbar />

      {/* HERO */}

      <section className="px-6 pt-12 pb-8">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7E3EA] text-[#8A4165] text-sm font-medium mb-5">
                <Sparkles size={16} />
                Learn • Share • Grow
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Learning Hub 📚
              </h1>

              <p className="mt-4 max-w-2xl text-[#7A5268] text-lg">
                Discover new ideas, share what you've learned,
                and showcase the skills you're building.
              </p>

            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#4A1838] text-white font-semibold hover:opacity-90 transition"
            >
              <Plus size={19} />
              Share Something
            </button>

          </div>

        </div>
      </section>

      {/* STATS */}

      <section className="px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white rounded-3xl p-5 border border-[#F1DCE4]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F8E7ED] flex items-center justify-center">
                <BookOpen size={21} />
              </div>

              <div>
                <p className="text-sm text-[#8B6A7B]">
                  Community Lessons
                </p>

                <p className="text-2xl font-bold">
                  {posts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#F1DCE4]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F8E7ED] flex items-center justify-center">
                <Lightbulb size={21} />
              </div>

              <div>
                <p className="text-sm text-[#8B6A7B]">
                  Learning Insights
                </p>

                <p className="text-2xl font-bold">
                  {posts.filter((p) => p.type === "insight").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#F1DCE4]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F8E7ED] flex items-center justify-center">
                <Trophy size={21} />
              </div>

              <div>
                <p className="text-sm text-[#8B6A7B]">
                  Skills Shared
                </p>

                <p className="text-2xl font-bold">
                  {posts.filter((p) => p.type === "skill").length}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SEARCH */}

      <section className="px-6 mt-8">
        <div className="max-w-6xl mx-auto">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A7788]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search learning, skills and insights..."
              className="w-full bg-white border border-[#EFDCE4] rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#D9A7BB]"
            />

          </div>

        </div>
      </section>

      {/* FILTERS */}

      <section className="px-6 mt-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3">

          {[
            ["all", "All"],
            ["insight", "💡 Insights"],
            ["skill", "🛠️ Skills"],
            ["showcase", "✨ Showcase"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`px-5 py-2.5 rounded-full font-medium transition ${
                activeTab === value
                  ? "bg-[#4A1838] text-white"
                  : "bg-white border border-[#EFDCE4]"
              }`}
            >
              {label}
            </button>
          ))}

        </div>
      </section>

      {/* CATEGORY */}

      <section className="px-6 mt-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">

          {[
            "All",
            "Wellness",
            "Beauty",
            "Fashion",
            "Career",
            "Technology",
            "Finance",
            "Personal Growth",
            "Creative Skills",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-4 py-2 rounded-xl text-sm transition ${
                category === item
                  ? "bg-[#F2D5DF] text-[#4A1838]"
                  : "text-[#806070] hover:bg-white"
              }`}
            >
              {item}
            </button>
          ))}

        </div>
      </section>

      {/* POSTS */}

      <section className="px-6 py-10">

        <div className="max-w-6xl mx-auto">

          {loading ? (
            <div className="text-center py-20">
              Loading learning community...
            </div>
          ) : filteredPosts.length === 0 ? (

            <div className="bg-white rounded-3xl p-12 text-center border border-[#F0DDE5]">

              <BookOpen
                size={40}
                className="mx-auto mb-4"
              />

              <h3 className="text-xl font-bold">
                No learning posts yet
              </h3>

              <p className="text-[#866576] mt-2">
                Be the first person to share something you've learned.
              </p>

              <button
                onClick={() => setShowCreate(true)}
                className="mt-6 px-6 py-3 rounded-xl bg-[#4A1838] text-white font-semibold"
              >
                Share Your First Insight
              </button>

            </div>

          ) : (

            <div className="grid lg:grid-cols-2 gap-6">

              {filteredPosts.map((post) => {

                const liked =
                  post.likes?.some(
                    (id) => String(id) === String(userId)
                  );

                const saved =
                  post.saves?.some(
                    (id) => String(id) === String(userId)
                  );

                return (

                  <article
                    key={post._id}
                    className="bg-white rounded-3xl border border-[#F0DDE5] overflow-hidden h-fit"
                  >

                    {/* POST HEADER */}

                    <div className="p-6">

                      <div className="flex justify-between items-start">

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 rounded-full bg-[#EED0DC] flex items-center justify-center font-bold">
                            {post.authorName
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold">
                              {post.authorName}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-[#927080]">
                              <span>
                                {new Date(
                                  post.createdAt
                                ).toLocaleDateString()}
                              </span>

                              <span>•</span>

                              <span>
                                {post.category}
                              </span>
                            </div>

                          </div>

                        </div>

                        {String(post.author?._id) ===
                          String(userId) && (
                          <button
                            onClick={() =>
                              handleDelete(post._id)
                            }
                            className="p-2 rounded-xl hover:bg-red-50 text-red-500"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}

                      </div>

                      {/* TYPE */}

                      <div className="mt-5">

                        {post.type === "insight" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFF1C9] text-[#805E00] text-xs font-semibold">
                            💡 Learning Insight
                          </span>
                        )}

                        {post.type === "skill" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E5F1EA] text-[#386047] text-xs font-semibold">
                            🛠️ Skill
                          </span>
                        )}

                        {post.type === "showcase" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EEE5FA] text-[#63427C] text-xs font-semibold">
                            ✨ Showcase
                          </span>
                        )}

                      </div>

                      <h2 className="text-xl font-bold mt-4">
                        {post.title}
                      </h2>

                      <p className="mt-3 text-[#695061] leading-7 whitespace-pre-wrap">
                        {post.content}
                      </p>

                      {/* SKILL */}

                      {post.skillName && (
                        <div className="mt-5 p-4 rounded-2xl bg-[#FFF8FA] border border-[#F2DFE6]">

                          <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <Wrench size={18} />

                              <div>
                                <p className="font-semibold">
                                  {post.skillName}
                                </p>

                                <p className="text-xs text-[#8C6D7C]">
                                  Skill level
                                </p>
                              </div>

                            </div>

                            {post.skillLevel && (
                              <span className="px-3 py-1 rounded-full bg-[#4A1838] text-white text-xs">
                                {post.skillLevel}
                              </span>
                            )}

                          </div>

                        </div>
                      )}

                      {/* TAGS */}

                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-5">

                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-sm text-[#8B4968]"
                            >
                              #{tag}
                            </span>
                          ))}

                        </div>
                      )}

                      {/* ACTIONS */}

                      <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#F3E4E9]">

                        <div className="flex items-center gap-5">

                          <button
                            onClick={() =>
                              handleLike(post._id)
                            }
                            className={`flex items-center gap-2 ${
                              liked
                                ? "text-[#D34D75]"
                                : "text-[#765A69]"
                            }`}
                          >
                            <Heart
                              size={20}
                              fill={
                                liked
                                  ? "currentColor"
                                  : "none"
                              }
                            />

                            <span>
                              {post.likes?.length || 0}
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              setExpandedComments(
                                (prev) => ({
                                  ...prev,
                                  [post._id]:
                                    !prev[post._id],
                                })
                              )
                            }
                            className="flex items-center gap-2 text-[#765A69]"
                          >
                            <MessageCircle size={20} />

                            <span>
                              {post.comments?.length || 0}
                            </span>
                          </button>

                        </div>

                        <button
                          onClick={() =>
                            handleSave(post._id)
                          }
                          className={
                            saved
                              ? "text-[#4A1838]"
                              : "text-[#765A69]"
                          }
                        >
                          <Bookmark
                            size={20}
                            fill={
                              saved
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                      </div>

                      {/* COMMENTS */}

                      {expandedComments[post._id] && (

                        <div className="mt-5">

                          <div className="space-y-3 max-h-60 overflow-y-auto">

                            {post.comments?.length === 0 && (
                              <p className="text-sm text-[#927080]">
                                No comments yet. Start the conversation 💬
                              </p>
                            )}

                            {post.comments?.map(
                              (comment, index) => (
                                <div
                                  key={index}
                                  className="bg-[#FFF8FA] rounded-2xl p-3"
                                >
                                  <p className="font-semibold text-sm">
                                    {comment.userName}
                                  </p>

                                  <p className="text-sm text-[#695061] mt-1">
                                    {comment.text}
                                  </p>
                                </div>
                              )
                            )}

                          </div>

                          <div className="flex gap-2 mt-4">

                            <input
                              value={
                                commentText[post._id] || ""
                              }
                              onChange={(e) =>
                                setCommentText(
                                  (prev) => ({
                                    ...prev,
                                    [post._id]:
                                      e.target.value,
                                  })
                                )
                              }
                              placeholder="Share your thoughts..."
                              className="flex-1 px-4 py-3 rounded-xl border border-[#EFDCE4] outline-none"
                            />

                            <button
                              onClick={() =>
                                handleComment(post._id)
                              }
                              className="px-4 rounded-xl bg-[#4A1838] text-white"
                            >
                              <Send size={17} />
                            </button>

                          </div>

                        </div>

                      )}

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </div>

      </section>

      {/* CREATE MODAL */}

      {showCreate && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-5">

          <div className="bg-white w-full max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto">

            <div className="p-6 border-b border-[#F1E2E8] flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold">
                  Share Your Learning ✨
                </h2>

                <p className="text-sm text-[#896A7A] mt-1">
                  Teach, inspire and showcase what you're building.
                </p>

              </div>

              <button
                onClick={() => setShowCreate(false)}
                className="p-2 rounded-xl hover:bg-[#FFF3F6]"
              >
                <X />
              </button>

            </div>

            <form
              onSubmit={handleCreatePost}
              className="p-6 space-y-5"
            >

              {/* TYPE */}

              <div>

                <label className="block font-semibold mb-2">
                  What are you sharing?
                </label>

                <div className="grid grid-cols-3 gap-2">

                  {[
                    ["insight", "💡 Insight"],
                    ["skill", "🛠️ Skill"],
                    ["showcase", "✨ Showcase"],
                  ].map(([value, label]) => (

                    <button
                      type="button"
                      key={value}
                      onClick={() =>
                        setNewPost({
                          ...newPost,
                          type: value,
                        })
                      }
                      className={`p-3 rounded-xl border text-sm font-medium ${
                        newPost.type === value
                          ? "border-[#4A1838] bg-[#F8E7ED]"
                          : "border-[#E9D9E0]"
                      }`}
                    >
                      {label}
                    </button>

                  ))}

                </div>

              </div>

              {/* TITLE */}

              <div>

                <label className="block font-semibold mb-2">
                  Title
                </label>

                <input
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      title: e.target.value,
                    })
                  }
                  placeholder="What did you learn?"
                  className="w-full px-4 py-3 rounded-xl border border-[#E9D9E0] outline-none focus:ring-2 focus:ring-[#E2B4C5]"
                />

              </div>

              {/* CONTENT */}

              <div>

                <label className="block font-semibold mb-2">
                  Tell us about it
                </label>

                <textarea
                  rows="6"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      content: e.target.value,
                    })
                  }
                  placeholder="Share your learning, experience, tips or insights..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E9D9E0] outline-none resize-none focus:ring-2 focus:ring-[#E2B4C5]"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="block font-semibold mb-2">
                  Category
                </label>

                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#E9D9E0] bg-white"
                >
                  <option>Wellness</option>
                  <option>Beauty</option>
                  <option>Fashion</option>
                  <option>Career</option>
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Personal Growth</option>
                  <option>Creative Skills</option>
                </select>

              </div>

              {/* SKILL */}

              {(newPost.type === "skill" ||
                newPost.type === "showcase") && (

                <div className="grid md:grid-cols-2 gap-4">

                  <div>

                    <label className="block font-semibold mb-2">
                      Skill
                    </label>

                    <input
                      value={newPost.skillName}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          skillName: e.target.value,
                        })
                      }
                      placeholder="e.g. React, Makeup, Photography"
                      className="w-full px-4 py-3 rounded-xl border border-[#E9D9E0]"
                    />

                  </div>

                  <div>

                    <label className="block font-semibold mb-2">
                      Skill Level
                    </label>

                    <select
                      value={newPost.skillLevel}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          skillLevel: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[#E9D9E0] bg-white"
                    >
                      <option value="">
                        Select level
                      </option>

                      <option>
                        Beginner
                      </option>

                      <option>
                        Intermediate
                      </option>

                      <option>
                        Advanced
                      </option>

                    </select>

                  </div>

                </div>

              )}

              {/* TAGS */}

              <div>

                <label className="block font-semibold mb-2">
                  Tags
                </label>

                <input
                  value={newPost.tags}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      tags: e.target.value,
                    })
                  }
                  placeholder="React, Learning, Career"
                  className="w-full px-4 py-3 rounded-xl border border-[#E9D9E0]"
                />

                <p className="text-xs text-[#927080] mt-2">
                  Separate tags with commas.
                </p>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#4A1838] text-white font-semibold hover:opacity-90"
              >
                Publish to Learning Hub ✨
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default LearningHub;