
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import FemoraAI from "./FemoraAI/femoraAi";

function FeaturesNavbar() {
  const [aiOpen, setAiOpen] = useState(false);
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };

  // Navigation link styling
  const navLinkClass = ({ isActive }) =>
    `pb-1 transition-all duration-200 ${
      isActive
        ? "text-primary font-semibold border-b-2 border-primary"
        : "text-gray-700 hover:text-primary"
    }`;

  return (
    <>
      {/* ================= NAVBAR ================= */}
     
<div className="navbar bg-gradient-to-r from-[#FFF9F7] via-[#FFF0F3] to-[#F8EDF3] shadow-sm px-6 sticky top-0 z-50">
        {/* ================= LEFT - LOGO ================= */}
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-3">

            {/* Logo */}
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
              <img
                src={logo}
                alt="Femora Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Brand */}
            <div>
              <h1 className="text-2xl font-bold text-primary font-serif italic">
                Femora
              </h1>

              <p className="text-xs text-gray-500 italic">
                Own Your Glow ✨
              </p>
            </div>

          </Link>
        </div>

        {/* ================= CENTER - NAVIGATION ================= */}
        <div className="navbar-center hidden lg:flex">

          <ul className="menu menu-horizontal gap-5 font-medium">

            {/* Wellness */}
            <li>
              <NavLink
                to="/wellness"
                className={navLinkClass}
              >
                ❤️ Wellness
              </NavLink>
            </li>

            {/* Beauty
            <li>
              <NavLink
                to="/beauty"
                className={navLinkClass}
              >
                💄 Beauty
              </NavLink>
            </li>

             Fashion 
            <li>
              <NavLink
                to="/fashion"
                className={navLinkClass}
              >
                👗 Fashion
              </NavLink>
            </li> */}
             

            {/* Planner */}
            <li>
              <NavLink
                to="/planner"
                className={navLinkClass}
              >
                📅 Planner
              </NavLink>
            </li>

            {/* Journal */}
            <li>
              <NavLink
                to="/journal"
                className={navLinkClass}
              >
                📝 Journal
              </NavLink>
            </li>
            {/* Community */}
                  <li>
                    <NavLink
                      to="/community"
                      className={navLinkClass}
                    >
                      🤝 Community
                    </NavLink>
                  </li>

            {/* MORE DROPDOWN ================= */}
            <li>
              <details>

                <summary className="cursor-pointer hover:text-primary">
                  More
                </summary>

                <ul className="p-2 bg-base-100 rounded-box shadow-lg w-60 z-50">

                  {/* Hormonal Health */}
                  <li>
                    <NavLink
                      to="/hormonalhealth"
                      className={navLinkClass}
                    >
                      🌸 Hormonal Health
                    </NavLink>
                  </li>

                  {/* Inspiration Hub */}
                  <li>
                    <NavLink
                      to="/inspirationhub"
                      className={navLinkClass}
                    >
                      ✨ Inspiration Hub
                    </NavLink>
                  </li>

                  {/* Learning Hub */}
                  <li>
                    <NavLink
                      to="/learninghub"
                      className={navLinkClass}
                    >
                      📚 Learning Hub
                    </NavLink>
                  </li>

                  {/* Goal Tracker */}
                  <li>
                    <NavLink
                      to="/goaltracker"
                      className={navLinkClass}
                    >
                      🎯 Goal Tracker
                    </NavLink>
                  </li>

                 

                </ul>

              </details>
            </li>

          </ul>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="navbar-end flex items-center gap-3">
        <button
  onClick={() => navigate("/dashboard")}
  className="btn btn-ghost btn-circle text-[#B76E79] hover:bg-[#B76E79] hover:text-white transition"
  title="Home"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.954a1.125 1.125 0 0 1 1.592 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125h4.125v-6.75h4.5V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
    />
  </svg>
</button>
          {/* ================= AI ASSISTANT ================= */}
          <button
            onClick={() => setAiOpen(true)}
            className="btn btn-outline border-[#B76E79] text-[#B76E79] hover:bg-[#B76E79] hover:text-white"
          >
            🤖 AI Assistant
          </button>

          {/* ================= PROFILE DROPDOWN ================= */}
          <div className="dropdown dropdown-end">

            {/* Profile Avatar */}
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar placeholder"
            >
             <div className="w-10 h-10 rounded-full border border-[#B76E79] text-[#B76E79] flex items-center justify-center hover:bg-[#B76E79] hover:text-white">
  👤
</div>

              
            </div>

            {/* Dropdown Menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-[100]"
            >

              

              {/* Profile */}
              <li>
                <Link to="/profile">
                  👤 My Profile
                </Link>
              </li>

              {/* Settings 
              <li>
                <Link to="/settings">
                  ⚙️ Settings
                </Link>
              </li>*/}

              {/* Divider */}
              <li className="my-1">
                <div className="border-t border-gray-200 w-full p-0"></div>
              </li>

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </li>

            </ul>

          </div>

        </div>

      </div>

      {/* ================= FEMORA AI ================= */}
      <FemoraAI
        isOpen={aiOpen}
        setIsOpen={setAiOpen}
      />
    </>
  );
}

export default FeaturesNavbar;

