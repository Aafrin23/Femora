import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeaturesNavbar from "../components/featuresnavbar.jsx";

const API_URL = "http://localhost:5000/api/planner";

function Planner() {
  const navigate = useNavigate();

  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "Trip",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // ==========================================================
  // GET PLANNERS
  // ==========================================================

  const fetchPlanners = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch planners");
      }

      setPlanners(data.planners || []);
    } catch (error) {
      console.error("Fetch planners error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanners();
  }, []);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================================
  // CREATE PLANNER
  // ==========================================================

  const createPlanner = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create planner");
      }

      setPlanners((prev) => [data.planner, ...prev]);

      setShowCreateModal(false);

      setFormData({
        title: "",
        type: "Trip",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Create planner error:", error);
      alert(error.message);
    }
  };

  // ==========================================================
  // DELETE PLANNER
  // ==========================================================

  const deletePlanner = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this planner?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete planner");
      }

      setPlanners((prev) =>
        prev.filter((planner) => planner._id !== id)
      );
    } catch (error) {
      console.error("Delete planner error:", error);
      alert(error.message);
    }
  };

  // ==========================================================
  // CALCULATE PROGRESS
  // ==========================================================

  const getProgress = (planner) => {
    const activities = planner.days?.flatMap(
      (day) => day.activities || []
    );

    if (!activities || activities.length === 0) {
      return 0;
    }

    const completed = activities.filter(
      (activity) => activity.completed
    ).length;

    return Math.round(
      (completed / activities.length) * 100
    );
  };

  // ==========================================================
  // ICON
  // ==========================================================

  const getIcon = (type) => {
    const icons = {
      Trip: "✈️",
      Study: "📚",
      Work: "💼",
      Personal: "🌸",
      Event: "🎉",
      Fitness: "🏃‍♀️",
      Other: "✨",
    };

    return icons[type] || "✨";
  };

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7]  text-[#4A1838]">

      <FeaturesNavbar />

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">

          <div>

            <p className="text-[#B76E79] text-sm tracking-widest uppercase mb-2">
              Organize your life
            </p>

            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#4A2438]">
              My Planner ✨
            </h1>

            <p className="mt-3 text-[#8A6875]">
              Plan your trips, goals, events and everyday moments.
            </p>

          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="
              bg-[#4A1838]
              text-white
              px-6
              py-3
              rounded-full
              hover:bg-[#6B2850]
              transition
              shadow-md
            "
          >
            + Create Planner
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-center py-20 text-[#8A6875]">
            Loading your planners...
          </div>
        )}

        {/* EMPTY */}

        {!loading && planners.length === 0 && (
          <div className="
            bg-white
            border
            border-[#E8D8D2]
            rounded-3xl
            p-12
            text-center
            shadow-sm
          ">

            <div className="text-6xl mb-5">
              🌷
            </div>

            <h2 className="text-2xl font-serif text-[#4A2438]">
              Create your first planner
            </h2>

            <p className="text-[#8A6875] mt-2 mb-7">
              Start planning something beautiful.
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="
                bg-[#B76E79]
                text-white
                px-6
                py-3
                rounded-full
                hover:bg-[#4A1838]
                transition
              "
            >
              Create Planner
            </button>

          </div>
        )}

        {/* PLANNERS */}

        {!loading && planners.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {planners.map((planner) => {

              const progress = getProgress(planner);

              const activityCount =
                planner.days?.reduce(
                  (total, day) =>
                    total + (day.activities?.length || 0),
                  0
                ) || 0;

              return (
                <div
                  key={planner._id}
                  className="
                    bg-white
                    rounded-3xl
                    border
                    border-[#E8D8D2]
                    p-6
                    shadow-[0_8px_30px_rgba(74,36,56,0.08)]
                    hover:-translate-y-1
                    transition
                    relative
                  "
                >

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      deletePlanner(planner._id)
                    }
                    className="
                      absolute
                      top-5
                      right-5
                      text-[#B76E79]
                      hover:text-red-500
                      text-lg
                    "
                  >
                    ×
                  </button>

                  {/* ICON */}

                  <div className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-[#FFF0F3]
                    flex
                    items-center
                    justify-center
                    text-2xl
                    mb-5
                  ">
                    {getIcon(planner.type)}
                  </div>

                  {/* TITLE */}

                  <h2 className="text-xl font-serif font-semibold text-[#4A2438]">
                    {planner.title}
                  </h2>

                  <p className="text-xs text-[#B76E79] mt-1 uppercase tracking-wide">
                    {planner.type}
                  </p>

                  {/* LOCATION */}

                  {planner.location && (
                    <p className="text-sm text-[#8A6875] mt-3">
                      📍 {planner.location}
                    </p>
                  )}

                  {/* DATE */}

                  {(planner.startDate || planner.endDate) && (
                    <p className="text-sm text-[#8A6875] mt-1">
                      📅 {formatDate(planner.startDate)}
                      {planner.endDate &&
                        ` – ${formatDate(planner.endDate)}`}
                    </p>
                  )}

                  {/* STATS */}

                  <div className="flex gap-4 mt-5 text-xs text-[#8A6875]">

                    <span>
                      📅 {planner.days?.length || 0} days
                    </span>

                    <span>
                      ✨ {activityCount} activities
                    </span>

                  </div>

                  {/* PROGRESS */}

                  <div className="mt-6">

                    <div className="flex justify-between text-xs mb-2">

                      <span className="text-[#8A6875]">
                        Progress
                      </span>

                      <span className="text-[#B76E79] font-medium">
                        {progress}%
                      </span>

                    </div>

                    <div className="h-2 bg-[#F3E7E8] rounded-full overflow-hidden">

                      <div
                        className="h-full bg-[#B76E79] rounded-full transition-all"
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* OPEN */}

                  <button
                    onClick={() =>
                      navigate(`/planner/${planner._id}`)
                    }
                    className="
                      mt-6
                      w-full
                      border
                      border-[#B76E79]
                      text-[#B76E79]
                      py-2.5
                      rounded-full
                      hover:bg-[#B76E79]
                      hover:text-white
                      transition
                    "
                  >
                    Open Planner →
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </main>

      {/* ======================================================
          CREATE MODAL
      ====================================================== */}

      {showCreateModal && (
        <div className="
          fixed
          inset-0
          bg-[#4A1838]/40
          backdrop-blur-sm
          flex
          items-center
          justify-center
          z-50
          px-4
        ">

          <div className="
            bg-[#FFFDFC]
            w-full
            max-w-lg
            rounded-3xl
            p-8
            shadow-2xl
            max-h-[90vh]
            overflow-y-auto
          ">

            {/* MODAL HEADER */}

            <div className="flex justify-between items-start mb-6">

              <div>

                <h2 className="text-2xl font-serif font-semibold text-[#4A2438]">
                  Create a Planner ✨
                </h2>

                <p className="text-sm text-[#8A6875] mt-1">
                  What are you planning?
                </p>

              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="text-2xl text-[#B76E79]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={createPlanner}
              className="space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm mb-2 text-[#4A2438]">
                  Planner Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Goa Trip"
                  required
                  className="
                    w-full
                    border
                    border-[#E8D8D2]
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:border-[#B76E79]
                    bg-white
                  "
                />

              </div>

              {/* TYPE */}

              <div>

                <label className="block text-sm mb-2">
                  Planner Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-[#E8D8D2]
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:border-[#B76E79]
                    bg-white
                  "
                >
                  <option value="Trip">✈️ Trip</option>
                  <option value="Study">📚 Study</option>
                  <option value="Work">💼 Work</option>
                  <option value="Personal">🌸 Personal</option>
                  <option value="Event">🎉 Event</option>
                  <option value="Fitness">🏃‍♀️ Fitness</option>
                  <option value="Other">✨ Other</option>
                </select>

              </div>

              {/* LOCATION */}

              <div>

                <label className="block text-sm mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Goa, India"
                  className="
                    w-full
                    border
                    border-[#E8D8D2]
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:border-[#B76E79]
                    bg-white
                  "
                />

              </div>

              {/* DATES */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-[#E8D8D2]
                      rounded-xl
                      px-3
                      py-3
                      outline-none
                      focus:border-[#B76E79]
                      bg-white
                    "
                  />

                </div>

                <div>

                  <label className="block text-sm mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-[#E8D8D2]
                      rounded-xl
                      px-3
                      py-3
                      outline-none
                      focus:border-[#B76E79]
                      bg-white
                    "
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us a little about your plan..."
                  rows="3"
                  className="
                    w-full
                    border
                    border-[#E8D8D2]
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:border-[#B76E79]
                    bg-white
                    resize-none
                  "
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="
                    flex-1
                    border
                    border-[#E8D8D2]
                    py-3
                    rounded-full
                    text-[#8A6875]
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex-1
                    bg-[#4A1838]
                    text-white
                    py-3
                    rounded-full
                    hover:bg-[#6B2850]
                    transition
                  "
                >
                  Create Planner
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Planner;