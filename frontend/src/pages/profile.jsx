import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Calendar,
  Pencil,
  Save,
  X,
  ArrowLeft,
  Sparkles,
  Target,
  BookOpen,
  Heart,
  Users,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

import FeaturesNavbar from "../components/featuresnavbar.jsx";

const API_URL = "http://localhost:5000/api/auth";

function Profile() {
  const navigate = useNavigate();

  // ==========================================================
  // STATES
  // ==========================================================

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // ==========================================================
  // FETCH PROFILE
  // ==========================================================

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load profile."
        );
      }

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        age: data.user.age || "",
        email: data.user.email || "",
      });

      // Keep localStorage synchronized
      localStorage.setItem("name", data.user.name);

      localStorage.setItem(
        "age",
        data.user.age
      );
    } catch (error) {
      console.error("Profile fetch error:", error);

      if (error.message.toLowerCase().includes("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("age");

        navigate("/");
        return;
      }

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (
      Number(formData.age) < 13 ||
      Number(formData.age) > 100
    ) {
      alert("Age must be between 13 and 100.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            age: Number(formData.age),
            email: formData.email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      setUser(data.user);

      setFormData({
        name: data.user.name,
        age: data.user.age,
        email: data.user.email,
      });

      // Update localStorage
      localStorage.setItem(
        "name",
        data.user.name
      );

      localStorage.setItem(
        "age",
        data.user.age
      );

      setEditing(false);

      alert("Profile updated successfully ✨");
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // CANCEL EDIT
  // ==========================================================

  const handleCancel = () => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      age: user.age || "",
      email: user.email || "",
    });

    setEditing(false);
  };

  // ==========================================================
  // MEMBER SINCE
  // ==========================================================

  const getMemberSince = () => {
    if (!user?.createdAt) {
      return "Femora Member";
    }

    const date = new Date(user.createdAt);

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F7]">
        <FeaturesNavbar />

        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">

            <div className="w-14 h-14 mx-auto rounded-full bg-[#F8E6EC] flex items-center justify-center animate-pulse">

              <Sparkles
                size={25}
                className="text-[#B76E79]"
              />

            </div>

            <p className="mt-4 text-[#806275]">
              Loading your Femora profile...
            </p>

          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstLetter =
    user.name?.charAt(0)?.toUpperCase() || "U";

  // ==========================================================
  // QUICK LINKS
  // ==========================================================

  const quickLinks = [
    {
      title: "Wellness",
      description: "Take care of your wellbeing",
      icon: Heart,
      path: "/wellness",
    },
    {
      title: "Goals",
      description: "Track your personal goals",
      icon: Target,
      path: "/goaltracker",
    },
    {
      title: "Journal",
      description: "Reflect on your journey",
      icon: BookOpen,
      path: "/journal",
    },
    {
      title: "Community",
      description: "Connect with the Femora community",
      icon: Users,
      path: "/community",
    },
  ];

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838]">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <FeaturesNavbar />

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">

        {/* ====================================================
            BACK
        ==================================================== */}

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#B76E79] hover:text-[#4A1838] transition mb-7"
        >
          <ArrowLeft size={17} />

          Back to Dashboard
        </button>

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <div className="mb-8">

          <p className="text-sm text-[#B76E79] font-semibold mb-2">
            Femora ✨
          </p>

          <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#4A1838]">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2 max-w-2xl">
            Your personal space in Femora. Manage your
            information and keep track of your journey.
          </p>

        </div>

        {/* ====================================================
            PROFILE HERO
        ==================================================== */}

        <section className="bg-white rounded-[2rem] border border-[#F0DDE5] shadow-sm overflow-hidden">

          {/* COVER */}

          <div className="relative h-40 md:h-48 bg-gradient-to-r from-[#B76E79] via-[#D28E9A] to-[#E8C3CB] overflow-hidden">

            {/* Decorative circles */}

            <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-white/10" />

            <div className="absolute -bottom-20 right-10 w-56 h-56 rounded-full bg-white/10" />

            {/* Decorations */}

            <span className="absolute top-7 left-10 text-3xl opacity-70">
              ✨
            </span>

            <span className="absolute top-10 right-16 text-3xl opacity-60">
              ♡
            </span>

            <span className="absolute bottom-7 right-8 text-3xl opacity-70">
              🌸
            </span>

            <span className="absolute bottom-8 left-1/3 text-xl opacity-50">
              ✦
            </span>

          </div>

          {/* PROFILE CONTENT */}

          <div className="px-6 md:px-10 pb-8">

            {/* TOP ROW */}

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

              {/* AVATAR */}

              <div className="-mt-14 relative">

                <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-lg">

                  <div className="w-full h-full rounded-full bg-[#F8E6EC] flex items-center justify-center border border-[#E8CBD5]">

                    <span className="text-5xl font-semibold text-[#B76E79]">
                      {firstLetter}
                    </span>

                  </div>

                </div>

                {/* ONLINE DOT */}

                <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-[#B76E79] border-4 border-white" />

              </div>

              {/* ACTION BUTTONS */}

              {!editing ? (

                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4A1838] text-white font-semibold hover:bg-[#64234D] transition shadow-sm"
                >
                  <Pencil size={17} />

                  Edit Profile
                </button>

              ) : (

                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#E8D8D2] text-[#6F5361] hover:bg-[#FFF9F7] transition"
                  >
                    <X size={17} />

                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#B76E79] text-white font-semibold hover:bg-[#9F5966] transition disabled:opacity-60"
                  >
                    <Save size={17} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              )}

            </div>

            {/* USER INFO */}

            <div className="mt-5">

              <h2 className="text-2xl md:text-3xl font-bold text-[#4A1838]">
                {user.name} 🌸
              </h2>

              <p className="text-[#927386] mt-1">
                Femora Member
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[#806275]">

                <div className="flex items-center gap-2">
                  <Calendar size={15} />

                  Joined {getMemberSince()}
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles size={15} />

                  Own Your Glow ✨
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================================
            PROFILE OVERVIEW
        ==================================================== */}

        <section className="mt-7">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl md:text-2xl font-bold">
                Your Femora Journey
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Keep growing, reflecting and becoming your best self.
              </p>

            </div>

            <Sparkles
              size={24}
              className="text-[#B76E79]"
            />

          </div>

          {/* JOURNEY CARDS */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* WELLNESS */}

            <button
              onClick={() => navigate("/wellness")}
              className="bg-white rounded-2xl border border-[#F0DDE5] p-5 text-left hover:-translate-y-1 hover:shadow-md transition"
            >

              <div className="w-11 h-11 rounded-xl bg-[#F8E6EC] flex items-center justify-center text-[#B76E79]">
                <Heart size={21} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Wellness
              </p>

              <h3 className="font-bold text-lg mt-1">
                Your Wellbeing
              </h3>

            </button>

            {/* GOALS */}

            <button
              onClick={() => navigate("/goaltracker")}
              className="bg-white rounded-2xl border border-[#F0DDE5] p-5 text-left hover:-translate-y-1 hover:shadow-md transition"
            >

              <div className="w-11 h-11 rounded-xl bg-[#F8E6EC] flex items-center justify-center text-[#B76E79]">
                <Target size={21} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Goals
              </p>

              <h3 className="font-bold text-lg mt-1">
                Your Goals
              </h3>

            </button>

            {/* JOURNAL */}

            <button
              onClick={() => navigate("/journal")}
              className="bg-white rounded-2xl border border-[#F0DDE5] p-5 text-left hover:-translate-y-1 hover:shadow-md transition"
            >

              <div className="w-11 h-11 rounded-xl bg-[#F8E6EC] flex items-center justify-center text-[#B76E79]">
                <BookOpen size={21} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Journal
              </p>

              <h3 className="font-bold text-lg mt-1">
                Your Thoughts
              </h3>

            </button>

            {/* COMMUNITY */}

            <button
              onClick={() => navigate("/community")}
              className="bg-white rounded-2xl border border-[#F0DDE5] p-5 text-left hover:-translate-y-1 hover:shadow-md transition"
            >

              <div className="w-11 h-11 rounded-xl bg-[#F8E6EC] flex items-center justify-center text-[#B76E79]">
                <Users size={21} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Community
              </p>

              <h3 className="font-bold text-lg mt-1">
                Your Space
              </h3>

            </button>

          </div>

        </section>

        {/* ====================================================
            PERSONAL INFORMATION
        ==================================================== */}

        <section className="mt-8 bg-white rounded-[2rem] border border-[#F0DDE5] shadow-sm p-6 md:p-9">

          {/* SECTION HEADER */}

          <div className="flex items-center gap-4 mb-8">

            <div className="w-12 h-12 rounded-2xl bg-[#F8E6EC] flex items-center justify-center text-[#B76E79]">
              <User size={22} />
            </div>

            <div>

              <h2 className="text-xl md:text-2xl font-bold">
                Personal Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your basic profile details
              </p>

            </div>

          </div>

          {/* FORM GRID */}

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-7">

            {/* ==================================================
                NAME
            ================================================== */}

            <div>

              <label className="text-sm font-semibold">
                Full Name
              </label>

              {editing ? (

                <div className="relative mt-2">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B76E79]"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FFF9F7] border border-[#E8D8E2] outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 transition"
                  />

                </div>

              ) : (

                <div className="mt-2 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#FFF9F7] border border-[#F2E5E8]">

                  <User
                    size={18}
                    className="text-[#B76E79]"
                  />

                  <span className="font-medium">
                    {user.name}
                  </span>

                </div>

              )}

            </div>

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div>

              <label className="text-sm font-semibold">
                Email Address
              </label>

              {editing ? (

                <div className="relative mt-2">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B76E79]"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FFF9F7] border border-[#E8D8E2] outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 transition"
                  />

                </div>

              ) : (

                <div className="mt-2 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#FFF9F7] border border-[#F2E5E8]">

                  <Mail
                    size={18}
                    className="text-[#B76E79]"
                  />

                  <span className="font-medium break-all">
                    {user.email}
                  </span>

                </div>

              )}

            </div>

            {/* ==================================================
                AGE
            ================================================== */}

            <div>

              <label className="text-sm font-semibold">
                Age
              </label>

              {editing ? (

                <div className="relative mt-2">

                  <Calendar
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B76E79]"
                  />

                  <input
                    type="number"
                    name="age"
                    min="13"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FFF9F7] border border-[#E8D8E2] outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 transition"
                  />

                </div>

              ) : (

                <div className="mt-2 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#FFF9F7] border border-[#F2E5E8]">

                  <Calendar
                    size={18}
                    className="text-[#B76E79]"
                  />

                  <span className="font-medium">
                    {user.age} years old
                  </span>

                </div>

              )}

            </div>

            {/* ==================================================
                MEMBER SINCE
            ================================================== */}

            <div>

              <label className="text-sm font-semibold">
                Member Since
              </label>

              <div className="mt-2 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#FFF9F7] border border-[#F2E5E8]">

                <Sparkles
                  size={18}
                  className="text-[#B76E79]"
                />

                <span className="font-medium">
                  {getMemberSince()}
                </span>

              </div>

            </div>

          </div>

          {/* EDIT HINT */}

          {!editing && (

            <div className="mt-7 pt-6 border-t border-[#F3E6EA] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-full bg-[#FFF0F3] flex items-center justify-center">
                  ✨
                </div>

                <p className="text-sm text-gray-500">
                  Want to update your information?
                </p>

              </div>

              <button
                onClick={() => setEditing(true)}
                className="text-sm font-semibold text-[#B76E79] hover:text-[#4A1838] transition"
              >
                Edit your profile →
              </button>

            </div>

          )}

        </section>

        {/* ====================================================
            QUICK ACCESS
        ==================================================== */}

        <section className="mt-8">

          <div className="mb-5">

            <h2 className="text-xl md:text-2xl font-bold">
              Explore Femora
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Continue your journey from wherever you are.
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {quickLinks.map((item) => {

              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  onClick={() =>
                    navigate(item.path)
                  }
                  className="group bg-white border border-[#F0DDE5] rounded-2xl p-5 flex items-center gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition"
                >

                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F8E6EC] flex items-center justify-center text-[#B76E79] group-hover:bg-[#B76E79] group-hover:text-white transition">

                    <Icon size={21} />

                  </div>

                  <div className="flex-1">

                    <h3 className="font-bold">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.description}
                    </p>

                  </div>

                  <ChevronRight
                    size={19}
                    className="text-[#B76E79] group-hover:translate-x-1 transition"
                  />

                </button>
              );

            })}

          </div>

        </section>

        {/* ====================================================
            BOTTOM FEMORA MESSAGE
        ==================================================== */}

        <section className="mt-8 mb-5 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4A1838] via-[#5B2447] to-[#713052] p-7 md:p-9 text-white">

          {/* Decorative */}

          <div className="absolute -right-10 -top-16 text-[150px] opacity-[0.06]">
            🌸
          </div>

          <div className="absolute -left-8 -bottom-16 text-[130px] opacity-[0.05]">
            ✨
          </div>

          <div className="relative z-10 max-w-2xl">

            <div className="flex items-center gap-2 text-[#F4C8D2]">

              <Sparkles size={19} />

              <span className="text-sm font-semibold">
                Your Femora Space
              </span>

            </div>

            <h2 className="text-2xl md:text-3xl font-bold mt-3">
              Keep becoming the Person you want to be. 🌸
            </h2>

            <p className="text-white/70 mt-3 leading-relaxed">
              Track your wellness, build healthy habits,
              work toward your goals, reflect through
              journaling and connect with your community.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 px-6 py-3 rounded-xl bg-white text-[#4A1838] font-semibold hover:bg-[#FFF1F4] transition"
            >
              Continue Your Journey
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;