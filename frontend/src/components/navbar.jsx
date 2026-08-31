import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();

  const [name, setName] = useState(
    localStorage.getItem("name")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    setName(null);

    // Go back to Home after logout
    navigate("/");
  };

  return (
    <div className="navbar bg-base-200 shadow-md px-6 sticky top-0 z-50">

      {/* LEFT SIDE - LOGO + BRAND */}
      <div className="flex-1">

        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-bold text-primary"
        >

          {/* Logo */}
          <div className="w-13 h-13 rounded-full overflow-hidden shadow-md flex items-center justify-center">

            <img
              src={logo}
              alt="Femora Logo"
              className="w-full h-full object-cover"
            />

          </div>

          {/* Brand Name */}
          <span className="font-serif italic">
            Femora
          </span>

        </Link>

      </div>



    </div>
  );
}

export default Navbar;