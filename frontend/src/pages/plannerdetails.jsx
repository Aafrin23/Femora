import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FeaturesNavbar from "../components/featuresnavbar.jsx";

const API_URL = "http://localhost:5000/api/planner";

function PlannerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [planner, setPlanner] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDayModal, setShowDayModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const [selectedDay, setSelectedDay] = useState(null);

  const [dayForm, setDayForm] = useState({
    title: "",
    date: "",
  });

  const [activityForm, setActivityForm] = useState({
    title: "",
    time: "",
    location: "",
    notes: "",
  });

  // ==========================================================
  // GET PLANNER
  // ==========================================================

  const fetchPlanner = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPlanner(data.planner);
    } catch (error) {
      console.error("Fetch planner error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanner();
  }, [id]);

  // ==========================================================
  // ADD DAY
  // ==========================================================

  const addDay = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${id}/days`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(dayForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPlanner(data.planner);

      setShowDayModal(false);

      setDayForm({
        title: "",
        date: "",
      });
    } catch (error) {
      console.error("Add day error:", error);
      alert(error.message);
    }
  };

  // ==========================================================
  // DELETE DAY
  // ==========================================================

  const deleteDay = async (dayId) => {
    if (!window.confirm("Delete this day?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${id}/days/${dayId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPlanner(data.planner);
    } catch (error) {
      console.error("Delete day error:", error);
      alert(error.message);
    }
  };

  // ==========================================================
  // ADD ACTIVITY
  // ==========================================================

  const addActivity = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${id}/days/${selectedDay._id}/activities`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(activityForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchPlanner();

      setShowActivityModal(false);

      setActivityForm({
        title: "",
        time: "",
        location: "",
        notes: "",
      });
    } catch (error) {
      console.error("Add activity error:", error);
      alert(error.message);
    }
  };

  // ==========================================================
  // TOGGLE ACTIVITY
  // ==========================================================

  const toggleActivity = async (
    dayId,
    activity
  ) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${id}/days/${dayId}/activities/${activity._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            completed: !activity.completed,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      await fetchPlanner();
    } catch (error) {
      console.error("Toggle activity error:", error);
      alert(error.message);
    }
  };

  // ==========================================================
  // DELETE ACTIVITY
  // ==========================================================

  const deleteActivity = async (
    dayId,
    activityId
  ) => {
    if (!window.confirm("Delete this activity?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${id}/days/${dayId}/activities/${activityId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPlanner(data.planner);
    } catch (error) {
      console.error("Delete activity error:", error);
      alert(error.message);
    }
  };

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const allActivities =
    planner?.days?.flatMap(
      (day) => day.activities || []
    ) || [];

  const completedActivities =
    allActivities.filter(
      (activity) => activity.completed
    ).length;

  const progress =
    allActivities.length > 0
      ? Math.round(
          (completedActivities /
            allActivities.length) *
            100
        )
      : 0;

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F7]">
        <FeaturesNavbar />

        <div className="text-center py-20 text-[#8A6875]">
          Loading planner...
        </div>
      </div>
    );
  }

  if (!planner) {
    return (
      <div className="min-h-screen bg-[#FFF9F7]">
        <FeaturesNavbar />

        <div className="text-center py-20">
          <h2 className="text-2xl font-serif">
            Planner not found
          </h2>

          <button
            onClick={() => navigate("/planner")}
            className="mt-5 text-[#B76E79]"
          >
            ← Back to Planner
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7]  text-[#4A1838]">

      <FeaturesNavbar />

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* BACK */}

        <button
          onClick={() => navigate("/planner")}
          className="text-sm text-[#B76E79] mb-8 hover:text-[#4A1838]"
        >
          ← Back to My Planner
        </button>

        {/* HEADER */}

        <div className="
          bg-white
          rounded-3xl
          border
          border-[#E8D8D2]
          p-8
          shadow-sm
          mb-10
        ">

          <div className="flex flex-col md:flex-row md:justify-between gap-6">

            <div>

              <p className="text-[#B76E79] text-sm uppercase tracking-widest">
                {planner.type}
              </p>

              <h1 className="text-4xl font-serif font-semibold text-[#4A2438] mt-2">
                {planner.title} ✨
              </h1>

              {planner.location && (
                <p className="text-[#8A6875] mt-3">
                  📍 {planner.location}
                </p>
              )}

              {planner.description && (
                <p className="text-[#8A6875] mt-2 max-w-xl">
                  {planner.description}
                </p>
              )}

            </div>

            <div className="min-w-[200px]">

              <div className="flex justify-between text-sm mb-2">

                <span>
                  {completedActivities} /{" "}
                  {allActivities.length} completed
                </span>

                <span className="text-[#B76E79]">
                  {progress}%
                </span>

              </div>

              <div className="h-3 bg-[#F3E7E8] rounded-full overflow-hidden">

                <div
                  className="h-full bg-[#B76E79] transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* DAYS HEADER */}

        <div className="flex justify-between items-center mb-6">

          <div>

            <h2 className="text-2xl font-serif font-semibold">
              Your Itinerary
            </h2>

            <p className="text-sm text-[#8A6875] mt-1">
              Organize your plans day by day.
            </p>

          </div>

          <button
            onClick={() => setShowDayModal(true)}
            className="
              bg-[#4A1838]
              text-white
              px-5
              py-2.5
              rounded-full
              hover:bg-[#6B2850]
            "
          >
            + Add Day
          </button>

        </div>

        {/* NO DAYS */}

        {planner.days?.length === 0 && (
          <div className="
            bg-white
            border
            border-[#E8D8D2]
            rounded-3xl
            p-12
            text-center
          ">

            <div className="text-5xl mb-4">
              📅
            </div>

            <h3 className="text-xl font-serif">
              No days added yet
            </h3>

            <p className="text-sm text-[#8A6875] mt-2">
              Add your first day to start building your itinerary.
            </p>

          </div>
        )}

        {/* DAYS */}

        <div className="space-y-8">

          {planner.days?.map((day, index) => (

            <div
              key={day._id}
              className="
                bg-white
                border
                border-[#E8D8D2]
                rounded-3xl
                p-7
                shadow-sm
              "
            >

              {/* DAY HEADER */}

              <div className="flex justify-between items-start mb-6">

                <div>

                  <p className="text-xs text-[#B76E79] uppercase tracking-widest">
                    Day {index + 1}
                  </p>

                  <h3 className="text-2xl font-serif font-semibold mt-1">
                    {day.title}
                  </h3>

                  {day.date && (
                    <p className="text-sm text-[#8A6875] mt-1">
                      {new Date(day.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  )}

                </div>

                <button
                  onClick={() => deleteDay(day._id)}
                  className="text-[#B76E79] hover:text-red-500"
                >
                  Delete
                </button>

              </div>

              {/* ACTIVITIES */}

              <div className="space-y-3">

                {day.activities?.length === 0 && (
                  <p className="text-sm text-[#9B818B] py-3">
                    No activities yet.
                  </p>
                )}

                {day.activities?.map((activity) => (

                  <div
                    key={activity._id}
                    className="
                      flex
                      items-center
                      gap-4
                      p-4
                      rounded-2xl
                      bg-[#FFF9F7]
                      border
                      border-[#F0E2DF]
                      group
                    "
                  >

                    {/* CHECKBOX */}

                    <button
                      onClick={() =>
                        toggleActivity(
                          day._id,
                          activity
                        )
                      }
                      className={`
                        w-7
                        h-7
                        rounded-full
                        border-2
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                        ${
                          activity.completed
                            ? "bg-[#B76E79] border-[#B76E79] text-white"
                            : "border-[#B76E79]"
                        }
                      `}
                    >
                      {activity.completed && "✓"}
                    </button>

                    {/* ACTIVITY */}

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h4
                          className={`
                            font-medium
                            ${
                              activity.completed
                                ? "line-through opacity-50"
                                : ""
                            }
                          `}
                        >
                          {activity.title}
                        </h4>

                        {activity.time && (
                          <span className="text-xs text-[#B76E79]">
                            🕐 {activity.time}
                          </span>
                        )}

                      </div>

                      {activity.location && (
                        <p className="text-xs text-[#8A6875] mt-1">
                          📍 {activity.location}
                        </p>
                      )}

                      {activity.notes && (
                        <p className="text-xs text-[#9B818B] mt-1">
                          {activity.notes}
                        </p>
                      )}

                    </div>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        deleteActivity(
                          day._id,
                          activity._id
                        )
                      }
                      className="
                        opacity-0
                        group-hover:opacity-100
                        text-[#B76E79]
                        hover:text-red-500
                      "
                    >
                      ×
                    </button>

                  </div>

                ))}

              </div>

              {/* ADD ACTIVITY */}

              <button
                onClick={() => {
                  setSelectedDay(day);
                  setShowActivityModal(true);
                }}
                className="
                  mt-5
                  text-sm
                  text-[#B76E79]
                  hover:text-[#4A1838]
                "
              >
                + Add Activity
              </button>

            </div>

          ))}

        </div>

      </main>

      {/* ======================================================
          ADD DAY MODAL
      ====================================================== */}

      {showDayModal && (
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
            rounded-3xl
            p-8
            w-full
            max-w-md
          ">

            <div className="flex justify-between mb-6">

              <h2 className="text-2xl font-serif">
                Add a Day 📅
              </h2>

              <button
                onClick={() => setShowDayModal(false)}
                className="text-2xl text-[#B76E79]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={addDay}
              className="space-y-5"
            >

              <div>

                <label className="block text-sm mb-2">
                  Day Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Arrival & Beach Day"
                  value={dayForm.title}
                  onChange={(e) =>
                    setDayForm({
                      ...dayForm,
                      title: e.target.value,
                    })
                  }
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
                  "
                />

              </div>

              <div>

                <label className="block text-sm mb-2">
                  Date
                </label>

                <input
                  type="date"
                  value={dayForm.date}
                  onChange={(e) =>
                    setDayForm({
                      ...dayForm,
                      date: e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    border-[#E8D8D2]
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:border-[#B76E79]
                  "
                />

              </div>

              <button
                type="submit"
                className="
                  w-full
                  bg-[#4A1838]
                  text-white
                  py-3
                  rounded-full
                "
              >
                Add Day
              </button>

            </form>

          </div>

        </div>
      )}

      {/* ======================================================
          ADD ACTIVITY MODAL
      ====================================================== */}

      {showActivityModal && (
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
            rounded-3xl
            p-8
            w-full
            max-w-md
          ">

            <div className="flex justify-between mb-6">

              <div>

                <h2 className="text-2xl font-serif">
                  Add Activity ✨
                </h2>

                <p className="text-xs text-[#8A6875] mt-1">
                  {selectedDay?.title}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowActivityModal(false)
                }
                className="text-2xl text-[#B76E79]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={addActivity}
              className="space-y-4"
            >

              <input
                type="text"
                placeholder="Activity name"
                value={activityForm.title}
                onChange={(e) =>
                  setActivityForm({
                    ...activityForm,
                    title: e.target.value,
                  })
                }
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
                "
              />

              <input
                type="text"
                placeholder="Time e.g. 09:00 AM"
                value={activityForm.time}
                onChange={(e) =>
                  setActivityForm({
                    ...activityForm,
                    time: e.target.value,
                  })
                }
                className="
                  w-full
                  border
                  border-[#E8D8D2]
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-[#B76E79]
                "
              />

              <input
                type="text"
                placeholder="Location"
                value={activityForm.location}
                onChange={(e) =>
                  setActivityForm({
                    ...activityForm,
                    location: e.target.value,
                  })
                }
                className="
                  w-full
                  border
                  border-[#E8D8D2]
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-[#B76E79]
                "
              />

              <textarea
                placeholder="Notes"
                rows="3"
                value={activityForm.notes}
                onChange={(e) =>
                  setActivityForm({
                    ...activityForm,
                    notes: e.target.value,
                  })
                }
                className="
                  w-full
                  border
                  border-[#E8D8D2]
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:border-[#B76E79]
                  resize-none
                "
              />

              <button
                type="submit"
                className="
                  w-full
                  bg-[#4A1838]
                  text-white
                  py-3
                  rounded-full
                "
              >
                Add Activity
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default PlannerDetails;