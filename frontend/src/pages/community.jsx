import React, { useEffect, useMemo, useState } from "react";

import FeaturesNavbar from "../components/featuresnavbar";

import {
  getCommunityPosts,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  toggleCommunityLike,
  toggleCommunitySave,
  getCommunityComments,
  addCommunityComment,
  deleteCommunityComment,
} from "../api/communityapi";

import {
  Heart,
  MessageCircle,
  Bookmark,
  Search,
  Plus,
  X,
  Send,
  MoreHorizontal,
  Pencil,
  Trash2,
  Sparkles,
  BookOpen,
  Users,
  Image as ImageIcon,
} from "lucide-react";

function Community() {
  // ============================================================
  // USER
  // ============================================================

  const currentUserName =
    localStorage.getItem("name") || "You";

  // ============================================================
  // STATES
  // ============================================================

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [editingPost, setEditingPost] =
    useState(null);

  const [menuPost, setMenuPost] = useState(null);

  const [commentsOpen, setCommentsOpen] =
    useState(null);

  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] =
    useState("");

  const [commentsLoading, setCommentsLoading] =
    useState(false);

  // ============================================================
  // FORM
  // ============================================================

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [category, setCategory] =
    useState("Wellness");

  const [image, setImage] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories = [
    "All",
    "Wellness",
    "Beauty",
    "Fashion",
    "Fitness",
    "Self Growth",
    "Career",
    "Education",
    "Lifestyle",
    "Relationships",
    "Other",
  ];

  // ============================================================
  // FETCH POSTS
  // ============================================================

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCommunityPosts();

      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ============================================================
  // FILTER POSTS
  // ============================================================

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" ||
        post.category === activeCategory;

      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchValue ||
        post.title
          ?.toLowerCase()
          .includes(searchValue) ||
        post.content
          ?.toLowerCase()
          .includes(searchValue) ||
        post.author?.name
          ?.toLowerCase()
          .includes(searchValue);

      return (
        matchesCategory && matchesSearch
      );
    });
  }, [posts, activeCategory, search]);

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("Wellness");
    setImage("");
    setEditingPost(null);
  };

  // ============================================================
  // CREATE / UPDATE
  // ============================================================

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter a title and content.");
      return;
    }

    try {
      setSubmitting(true);

      const postData = {
        title: title.trim(),
        content: content.trim(),
        category,
        image: image.trim(),
      };

      if (editingPost) {
        const data =
          await updateCommunityPost(
            editingPost._id,
            postData
          );

        setPosts((prev) =>
          prev.map((post) =>
            post._id === editingPost._id
              ? data.post
              : post
          )
        );
      } else {
        const data =
          await createCommunityPost(postData);

        setPosts((prev) => [
          data.post,
          ...prev,
        ]);
      }

      resetForm();
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleEdit = (post) => {
    setEditingPost(post);

    setTitle(post.title || "");
    setContent(post.content || "");
    setCategory(post.category || "Other");
    setImage(post.image || "");

    setShowCreateModal(true);
    setMenuPost(null);
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (post) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await deleteCommunityPost(post._id);

      setPosts((prev) =>
        prev.filter(
          (item) => item._id !== post._id
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    setMenuPost(null);
  };

  // ============================================================
  // LIKE
  // ============================================================

  const handleLike = async (post) => {
    try {
      const data =
        await toggleCommunityLike(
          post._id
        );

      setPosts((prev) =>
        prev.map((item) => {
          if (item._id !== post._id)
            return item;

          let likes = [...(item.likes || [])];

          const currentUserId =
            localStorage.getItem("userId");

          if (data.liked) {
            if (
              currentUserId &&
              !likes.includes(currentUserId)
            ) {
              likes.push(currentUserId);
            }
          } else {
            likes = likes.filter(
              (id) =>
                id !== currentUserId
            );
          }

          return {
            ...item,
            likes,
            likeCount: data.likeCount,
          };
        })
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async (post) => {
    try {
      const data =
        await toggleCommunitySave(
          post._id
        );

      setPosts((prev) =>
        prev.map((item) => {
          if (item._id !== post._id)
            return item;

          return {
            ...item,
            saved: data.saved,
            saveCount: data.saveCount,
          };
        })
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ============================================================
  // COMMENTS
  // ============================================================

  const openComments = async (postId) => {
    try {
      setCommentsOpen(postId);
      setCommentsLoading(true);

      const data =
        await getCommunityComments(
          postId
        );

      setComments(data.comments || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const data =
        await addCommunityComment(
          commentsOpen,
          commentText
        );

      setComments((prev) => [
        ...prev,
        data.comment,
      ]);

      setCommentText("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDeleteComment = async (
    commentId
  ) => {
    try {
      await deleteCommunityComment(
        commentsOpen,
        commentId
      );

      setComments((prev) =>
        prev.filter(
          (comment) =>
            comment._id !== commentId
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // CHECK AUTHOR
  // ============================================================

  const isMyPost = (post) => {
    return (
      post.author?.name ===
      currentUserName
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838]">

      <FeaturesNavbar />

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="px-5 md:px-10 lg:px-16 pt-10 pb-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-2 mb-3">

                <div className="w-10 h-10 rounded-full bg-[#F4D9E5] flex items-center justify-center">

                  <Users
                    size={20}
                    className="text-[#7C2855]"
                  />

                </div>

                <span className="text-sm font-semibold text-[#9A5576]">
                  FEMORA COMMUNITY
                </span>

              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Community 🌸
              </h1>

              <p className="mt-3 text-[#7C6370] max-w-xl">
                Share your thoughts, learn from
                others, ask questions and inspire
                someone today.
              </p>

            </div>

            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#4A1838] text-white font-semibold hover:bg-[#64234D] transition shadow-lg"
            >

              <Plus size={20} />

              Create Post

            </button>

          </div>

        </div>

      </section>

      {/* ======================================================
          SEARCH + FILTER
      ====================================================== */}

      <section className="px-5 md:px-10 lg:px-16">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#F2E4E9]">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98A99]"
              />

              <input
                type="text"
                placeholder="Search posts, people or topics..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFF9F7] outline-none border border-transparent focus:border-[#D9A8BD]"
              />

            </div>

            {/* FILTERS */}

            <div className="flex gap-2 overflow-x-auto mt-4 pb-1">

              {categories.map((item) => (

                <button
                  key={item}
                  onClick={() =>
                    setActiveCategory(item)
                  }
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeCategory === item
                      ? "bg-[#4A1838] text-white"
                      : "bg-[#FFF4F7] text-[#79596A] hover:bg-[#F6E4EC]"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="px-5 md:px-10 lg:px-16 py-8">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_300px] gap-8">

          {/* FEED */}

          <div>

            {loading && (

              <div className="text-center py-20 text-[#856A78]">
                Loading community...
              </div>

            )}

            {!loading && error && (

              <div className="bg-white rounded-3xl p-8 text-center border border-red-100">

                <p className="text-red-500 mb-4">
                  {error}
                </p>

                <button
                  onClick={fetchPosts}
                  className="px-5 py-2 rounded-xl bg-[#4A1838] text-white"
                >
                  Try Again
                </button>

              </div>

            )}

            {!loading &&
              !error &&
              filteredPosts.length === 0 && (

                <div className="bg-white rounded-3xl p-12 text-center border border-[#F2E4E9]">

                  <Sparkles
                    size={38}
                    className="mx-auto mb-4 text-[#C58BA7]"
                  />

                  <h3 className="text-xl font-bold">
                    No posts found
                  </h3>

                  <p className="text-[#806A76] mt-2">
                    Be the first to share something
                    with the community.
                  </p>

                  <button
                    onClick={() => {
                      resetForm();
                      setShowCreateModal(true);
                    }}
                    className="mt-5 px-5 py-3 rounded-xl bg-[#4A1838] text-white font-semibold"
                  >
                    Create the first post
                  </button>

                </div>

              )}

            <div className="space-y-6">

              {filteredPosts.map((post) => (

                <article
                  key={post._id}
                  className="bg-white rounded-3xl border border-[#F1E2E8] shadow-sm overflow-hidden"
                >

                  {/* POST HEADER */}

                  <div className="p-5 flex justify-between">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-[#EFD1DE] flex items-center justify-center font-bold text-[#6D234C]">
                        {post.author?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "F"}
                      </div>

                      <div>

                        <p className="font-semibold">
                          {post.author?.name ||
                            "Femora User"}
                        </p>

                        <p className="text-xs text-[#947783]">
                          {formatDate(
                            post.createdAt
                          )}
                        </p>

                      </div>

                    </div>

                    {isMyPost(post) && (

                      <div className="relative">

                        <button
                          onClick={() =>
                            setMenuPost(
                              menuPost ===
                                post._id
                                ? null
                                : post._id
                            )
                          }
                          className="p-2 rounded-full hover:bg-[#FFF4F7]"
                        >
                          <MoreHorizontal
                            size={20}
                          />
                        </button>

                        {menuPost ===
                          post._id && (

                          <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-[#F0E0E7] overflow-hidden z-20 w-36">

                            <button
                              onClick={() =>
                                handleEdit(post)
                              }
                              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[#FFF5F8] text-sm"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(post)
                              }
                              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-red-50 text-red-500 text-sm"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>

                          </div>

                        )}

                      </div>

                    )}

                  </div>

                  {/* CATEGORY */}

                  <div className="px-5">

                    <span className="inline-flex px-3 py-1 rounded-full bg-[#F8E7EE] text-[#7D3158] text-xs font-semibold">
                      {post.category}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="px-5 pt-4">

                    <h2 className="text-2xl font-bold">
                      {post.title}
                    </h2>

                    <p className="mt-3 text-[#6F5B65] leading-7 whitespace-pre-line">
                      {post.content}
                    </p>

                  </div>

                  {/* IMAGE */}

                  {post.image && (

                    <div className="mt-5">

                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full max-h-[500px] object-cover"
                      />

                    </div>

                  )}

                  {/* ACTIONS */}

                  <div className="px-5 py-4 mt-2 flex items-center justify-between border-t border-[#F5E9ED]">

                    <div className="flex items-center gap-5">

                      <button
                        onClick={() =>
                          handleLike(post)
                        }
                        className="flex items-center gap-2 text-sm hover:text-[#B43868] transition"
                      >

                        <Heart
                          size={20}
                          className={
                            post.likes?.length
                              ? "fill-[#D45C87] text-[#D45C87]"
                              : ""
                          }
                        />

                        {post.likeCount ??
                          post.likes?.length ??
                          0}

                      </button>

                      <button
                        onClick={() =>
                          openComments(
                            post._id
                          )
                        }
                        className="flex items-center gap-2 text-sm hover:text-[#B43868]"
                      >

                        <MessageCircle
                          size={20}
                        />

                        Comments

                      </button>

                    </div>

                    <button
                      onClick={() =>
                        handleSave(post)
                      }
                      className="hover:text-[#B43868]"
                    >

                      <Bookmark
                        size={20}
                        className={
                          post.saved
                            ? "fill-[#4A1838]"
                            : ""
                        }
                      />

                    </button>

                  </div>

                </article>

              ))}

            </div>

          </div>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="hidden lg:block space-y-5">

            {/* COMMUNITY CARD */}

            <div className="bg-[#4A1838] text-white rounded-3xl p-6">

              <Sparkles
                size={25}
                className="mb-4"
              />

              <h3 className="text-xl font-bold">
                Your voice matters 🌷
              </h3>

              <p className="text-white/75 text-sm leading-6 mt-2">
                Share something you've learned,
                a personal experience, a question
                or something that inspires you.
              </p>

              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="mt-5 w-full bg-white text-[#4A1838] py-3 rounded-xl font-semibold"
              >
                Share something
              </button>

            </div>

            {/* COMMUNITY RULES */}

            <div className="bg-white rounded-3xl p-6 border border-[#F1E2E8]">

              <h3 className="font-bold text-lg">
                Community Guidelines
              </h3>

              <div className="mt-4 space-y-3 text-sm text-[#715F68]">

                <p>🌸 Be kind and respectful.</p>

                <p>💬 Encourage healthy conversations.</p>

                <p>✨ Share useful experiences.</p>

                <p>🛡️ Protect your privacy.</p>

                <p>🚫 No harassment or spam.</p>

              </div>

            </div>

            {/* QUICK LINKS

            <div className="bg-white rounded-3xl p-6 border border-[#F1E2E8]">

              <h3 className="font-bold">
                Explore Femora
              </h3>

              <div className="mt-4 space-y-3">

                <div className="flex items-center gap-3 text-sm">
                  <BookOpen size={17} />
                  Learning Hub
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Sparkles size={17} />
                  Inspiration Hub
                </div>

              </div>

            </div> */}

          </aside>

        </div>

      </main>

      {/* ======================================================
          CREATE POST MODAL
      ====================================================== */}

      {showCreateModal && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-6 border-b border-[#F1E3E8]">

              <div>

                <h2 className="text-2xl font-bold">
                  {editingPost
                    ? "Edit Post"
                    : "Create a Post ✨"}
                </h2>

                <p className="text-sm text-[#806A76] mt-1">
                  Share something with the Femora
                  community.
                </p>

              </div>

              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 rounded-full hover:bg-[#FFF4F7]"
              >
                <X size={21} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmitPost}
              className="p-6 space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="text-sm font-semibold">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Give your post a title..."
                  maxLength={200}
                  className="mt-2 w-full px-4 py-3 rounded-2xl bg-[#FFF9F7] border border-[#F0DDE5] outline-none focus:border-[#C98BA7]"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="text-sm font-semibold">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="mt-2 w-full px-4 py-3 rounded-2xl bg-[#FFF9F7] border border-[#F0DDE5] outline-none"
                >

                  {categories
                    .filter(
                      (item) => item !== "All"
                    )
                    .map((item) => (

                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>

                    ))}

                </select>

              </div>

              {/* CONTENT */}

              <div>

                <label className="text-sm font-semibold">
                  Your story
                </label>

                <textarea
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder="What would you like to share?"
                  rows={8}
                  className="mt-2 w-full px-4 py-3 rounded-2xl bg-[#FFF9F7] border border-[#F0DDE5] outline-none resize-none focus:border-[#C98BA7]"
                />

              </div>

              {/* IMAGE */}

              <div>

                <label className="text-sm font-semibold">
                  Image URL
                  <span className="font-normal text-[#9B8590]">
                    {" "}
                    (optional)
                  </span>
                </label>

                <div className="relative">

                  <ImageIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A78B97]"
                  />

                  <input
                    type="url"
                    value={image}
                    onChange={(e) =>
                      setImage(e.target.value)
                    }
                    placeholder="https://..."
                    className="mt-2 w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFF9F7] border border-[#F0DDE5] outline-none"
                  />

                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-[#4A1838] text-white font-semibold hover:bg-[#64234D] transition disabled:opacity-50"
              >

                {submitting
                  ? "Publishing..."
                  : editingPost
                  ? "Update Post"
                  : "Publish Post ✨"}

              </button>

            </form>

          </div>

        </div>

      )}

      {/* ======================================================
          COMMENTS MODAL
      ====================================================== */}

      {commentsOpen && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center">

          <div className="bg-white w-full md:max-w-xl md:rounded-3xl rounded-t-3xl max-h-[85vh] flex flex-col">

            {/* HEADER */}

            <div className="flex justify-between items-center p-5 border-b">

              <h2 className="text-xl font-bold">
                Comments 💬
              </h2>

              <button
                onClick={() =>
                  setCommentsOpen(null)
                }
                className="p-2 rounded-full hover:bg-[#FFF4F7]"
              >
                <X size={20} />
              </button>

            </div>

            {/* COMMENTS */}

            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {commentsLoading && (

                <p className="text-center text-[#806A76]">
                  Loading comments...
                </p>

              )}

              {!commentsLoading &&
                comments.length === 0 && (

                  <div className="text-center py-10">

                    <MessageCircle
                      size={35}
                      className="mx-auto text-[#CFA0B4]"
                    />

                    <p className="mt-3 text-[#806A76]">
                      No comments yet.
                    </p>

                    <p className="text-sm text-[#A38B96]">
                      Start the conversation 🌸
                    </p>

                  </div>

                )}

              {comments.map((comment) => (

                <div
                  key={comment._id}
                  className="flex gap-3"
                >

                  <div className="w-9 h-9 shrink-0 rounded-full bg-[#F1D8E2] flex items-center justify-center font-semibold text-[#6B254B]">

                    {comment.author?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "F"}

                  </div>

                  <div className="bg-[#FFF8FA] rounded-2xl px-4 py-3 flex-1">

                    <div className="flex justify-between">

                      <p className="font-semibold text-sm">
                        {comment.author?.name ||
                          "Femora User"}
                      </p>

                      {comment.author?.name ===
                        currentUserName && (

                        <button
                          onClick={() =>
                            handleDeleteComment(
                              comment._id
                            )
                          }
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>

                      )}

                    </div>

                    <p className="text-sm text-[#695963] mt-1">
                      {comment.content}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* COMMENT INPUT */}

            <div className="p-4 border-t">

              <div className="flex gap-2">

                <input
                  type="text"
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment();
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F0DDE5] outline-none"
                />

                <button
                  onClick={handleAddComment}
                  className="w-12 h-12 rounded-2xl bg-[#4A1838] text-white flex items-center justify-center"
                >

                  <Send size={18} />

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Community;