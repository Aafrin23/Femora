import React from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/scrolltoTop";
import ThemeProvider from "./components/themeprovider";

import Home from "./pages/Home";
import PlannerDetails from "./pages/plannerdetails.jsx";
import Wellness from "./pages/wellness.jsx";

import HormonalHealth from "./pages/hormonalhealth.jsx";
import Goals from "./pages/goals.jsx";
import Journal from "./pages/journal.jsx";
import Planner from "./pages/planner.jsx";

import Dashboard from "./pages/dashboard.jsx";
import Community from "./pages/community.jsx";
import Inspiration from "./pages/inspiration.jsx";
import Learning from "./pages/learning.jsx";
import Profile from "./pages/profile.jsx";
import Settings from "./pages/settings.jsx";
import ScrollToTopOnRouteChange from "./components/scrolltotoponroute.jsx";

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
        <ScrollToTopOnRouteChange />
      <Routes>
        
        <Route path="/" element={<Home />} />

        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/signin" element={<Signin />} /> */}

        <Route path="/wellness" element={<Wellness />} />
        {/* <Route path="/fashion" element={<Fashion />} /> */}
        <Route
          path="/hormonalhealth"
          element={<HormonalHealth />}
        />
        <Route path="/goaltracker" element={<Goals />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/planner" element={<Planner />} />
        <Route
          path="/planner/:id"
          element={<PlannerDetails />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/beauty" element={<Beauty />} /> */}
        <Route path="/community" element={<Community />} />
        <Route
          path="/inspirationhub"
          element={<Inspiration />}
        />
        <Route
          path="/learninghub"
          element={<Learning />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;