
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/User.js";
import logo from "../assets/logo.png";

function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");

    setFormData({
      name: "",
      age: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // SIGN UP
    // =========================
    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (formData.age < 13 || formData.age > 100) {
        alert("Please enter a valid age between 13 and 100");
        return;
      }

      try {
        const response = await API.post("/auth/register", {
          name: formData.name,
          age: Number(formData.age),
          email: formData.email,
          password: formData.password,
        });

        alert(response.data.message);

        // After registration, switch popup to Login
        setMode("login");

        setFormData({
          name: "",
          age: "",
          email: formData.email,
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Registration failed"
        );
      }

      return;
    }

    // =========================
    // LOGIN
    // =========================
    try {
      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save user's name for Dashboard
      if (response.data.user?.name) {
        localStorage.setItem(
          "name",
          response.data.user.name
        );
      }

      // Save user's age for Wellness
      if (response.data.user?.age) {
        localStorage.setItem(
          "age",
          response.data.user.age
        );
      }

      alert(response.data.message);

      onClose();

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#4A1838]/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Popup */}
      <div
        className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Top decorative section */}
        <div className="h-20 bg-gradient-to-r from-[#B76E79] to-[#D99AA4] relative">

          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <img
              src={logo}
              alt="Femora"
              className="w-28 h-auto object-contain"
            />
          </div>

        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/30 text-white hover:bg-white hover:text-[#4A1838] transition flex items-center justify-center"
        >
          ✕
        </button>

        {/* Content */}
        <div className="px-7 pb-7 pt-12">

          {/* Heading */}
          <div className="text-center mb-6">

            <h2 className="text-2xl font-bold text-[#4A1838]">
              {mode === "login"
                ? "Welcome Back 💕"
                : "Join Femora 🌸"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {mode === "login"
                ? "Continue your Femora journey"
                : "Start your journey with Femora"}
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Name */}
            {mode === "signup" && (
              <div className="mb-3">

                <label className="block text-sm font-medium text-[#4A1838] mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="input input-bordered w-full h-11 rounded-xl focus:outline-none focus:border-[#B76E79]"
                />

              </div>
            )}

            {/* Age */}
            {mode === "signup" && (
              <div className="mb-3">

                <label className="block text-sm font-medium text-[#4A1838] mb-1">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min="13"
                  max="100"
                  required
                  className="input input-bordered w-full h-11 rounded-xl focus:outline-none focus:border-[#B76E79]"
                />

              </div>
            )}

            {/* Email */}
            <div className="mb-3">

              <label className="block text-sm font-medium text-[#4A1838] mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="input input-bordered w-full h-11 rounded-xl focus:outline-none focus:border-[#B76E79]"
              />

            </div>

            {/* Password */}
            <div className="mb-3">

              <label className="block text-sm font-medium text-[#4A1838] mb-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="input input-bordered w-full h-11 rounded-xl focus:outline-none focus:border-[#B76E79]"
              />

            </div>

            {/* Confirm Password */}
            {mode === "signup" && (
              <div className="mb-4">

                <label className="block text-sm font-medium text-[#4A1838] mb-1">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="input input-bordered w-full h-11 rounded-xl focus:outline-none focus:border-[#B76E79]"
                />

              </div>
            )}

            {/* Forgot Password */}
            {mode === "login" && (
              <div className="flex justify-end mb-4">

                <button
                  type="button"
                  className="text-xs text-[#B76E79] hover:underline"
                >
                  Forgot Password?
                </button>

              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#B76E79] text-white font-semibold hover:bg-[#9F5966] transition shadow-sm"
            >
              {mode === "login"
                ? "Login 💕"
                : "Create Account ✨"}
            </button>

          </form>

          {/* Switch */}
          <div className="text-center mt-5 text-sm text-gray-500">

            {mode === "login" ? (
              <>
                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={switchMode}
                  className="font-semibold text-[#B76E79] hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}

                <button
                  type="button"
                  onClick={switchMode}
                  className="font-semibold text-[#B76E79] hover:underline"
                >
                  Login
                </button>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default AuthModal;

