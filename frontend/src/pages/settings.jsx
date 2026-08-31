
import React, { useEffect, useState } from "react";
import FeaturesNavbar from "../components/featuresnavbar";

import {
  Palette,
  ShieldCheck,
  Bot,
  Smartphone,
  AlertTriangle,
  Sun,
  Moon,
  Monitor,
  Lock,
  LogOut,
  Trash2,
  Sparkles,
  MessageCircle,
  Globe,
  Home,
  Heart,
  ChevronRight,
  Check,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/settings";

// ============================================================
// THEME HELPER
// ============================================================

const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  if (theme === "light") {
    root.classList.remove("dark");
    return;
  }

  // SYSTEM THEME
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  root.classList.toggle("dark", prefersDark);
};

// ============================================================
// SETTINGS PAGE
// ============================================================

function Settings() {
  // ============================================================
  // STATES
  // ============================================================

  const [activeSection, setActiveSection] =
    useState("appearance");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Appearance
  const [theme, setTheme] = useState("light");

  // Privacy
  const [accountPrivacy, setAccountPrivacy] =
    useState("private");

  // AI
  const [aiEnabled, setAiEnabled] = useState(true);
  const [personalizedAI, setPersonalizedAI] =
    useState(true);

  // Preferences
  const [language, setLanguage] = useState("English");
  const [landingPage, setLandingPage] =
    useState("Dashboard");

  const [motivationalMessages, setMotivationalMessages] =
    useState(true);

  const [autoSave, setAutoSave] = useState(true);

  // Delete account
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [deleting, setDeleting] = useState(false);

  // ============================================================
  // TOKEN
  // ============================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ============================================================
  // LOAD SETTINGS
  // ============================================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          setError("Please login to access settings.");
          setLoading(false);
          return;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load settings."
          );
        }

        const settings = data.settings || {};

        // ======================================================
        // THEME
        // ======================================================

        const currentTheme = settings.theme || "light";

        setTheme(currentTheme);

        // Save backend preference locally
        localStorage.setItem(
          "femoraTheme",
          currentTheme
        );

        // Apply theme immediately
        applyTheme(currentTheme);

        // ======================================================
        // PRIVACY
        // ======================================================

        setAccountPrivacy(
          settings.accountPrivacy || "private"
        );

        // ======================================================
        // AI
        // ======================================================

        setAiEnabled(
          settings.aiEnabled !== undefined
            ? settings.aiEnabled
            : true
        );

        setPersonalizedAI(
          settings.personalizedAI !== undefined
            ? settings.personalizedAI
            : true
        );

        // ======================================================
        // PREFERENCES
        // ======================================================

        setLanguage(
          settings.language || "English"
        );

        setLandingPage(
          settings.landingPage || "Dashboard"
        );

        setMotivationalMessages(
          settings.motivationalMessages !== undefined
            ? settings.motivationalMessages
            : true
        );

        setAutoSave(
          settings.autoSave !== undefined
            ? settings.autoSave
            : true
        );
      } catch (err) {
        console.error(
          "LOAD SETTINGS ERROR:",
          err
        );

        setError(
          err.message ||
            "Failed to load settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // ============================================================
  // APPLY THEME WHEN THEME STATE CHANGES
  // ============================================================

  useEffect(() => {
    if (!loading) {
      applyTheme(theme);
    }
  }, [theme, loading]);

  // ============================================================
  // SYSTEM THEME LISTENER
  // ============================================================

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemTheme = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemTheme
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemTheme
      );
    };
  }, [theme]);

  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again.");
        setSaving(false);
        return;
      }

      const settings = {
        theme,
        accountPrivacy,
        aiEnabled,
        personalizedAI,
        language,
        landingPage,
        motivationalMessages,
        autoSave,
      };

      const response = await fetch(API_URL, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save settings."
        );
      }

      // ========================================================
      // SAVE THEME LOCALLY + APPLY GLOBALLY
      // ========================================================

      localStorage.setItem(
        "femoraTheme",
        theme
      );

      applyTheme(theme);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error(
        "SAVE SETTINGS ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // THEME CHANGE
  // ============================================================

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);

    // Save immediately to localStorage
    localStorage.setItem(
      "femoraTheme",
      newTheme
    );

    // Apply immediately
    applyTheme(newTheme);

    setSaved(false);
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    window.location.href = "/login";
  };

  // ============================================================
  // DELETE ACCOUNT
  // ============================================================

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again.");
        setDeleting(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/account`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete account."
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("femoraTheme");

      window.location.href = "/login";
    } catch (err) {
      console.error(
        "DELETE ACCOUNT ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to delete account."
      );

      setDeleting(false);
    }
  };

  // ============================================================
  // TOGGLE COMPONENT
  // ============================================================

  const Toggle = ({
    enabled,
    onChange,
  }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-7 w-12 rounded-full transition-all duration-300 ${
          enabled
            ? "bg-[#4A1838]"
            : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    );
  };

  // ============================================================
  // SECTION HEADER
  // ============================================================

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
  }) => {
    return (
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F8E7EE] dark:bg-[#3A2633]">
          <Icon
            size={22}
            className="text-[#4A1838] dark:text-[#F8DDE8]"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#4A1838] dark:text-[#FFF9F7]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    );
  };

  // ============================================================
  // SAVE BUTTON
  // ============================================================

  const SaveButton = () => {
    return (
      <div className="flex justify-end border-t border-gray-100 pt-6 dark:border-[#49313F]">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[#4A1838] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#63234D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : saved
            ? "✓ Saved"
            : "Save Changes"}
        </button>
      </div>
    );
  };

  // ============================================================
  // APPEARANCE
  // ============================================================

  const renderAppearance = () => (
    <div>
      <SectionHeader
        icon={Palette}
        title="Appearance"
        description="Customize how Femora looks and feels."
      />

      <div>
        <h3 className="mb-1 font-medium text-[#4A1838] dark:text-[#FFF9F7]">
          Theme
        </h3>

        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Choose your preferred appearance for Femora.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              id: "light",
              title: "Light",
              description: "Clean and bright",
              icon: Sun,
              bg: "bg-[#FFF1E8] dark:bg-[#3A2633]",
            },
            {
              id: "dark",
              title: "Dark",
              description: "Easy on the eyes",
              icon: Moon,
              bg: "bg-[#F0E7EE] dark:bg-[#3A2633]",
            },
            {
              id: "system",
              title: "System",
              description: "Follow your device",
              icon: Monitor,
              bg: "bg-[#F3E9E5] dark:bg-[#3A2633]",
            },
          ].map((item) => {
            const Icon = item.icon;

            const selected =
              theme === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleThemeChange(item.id)
                }
                className={`rounded-2xl border p-5 text-left transition-all ${
                  selected
                    ? "border-[#4A1838] bg-[#FFF9F7] shadow-md dark:border-[#E5B6C8] dark:bg-[#2B1B25]"
                    : "border-gray-200 bg-white hover:border-[#D9B4C3] dark:border-[#49313F] dark:bg-[#261722] dark:hover:border-[#765064]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
                  >
                    <Icon
                      size={20}
                      className="text-[#4A1838] dark:text-[#F8DDE8]"
                    />
                  </div>

                  {selected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A1838]">
                      <Check
                        size={14}
                        className="text-white"
                      />
                    </div>
                  )}
                </div>

                <h4 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                  {item.title}
                </h4>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <SaveButton />
        </div>
      </div>
    </div>
  );

  // ============================================================
  // PRIVACY
  // ============================================================

  const renderPrivacy = () => (
    <div>
      <SectionHeader
        icon={ShieldCheck}
        title="Privacy & Security"
        description="Keep your Femora account secure."
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8E7EE] dark:bg-[#3A2633]">
              <Lock
                size={19}
                className="text-[#4A1838] dark:text-[#F8DDE8]"
              />
            </div>

            <div>
              <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                Change Password
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your account password.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-[#4A1838] hover:underline dark:text-[#F4BFD0]"
          >
            Change
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
            Account Privacy
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose who can view your community activity.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                id: "private",
                title: "Private",
                description:
                  "More control over your activity",
              },
              {
                id: "public",
                title: "Public",
                description:
                  "Let other members discover you",
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setAccountPrivacy(item.id)
                }
                className={`rounded-xl border p-4 text-left ${
                  accountPrivacy === item.id
                    ? "border-[#4A1838] bg-[#FFF9F7] dark:border-[#E5B6C8] dark:bg-[#2B1B25]"
                    : "border-gray-200 dark:border-[#49313F]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>

                  {accountPrivacy === item.id && (
                    <Check
                      size={18}
                      className="text-[#4A1838] dark:text-[#F4BFD0]"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-[#3A2633]">
              <LogOut
                size={19}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>

            <div>
              <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                Log Out
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign out from this account.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#4A1838] hover:bg-[#FFF9F7] dark:border-[#49313F] dark:text-[#F4BFD0] dark:hover:bg-[#33212D]"
          >
            Log Out
          </button>
        </div>

        <SaveButton />
      </div>
    </div>
  );

  // ============================================================
  // AI
  // ============================================================

  const renderAI = () => (
    <div>
      <SectionHeader
        icon={Bot}
        title="Femora AI"
        description="Manage your personal AI companion."
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8E7EE] dark:bg-[#3A2633]">
              <Sparkles
                size={20}
                className="text-[#4A1838] dark:text-[#F8DDE8]"
              />
            </div>

            <div>
              <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                Femora AI
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Allow Femora AI to assist you.
              </p>
            </div>
          </div>

          <Toggle
            enabled={aiEnabled}
            onChange={setAiEnabled}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1E8] dark:bg-[#3A2633]">
              <Heart
                size={20}
                className="text-[#4A1838] dark:text-[#F8DDE8]"
              />
            </div>

            <div>
              <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                Personalized Responses
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Let AI use your Femora preferences to
                personalize responses.
              </p>
            </div>
          </div>

          <Toggle
            enabled={personalizedAI}
            onChange={setPersonalizedAI}
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0E7EE] dark:bg-[#3A2633]">
              <MessageCircle
                size={20}
                className="text-[#4A1838] dark:text-[#F8DDE8]"
              />
            </div>

            <div>
              <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                Conversation History
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Clear your previous conversations with
                Femora AI.
              </p>

              <button
                type="button"
                className="mt-4 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#4A1838] hover:bg-[#FFF9F7] dark:border-[#49313F] dark:text-[#F4BFD0] dark:hover:bg-[#33212D]"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>

        <SaveButton />
      </div>
    </div>
  );

  // ============================================================
  // APP PREFERENCES
  // ============================================================

  const renderPreferences = () => (
    <div>
      <SectionHeader
        icon={Smartphone}
        title="App Preferences"
        description="Customize your everyday Femora experience."
      />

      <div className="space-y-5">
        {/* LANGUAGE */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <div className="mb-3 flex items-center gap-3">
            <Globe
              size={19}
              className="text-[#4A1838] dark:text-[#F8DDE8]"
            />

            <div>
              <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                Language
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose the language used by Femora.
              </p>
            </div>
          </div>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-[#FFF9F7] px-4 py-3 text-sm text-[#4A1838] outline-none focus:border-[#4A1838] dark:border-[#49313F] dark:bg-[#2B1B25] dark:text-white"
          >
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
          </select>
        </div>

        {/* LANDING PAGE */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <div className="mb-3 flex items-center gap-3">
            <Home
              size={19}
              className="text-[#4A1838] dark:text-[#F8DDE8]"
            />

            <div>
              <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                Default Landing Page
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose where Femora opens after login.
              </p>
            </div>
          </div>

          <select
            value={landingPage}
            onChange={(e) =>
              setLandingPage(e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-[#FFF9F7] px-4 py-3 text-sm text-[#4A1838] outline-none focus:border-[#4A1838] dark:border-[#49313F] dark:bg-[#2B1B25] dark:text-white"
          >
            <option>Dashboard</option>
            <option>Community</option>
            <option>Learning Hub</option>
            <option>Inspiration Hub</option>
          </select>
        </div>

        {/* MOTIVATIONAL */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E8] dark:bg-[#3A2633]">
              <Sparkles
                size={19}
                className="text-[#4A1838] dark:text-[#F8DDE8]"
              />
            </div>

            <div>
              <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                Motivational Messages
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show positive messages throughout your day.
              </p>
            </div>
          </div>

          <Toggle
            enabled={motivationalMessages}
            onChange={setMotivationalMessages}
          />
        </div>

        {/* AUTOSAVE */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#49313F] dark:bg-[#261722]">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E7EE] dark:bg-[#3A2633]">
              <Check
                size={19}
                className="text-[#4A1838] dark:text-[#F8DDE8]"
              />
            </div>

            <div>
              <h3 className="font-medium text-[#4A1838] dark:text-[#FFF9F7]">
                Auto Save
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically save your changes.
              </p>
            </div>
          </div>

          <Toggle
            enabled={autoSave}
            onChange={setAutoSave}
          />
        </div>

        <SaveButton />
      </div>
    </div>
  );

  // ============================================================
  // DANGER ZONE
  // ============================================================

  const renderDangerZone = () => (
    <div>
      <SectionHeader
        icon={AlertTriangle}
        title="Danger Zone"
        description="Actions that can permanently affect your account."
      />

      <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6 dark:border-red-900/50 dark:bg-red-950/20">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
            <Trash2
              size={20}
              className="text-red-600"
            />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-red-700 dark:text-red-400">
              Delete Account
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Permanently delete your Femora account and
              associated data. This action cannot be undone.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowDeleteModal(true)
              }
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // CONTENT
  // ============================================================

  const renderContent = () => {
    switch (activeSection) {
      case "appearance":
        return renderAppearance();

      case "privacy":
        return renderPrivacy();

      case "ai":
        return renderAI();

      case "preferences":
        return renderPreferences();

      case "danger":
        return renderDangerZone();

      default:
        return renderAppearance();
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F7] dark:bg-[#1B1017]">
        <FeaturesNavbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#EAD5DF] border-t-[#4A1838] dark:border-[#49313F] dark:border-t-[#E5B6C8]" />

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Loading your settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838] transition-colors duration-300 dark:bg-[#1B1017] dark:text-[#FFF9F7]">
      <FeaturesNavbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-[#8C6276] dark:text-[#B99AAA]">
            <span>Femora</span>

            <ChevronRight size={15} />

            <span>Settings</span>
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#4A1838] dark:text-[#FFF9F7] sm:text-5xl">
            Settings <span>⚙️</span>
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500 dark:text-gray-400">
            Personalize your Femora experience and manage
            your account preferences.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* SETTINGS LAYOUT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* SIDEBAR */}
          <aside className="h-fit rounded-3xl border border-[#F0E2E8] bg-white p-3 shadow-sm dark:border-[#49313F] dark:bg-[#261722] lg:sticky lg:top-28">
            <div className="mb-3 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9B7185] dark:text-[#B99AAA]">
                Settings
              </p>
            </div>

            <div className="space-y-1">
              {[
                {
                  id: "appearance",
                  title: "Appearance",
                  description:
                    "Customize how Femora looks",
                  icon: Palette,
                },
                {
                  id: "privacy",
                  title: "Privacy & Security",
                  description:
                    "Manage your account security",
                  icon: ShieldCheck,
                },
                {
                  id: "ai",
                  title: "Femora AI",
                  description:
                    "Manage your AI experience",
                  icon: Bot,
                },
                {
                  id: "preferences",
                  title: "App Preferences",
                  description:
                    "Customize your app experience",
                  icon: Smartphone,
                },
                {
                  id: "danger",
                  title: "Danger Zone",
                  description:
                    "Permanent account actions",
                  icon: AlertTriangle,
                },
              ].map((item) => {
                const Icon = item.icon;

                const active =
                  activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setActiveSection(item.id)
                    }
                    className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all ${
                      active
                        ? item.id === "danger"
                          ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          : "bg-[#F8E7EE] text-[#4A1838] dark:bg-[#3A2633] dark:text-[#FFF9F7]"
                        : "text-gray-600 hover:bg-[#FFF9F7] dark:text-gray-400 dark:hover:bg-[#33212D]"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        active
                          ? item.id === "danger"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-white dark:bg-[#261722]"
                          : "bg-gray-50 dark:bg-[#33212D]"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          active
                            ? item.id === "danger"
                              ? "text-red-600"
                              : "text-[#4A1838] dark:text-[#F8DDE8]"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {item.title}
                      </p>

                      <p className="mt-0.5 hidden truncate text-xs text-gray-400 dark:text-gray-500 xl:block">
                        {item.description}
                      </p>
                    </div>

                    {active && (
                      <ChevronRight
                        size={16}
                        className={
                          item.id === "danger"
                            ? "text-red-500"
                            : "text-[#4A1838] dark:text-[#F4BFD0]"
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* CONTENT */}
          <section className="min-w-0 rounded-3xl border border-[#F0E2E8] bg-white p-5 shadow-sm dark:border-[#49313F] dark:bg-[#261722] sm:p-8">
            {renderContent()}
          </section>
        </div>
      </main>

      {/* ========================================================
          DELETE ACCOUNT MODAL
      ======================================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl dark:bg-[#261722]">
            <button
              type="button"
              onClick={() =>
                setShowDeleteModal(false)
              }
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-[#3A2633] dark:text-gray-300"
            >
              <X size={18} />
            </button>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
              <Trash2
                size={25}
                className="text-red-600"
              />
            </div>

            <h2 className="text-2xl font-semibold text-[#4A1838] dark:text-[#FFF9F7]">
              Delete your account?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              This action is permanent. Your account and
              associated Femora data may be permanently
              removed.
            </p>

            <div className="mt-5 rounded-2xl bg-red-50 p-4 dark:bg-red-950/30">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                ⚠️ This cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-[#49313F] dark:text-gray-300 dark:hover:bg-[#33212D]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;

