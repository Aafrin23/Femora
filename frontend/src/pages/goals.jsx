import React, { useEffect, useMemo, useState } from "react";
import FeaturesNavbar from "../components/featuresnavbar.jsx";

import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../api/goalapi.js";

function Goals() {
  // ============================================================
  // STATES
  // ============================================================

  const [goals, setGoals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [filter, setFilter] = useState("all");

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    type: "short-term",
    category: "Personal",
    priority: "medium",
    targetDate: "",
    progress: 0,
    milestones: [],
  });

  // ============================================================
  // LOAD GOALS
  // ============================================================

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getGoals();

      setGoals(data);
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to load goals");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ADD GOAL
  // ============================================================

  const handleAddGoal = async (e) => {
    e.preventDefault();

    if (!newGoal.title.trim()) {
      return;
    }

    try {
      const createdGoal = await createGoal({
        title: newGoal.title,
        description: newGoal.description,
        type: newGoal.type,
        category: newGoal.category,
        priority: newGoal.priority,
        targetDate: newGoal.targetDate || null,
        progress: Number(newGoal.progress),
        milestones: [],
      });

      setGoals((prev) => [createdGoal, ...prev]);

      setNewGoal({
        title: "",
        description: "",
        type: "short-term",
        category: "Personal",
        priority: "medium",
        targetDate: "",
        progress: 0,
        milestones: [],
      });

      setShowModal(false);
    } catch (err) {
      alert(err.message || "Failed to create goal");
    }
  };

  // ============================================================
  // DELETE GOAL
  // ============================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!confirmed) return;

    try {
      await deleteGoal(id);

      setGoals((prev) =>
        prev.filter((goal) => goal._id !== id)
      );
    } catch (err) {
      alert(err.message || "Failed to delete goal");
    }
  };

  // ============================================================
  // COMPLETE GOAL
  // ============================================================

  const handleComplete = async (goal) => {
    try {
      const completed = !goal.completed;

      const updatedGoal = await updateGoal(goal._id, {
        completed,
        progress: completed ? 100 : goal.progress === 100 ? 99 : goal.progress,
      });

      setGoals((prev) =>
        prev.map((item) =>
          item._id === goal._id ? updatedGoal : item
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update goal");
    }
  };

  // ============================================================
  // UPDATE PROGRESS
  // ============================================================

  const handleProgressChange = async (goal, value) => {
    const progress = Number(value);

    try {
      const updatedGoal = await updateGoal(goal._id, {
        progress,
        completed: progress === 100,
      });

      setGoals((prev) =>
        prev.map((item) =>
          item._id === goal._id ? updatedGoal : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredGoals = useMemo(() => {
    switch (filter) {
      case "active":
        return goals.filter((goal) => !goal.completed);

      case "completed":
        return goals.filter((goal) => goal.completed);

      case "short-term":
        return goals.filter(
          (goal) => goal.type === "short-term"
        );

      case "long-term":
        return goals.filter(
          (goal) => goal.type === "long-term"
        );

      default:
        return goals;
    }
  }, [goals, filter]);

  // ============================================================
  // STATS
  // ============================================================

  const completedGoals = goals.filter(
    (goal) => goal.completed
  ).length;

  const activeGoals = goals.filter(
    (goal) => !goal.completed
  ).length;

  const overallProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce(
            (total, goal) => total + goal.progress,
            0
          ) / goals.length
        )
      : 0;

  // ============================================================
  // DATE HELPER
  // ============================================================

  const getDeadlineText = (targetDate) => {
    if (!targetDate) return "No deadline";

    const today = new Date();
    const deadline = new Date(targetDate);

    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const difference =
      deadline.getTime() - today.getTime();

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    if (days < 0) {
      return "Overdue";
    }

    if (days === 0) {
      return "Due today";
    }

    if (days === 1) {
      return "1 day left";
    }

    return `${days} days left`;
  };

  // ============================================================
  // PRIORITY
  // ============================================================

  const getPriorityStyle = (priority) => {
    if (priority === "high") {
      return "bg-red-50 text-red-500";
    }

    if (priority === "medium") {
      return "bg-yellow-50 text-yellow-600";
    }

    return "bg-green-50 text-green-600";
  };

  // ============================================================
  // GOAL CARD
  // ============================================================

  const GoalCard = ({ goal }) => {
    return (
      <div
        className={`bg-white rounded-3xl p-6 border border-[#F4E4E7]
                    shadow-sm hover:shadow-lg transition-all duration-300
                    ${
                      goal.completed
                        ? "opacity-80"
                        : ""
                    }`}
      >
        {/* Header */}

        <div className="flex justify-between gap-4">

          <div className="flex gap-3">

            <button
              onClick={() => handleComplete(goal)}
              className={`w-8 h-8 rounded-full border-2
                         flex items-center justify-center
                         flex-shrink-0 transition
                         ${
                           goal.completed
                             ? "bg-[#B76E79] border-[#B76E79] text-white"
                             : "border-[#B76E79] text-transparent"
                         }`}
            >
              ✓
            </button>

            <div>

              <h3
                className={`text-lg font-semibold ${
                  goal.completed
                    ? "line-through text-gray-400"
                    : "text-[#4A1838]"
                }`}
              >
                {goal.title}
              </h3>

              {goal.description && (
                <p className="text-sm text-gray-400 mt-1">
                  {goal.description}
                </p>
              )}

            </div>

          </div>

          <button
            onClick={() => handleDelete(goal._id)}
            className="text-gray-300 hover:text-red-400
                       text-xl transition"
          >
            ×
          </button>

        </div>

        {/* Tags */}

        <div className="flex flex-wrap gap-2 mt-5">

          <span className="px-3 py-1 rounded-full
                           bg-[#FFF1F3] text-[#B76E79]
                           text-xs font-medium">
            {goal.category}
          </span>

          <span
            className={`px-3 py-1 rounded-full
                        text-xs font-medium
                        ${getPriorityStyle(goal.priority)}`}
          >
            {goal.priority} priority
          </span>

          {goal.targetDate && (
            <span className="px-3 py-1 rounded-full
                             bg-gray-50 text-gray-500
                             text-xs"
            >
              📅 {new Date(goal.targetDate).toLocaleDateString()}
            </span>
          )}

        </div>

        {/* Deadline */}

        {goal.targetDate && !goal.completed && (
          <p
            className={`text-xs mt-4 ${
              getDeadlineText(goal.targetDate) ===
              "Overdue"
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            ⏳ {getDeadlineText(goal.targetDate)}
          </p>
        )}

        {/* Progress */}

        <div className="mt-6">

          <div className="flex justify-between mb-2">

            <span className="text-sm font-medium text-gray-600">
              Progress
            </span>

            <span className="text-sm font-semibold text-[#B76E79]">
              {goal.progress}%
            </span>

          </div>

          <div className="w-full h-3 bg-[#F7E7EA]
                          rounded-full overflow-hidden">

            <div
              className="h-full bg-[#B76E79]
                         rounded-full transition-all duration-500"
              style={{
                width: `${goal.progress}%`,
              }}
            />

          </div>

          {!goal.completed && (
            <input
              type="range"
              min="0"
              max="100"
              value={goal.progress}
              onChange={(e) =>
                handleProgressChange(
                  goal,
                  e.target.value
                )
              }
              className="w-full mt-4 accent-[#B76E79]"
            />
          )}

        </div>

        {/* Completed */}

        {goal.completed && (
          <div className="mt-5 p-3 rounded-xl
                          bg-[#FFF1F3] text-center
                          text-sm text-[#B76E79] font-medium">
            🎉 Goal completed!
          </div>
        )}

      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838]">

      <FeaturesNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* HERO */}

        <section className="text-center mb-10">

          <p className="text-[#B76E79] text-sm font-medium tracking-widest">
            YOUR DREAMS • YOUR JOURNEY
          </p>

          <h1 className="text-5xl font-bold mt-3 ruge-boogie-regular">
            Goals 🎯
          </h1>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto bad-script-regular text-lg">
            Turn your dreams into goals and your goals
            into action. ✨
          </p>

        </section>

        {/* ERROR */}

        {error && (
          <div className="mb-6 p-4 rounded-2xl
                          bg-red-50 text-red-500 text-center">
            {error}
          </div>
        )}

        {/* STATS */}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-3xl p-5 border border-[#F4E4E7]">
            <p className="text-sm text-gray-400">
              Total Goals
            </p>

            <p className="text-3xl font-bold mt-2">
              {goals.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#F4E4E7]">
            <p className="text-sm text-gray-400">
              Completed
            </p>

            <p className="text-3xl font-bold mt-2 text-[#B76E79]">
              {completedGoals}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#F4E4E7]">
            <p className="text-sm text-gray-400">
              In Progress
            </p>

            <p className="text-3xl font-bold mt-2">
              {activeGoals}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#F4E4E7]">
            <p className="text-sm text-gray-400">
              Overall Progress
            </p>

            <p className="text-3xl font-bold mt-2 text-[#B76E79]">
              {overallProgress}%
            </p>
          </div>

        </section>

        {/* OVERALL PROGRESS */}

        <section className="bg-white rounded-3xl p-6 md:p-8
                            border border-[#F4E4E7]
                            shadow-sm mb-8">

          <div className="flex justify-between mb-3">

            <div>
              <h2 className="text-xl font-semibold">
                Your Goal Journey ✨
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Every small step counts.
              </p>
            </div>

            <span className="text-xl font-bold text-[#B76E79]">
              {overallProgress}%
            </span>

          </div>

          <div className="h-4 bg-[#F7E7EA]
                          rounded-full overflow-hidden">

            <div
              className="h-full bg-[#B76E79]
                         rounded-full transition-all duration-700"
              style={{
                width: `${overallProgress}%`,
              }}
            />

          </div>

        </section>

        {/* FILTER + ADD */}

        <div className="flex flex-col md:flex-row
                        md:items-center md:justify-between
                        gap-4 mb-8">

          <div className="flex flex-wrap gap-2">

            {[
              ["all", "All"],
              ["active", "Active"],
              ["completed", "Completed"],
              ["short-term", "Short-Term"],
              ["long-term", "Long-Term"],
            ].map(([value, label]) => (

              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-full text-sm
                  transition
                  ${
                    filter === value
                      ? "bg-[#B76E79] text-white"
                      : "bg-white border border-[#F4E4E7] text-gray-500"
                  }`}
              >
                {label}
              </button>

            ))}

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-full
                       bg-[#B76E79] text-white
                       hover:bg-[#9F5966]
                       transition shadow-md"
          >
            + Add New Goal
          </button>

        </div>

        {/* GOALS */}

        {loading ? (

          <div className="text-center py-20 text-gray-400">
            Loading your goals... ✨
          </div>

        ) : filteredGoals.length === 0 ? (

          <div className="bg-white rounded-3xl p-12
                          text-center border border-dashed
                          border-[#E7C8CE]">

            <div className="text-5xl mb-4">
              🎯
            </div>

            <h2 className="text-xl font-semibold">
              No goals here yet
            </h2>

            <p className="text-gray-400 mt-2">
              Start with one small goal and build from there.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-6 py-3 rounded-full
                         bg-[#B76E79] text-white"
            >
              Create Your First Goal
            </button>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
              />
            ))}

          </div>

        )}

      </main>

      {/* ======================================================
          ADD GOAL MODAL
      ====================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50
                        flex items-center justify-center
                        bg-black/40 px-4">

          <div className="bg-white rounded-3xl
                          w-full max-w-lg p-6 md:p-8
                          shadow-xl max-h-[90vh]
                          overflow-y-auto">

            <div className="flex justify-between
                            items-center mb-6">

              <div>
                <h2 className="text-2xl font-semibold">
                  Create New Goal ✨
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  What do you want to achieve?
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-400
                           hover:text-gray-700"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleAddGoal}
              className="space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Goal Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Exercise 4 times a week"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      title: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200
                             rounded-xl px-4 py-3
                             outline-none
                             focus:border-[#B76E79]"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  rows="3"
                  placeholder="Describe your goal..."
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200
                             rounded-xl px-4 py-3
                             outline-none resize-none
                             focus:border-[#B76E79]"
                />

              </div>

              {/* TYPE */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Goal Type
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setNewGoal({
                        ...newGoal,
                        type: "short-term",
                      })
                    }
                    className={`p-3 rounded-xl border ${
                      newGoal.type === "short-term"
                        ? "border-[#B76E79] bg-[#FFF1F3] text-[#B76E79]"
                        : "border-gray-200"
                    }`}
                  >
                    🌷 Short-Term
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNewGoal({
                        ...newGoal,
                        type: "long-term",
                      })
                    }
                    className={`p-3 rounded-xl border ${
                      newGoal.type === "long-term"
                        ? "border-[#B76E79] bg-[#FFF1F3] text-[#B76E79]"
                        : "border-gray-200"
                    }`}
                  >
                    🌙 Long-Term
                  </button>

                </div>

              </div>

              {/* CATEGORY */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <select
                  value={newGoal.category}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      category: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200
                             rounded-xl px-4 py-3
                             outline-none"
                >
                  <option>Personal</option>
                  <option>Wellness</option>
                  <option>Beauty</option>
                  <option>Learning</option>
                  <option>Career</option>
                  <option>Finance</option>
                  <option>Fitness</option>
                  <option>Mindfulness</option>
                  <option>Other</option>
                </select>

              </div>

              {/* PRIORITY */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Priority
                </label>

                <div className="grid grid-cols-3 gap-2">

                  {["low", "medium", "high"].map(
                    (priority) => (

                      <button
                        type="button"
                        key={priority}
                        onClick={() =>
                          setNewGoal({
                            ...newGoal,
                            priority,
                          })
                        }
                        className={`p-3 rounded-xl
                                    border capitalize ${
                          newGoal.priority === priority
                            ? "border-[#B76E79] bg-[#FFF1F3] text-[#B76E79]"
                            : "border-gray-200"
                        }`}
                      >
                        {priority}
                      </button>

                    )
                  )}

                </div>

              </div>

              {/* DATE */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Target Date
                </label>

                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      targetDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200
                             rounded-xl px-4 py-3
                             outline-none"
                />

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="w-full py-3 rounded-xl
                           bg-[#B76E79] text-white
                           font-medium hover:bg-[#9F5966]
                           transition"
              >
                Add Goal ✨
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Goals;