import React, { useEffect, useMemo, useState } from "react";
import FeaturesNavbar from "../components/featuresnavbar.jsx";

import {
  getHormonalHealth,
  updateHormonalHealth,
} from "../api/hormonalhealth.js";

function HormonalHealth() {
  // ============================================================
  // STATES
  // ============================================================

  const [healthData, setHealthData] = useState(null);

  const [cycleStartDate, setCycleStartDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  const [selectedMood, setSelectedMood] = useState("Good");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ============================================================
  // MOODS
  // ============================================================

  const moods = [
    { name: "Happy", emoji: "😊" },
    { name: "Good", emoji: "🙂" },
    { name: "Okay", emoji: "😐" },
    { name: "Low", emoji: "😔" },
    { name: "Irritated", emoji: "😡" },
    { name: "Tired", emoji: "😴" },
  ];

  // ============================================================
  // SYMPTOMS
  // ============================================================

  const symptoms = [
    { name: "Cramps", emoji: "🌸" },
    { name: "Headache", emoji: "🤕" },
    { name: "Bloating", emoji: "🫧" },
    { name: "Acne", emoji: "✨" },
    { name: "Fatigue", emoji: "😴" },
    { name: "Mood Swings", emoji: "💭" },
    { name: "Back Pain", emoji: "💗" },
    { name: "Cravings", emoji: "🍫" },
  ];

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        const data = await getHormonalHealth();

        setHealthData(data);

        if (data?.cycleStartDate) {
          const date = new Date(data.cycleStartDate);

          if (!Number.isNaN(date.getTime())) {
            const formattedDate = date
              .toISOString()
              .split("T")[0];

            setCycleStartDate(formattedDate);
          }
        }

        setCycleLength(Number(data?.cycleLength) || 28);
        setPeriodLength(Number(data?.periodLength) || 5);

        setSelectedMood(data?.mood || "Good");
        setSelectedSymptoms(data?.symptoms || []);
        setSeverity(Number(data?.symptomSeverity) || 1);
      } catch (error) {
        console.error("Failed to load hormonal health:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHealthData();
  }, []);

  // ============================================================
  // DATE HELPERS
  // ============================================================

  const getDateOnly = (date) => {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
  };

  const addDays = (date, days) => {
    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ============================================================
  // CYCLE INFORMATION
  // ============================================================

  const cycleInformation = useMemo(() => {
    if (!cycleStartDate || !cycleLength) {
      return {
        day: 1,
        phase: "Menstrual",
        nextPeriod: null,
        ovulationDate: null,
        fertileStart: null,
        fertileEnd: null,
        progress: 0,
        daysUntilPeriod: null,
      };
    }

    const start = getDateOnly(cycleStartDate);
    const today = getDateOnly(new Date());

    let difference =
      Math.floor(
        (today.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (difference < 1) {
      difference = 1;
    }

    const cyclesPassed = Math.floor(
      (difference - 1) / cycleLength
    );

    const cycleDay =
      ((difference - 1) % cycleLength) + 1;

    // Ovulation is estimated around 14 days before
    // the next expected period.
    const ovulationDay = Math.max(
      cycleLength - 14,
      periodLength + 1
    );

    const fertileStartDay = Math.max(
      ovulationDay - 5,
      periodLength + 1
    );

    const fertileEndDay = Math.min(
      ovulationDay + 1,
      cycleLength
    );

    let phase = "Menstrual";

    if (cycleDay <= periodLength) {
      phase = "Menstrual";
    } else if (cycleDay < ovulationDay) {
      phase = "Follicular";
    } else if (cycleDay <= ovulationDay + 1) {
      phase = "Ovulation";
    } else {
      phase = "Luteal";
    }

    const currentCycleStart = addDays(
      start,
      cyclesPassed * cycleLength
    );

    const nextPeriod = addDays(
      currentCycleStart,
      cycleLength
    );

    const ovulationDate = addDays(
      currentCycleStart,
      ovulationDay - 1
    );

    const fertileStart = addDays(
      currentCycleStart,
      fertileStartDay - 1
    );

    const fertileEnd = addDays(
      currentCycleStart,
      fertileEndDay - 1
    );

    const daysUntilPeriod = Math.max(
      Math.ceil(
        (nextPeriod.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      0
    );

    const progress = Math.min(
      (cycleDay / cycleLength) * 100,
      100
    );

    return {
      day: cycleDay,
      phase,
      nextPeriod,
      ovulationDate,
      fertileStart,
      fertileEnd,
      progress,
      daysUntilPeriod,
      ovulationDay,
      fertileStartDay,
      fertileEndDay,
    };
  }, [
    cycleStartDate,
    cycleLength,
    periodLength,
  ]);

  // ============================================================
  // PHASE INFORMATION
  // ============================================================

  const phaseInformation = useMemo(() => {
    const phase = cycleInformation.phase;

    const information = {
      Menstrual: {
        emoji: "🩸",
        title: "Menstrual Phase",
        text:
          "Your period phase. Rest, hydration, gentle movement and listening to your body can be helpful.",
      },

      Follicular: {
        emoji: "🌱",
        title: "Follicular Phase",
        text:
          "This phase occurs after your period and before ovulation. Some people notice gradually increasing energy.",
      },

      Ovulation: {
        emoji: "✨",
        title: "Ovulation Phase",
        text:
          "Ovulation is estimated around this part of your cycle. Your experience can vary from cycle to cycle.",
      },

      Luteal: {
        emoji: "🌙",
        title: "Luteal Phase",
        text:
          "This phase follows ovulation and leads toward your next period. Rest and self-care may become more important for some people.",
      },
    };

    return information[phase] || information.Menstrual;
  }, [cycleInformation.phase]);

  // ============================================================
  // PERSONALIZED DAILY INSIGHT
  // ============================================================

  const dailyInsight = useMemo(() => {
    const phase = cycleInformation.phase;

    if (
      selectedSymptoms.includes("Cramps") &&
      selectedSymptoms.includes("Fatigue")
    ) {
      return {
        emoji: "💗",
        title: "Listen to your body today",
        text:
          "You're tracking cramps and fatigue today. Consider prioritizing rest, hydration and gentle activities if they feel comfortable.",
      };
    }

    if (selectedSymptoms.includes("Headache")) {
      return {
        emoji: "🌸",
        title: "Take a gentle moment",
        text:
          "You're tracking a headache today. Staying hydrated and giving yourself some quiet time may feel supportive.",
      };
    }

    if (selectedSymptoms.includes("Bloating")) {
      return {
        emoji: "🫧",
        title: "Be kind to your body",
        text:
          "You're tracking bloating today. Notice how your body feels and choose foods, movement and routines that feel comfortable for you.",
      };
    }

    if (selectedMood === "Tired") {
      return {
        emoji: "🌙",
        title: "Your energy matters",
        text:
          "You marked yourself as tired today. It's okay to slow down and give yourself more recovery time.",
      };
    }

    if (selectedMood === "Low") {
      return {
        emoji: "💗",
        title: "Be gentle with yourself",
        text:
          "You marked your mood as low today. Small comforting activities, rest and connecting with someone you trust may help.",
      };
    }

    if (phase === "Follicular") {
      return {
        emoji: "🌱",
        title: "A fresh phase",
        text:
          "You're in the follicular phase. If your energy feels good, this can be a nice time to focus on activities and routines you enjoy.",
      };
    }

    if (phase === "Ovulation") {
      return {
        emoji: "✨",
        title: "You're around your estimated ovulation",
        text:
          "Your cycle calculation places you around estimated ovulation. Remember that cycle timing can vary from person to person.",
      };
    }

    if (phase === "Luteal") {
      return {
        emoji: "🌙",
        title: "Slow down when needed",
        text:
          "You're in the luteal phase. Pay attention to changes in your energy, mood and symptoms as your next period approaches.",
      };
    }

    return {
      emoji: "🌸",
      title: "Keep checking in",
      text:
        "Every check-in helps you build a better picture of your personal wellness patterns over time.",
    };
  }, [
    cycleInformation.phase,
    selectedSymptoms,
    selectedMood,
  ]);

  // ============================================================
  // TOGGLE SYMPTOM
  // ============================================================

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((previous) => {
      if (previous.includes(symptom)) {
        return previous.filter(
          (item) => item !== symptom
        );
      }

      return [...previous, symptom];
    });
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await updateHormonalHealth({
        cycleStartDate,
        cycleLength,
        periodLength,
        mood: selectedMood,
        symptoms: selectedSymptoms,
        symptomSeverity: severity,
      });

      setHealthData(response.data);

      setMessage(
        "Today's check-in has been saved 💗"
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save hormonal health:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // INSIGHTS
  // ============================================================

  const insights = useMemo(() => {
    const history = healthData?.history || [];

    const symptomCounts = {};
    const moodCounts = {};

    history.forEach((entry) => {
      (entry.symptoms || []).forEach((symptom) => {
        symptomCounts[symptom] =
          (symptomCounts[symptom] || 0) + 1;
      });

      if (entry.mood) {
        moodCounts[entry.mood] =
          (moodCounts[entry.mood] || 0) + 1;
      }
    });

    const mostCommonSymptom =
      Object.entries(symptomCounts).sort(
        (a, b) => b[1] - a[1]
      )[0];

    const mostCommonMood =
      Object.entries(moodCounts).sort(
        (a, b) => b[1] - a[1]
      )[0];

    const symptomList = Object.entries(
      symptomCounts
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      trackedDays: history.length,

      mostCommonSymptom: mostCommonSymptom
        ? mostCommonSymptom[0]
        : selectedSymptoms[0] || "No pattern yet",

      mostCommonMood: mostCommonMood
        ? mostCommonMood[0]
        : selectedMood,

      symptomList,
    };
  }, [
    healthData,
    selectedSymptoms,
    selectedMood,
  ]);

  // ============================================================
  // CALENDAR
  // ============================================================

  const calendarData = useMemo(() => {
    if (!cycleStartDate) {
      return [];
    }

    const today = getDateOnly(new Date());
    const start = getDateOnly(cycleStartDate);

    const currentCycleStart = new Date(start);

    let difference = Math.floor(
      (today.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (difference < 0) {
      difference = 0;
    }

    const cyclesPassed = Math.floor(
      difference / cycleLength
    );

    currentCycleStart.setDate(
      currentCycleStart.getDate() +
        cyclesPassed * cycleLength
    );

    return Array.from(
      { length: cycleLength },
      (_, index) => {
        const date = addDays(
          currentCycleStart,
          index
        );

        const dayNumber = index + 1;

        let phase = "Luteal";

        if (dayNumber <= periodLength) {
          phase = "Menstrual";
        } else if (
          dayNumber <
          cycleInformation.ovulationDay
        ) {
          phase = "Follicular";
        } else if (
          dayNumber <=
          cycleInformation.ovulationDay + 1
        ) {
          phase = "Ovulation";
        }

        const isToday =
          date.getTime() === today.getTime();

        const isFertile =
          dayNumber >=
            cycleInformation.fertileStartDay &&
          dayNumber <=
            cycleInformation.fertileEndDay;

        return {
          date,
          dayNumber,
          phase,
          isToday,
          isFertile,
        };
      }
    );
  }, [
    cycleStartDate,
    cycleLength,
    periodLength,
    cycleInformation,
  ]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F7]">
        <FeaturesNavbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-[#4A1838]">
            Loading your wellness space...
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838]">
      <FeaturesNavbar />

      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">

        {/* HERO */}

        <section className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full bg-[#F8E2EA] px-5 py-2 text-sm font-medium">
            🌸 Your body, your journey
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            Hormonal Health 🌸
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#765568]">
            Understand your cycle, track how you feel,
            and discover patterns in your everyday
            wellness journey.
          </p>
        </section>

        {/* CYCLE OVERVIEW */}

        <section className="mb-8 rounded-[30px] bg-gradient-to-br from-[#F8E1E9] to-[#F4D4E1] p-7 shadow-sm">

          <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">

            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#8A5A70]">
                Cycle Overview
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Day {cycleInformation.day}
              </h2>

              <p className="mt-2 text-lg">
                {phaseInformation.emoji}{" "}
                {cycleInformation.phase} Phase
              </p>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Cycle progress</span>

                  <span>
                    {Math.round(
                      cycleInformation.progress
                    )}
                    %
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full bg-[#8D3D66] transition-all"
                    style={{
                      width: `${cycleInformation.progress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <div className="rounded-2xl bg-white/60 p-4">
                  <p className="text-sm text-[#765568]">
                    Next period
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatDate(
                      cycleInformation.nextPeriod
                    )}
                  </p>

                  <p className="mt-1 text-xs text-[#876A79]">
                    {cycleInformation.daysUntilPeriod}{" "}
                    day
                    {cycleInformation.daysUntilPeriod !==
                    1
                      ? "s"
                      : ""}{" "}
                    away
                  </p>
                </div>

                <div className="rounded-2xl bg-white/60 p-4">
                  <p className="text-sm text-[#765568]">
                    Estimated ovulation
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatDate(
                      cycleInformation.ovulationDate
                    )}
                  </p>

                  <p className="mt-1 text-xs text-[#876A79]">
                    Around cycle day{" "}
                    {cycleInformation.ovulationDay}
                  </p>
                </div>

              </div>

              <div className="mt-3 rounded-2xl bg-white/60 p-4">
                <p className="text-sm text-[#765568]">
                  Estimated fertile window
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {formatDate(
                    cycleInformation.fertileStart
                  )}{" "}
                  –{" "}
                  {formatDate(
                    cycleInformation.fertileEnd
                  )}
                </p>
              </div>

            </div>

            {/* CIRCLE */}

            <div className="flex items-center justify-center">

              <div className="relative flex h-64 w-64 items-center justify-center">

                <div className="absolute inset-0 rounded-full border-[18px] border-white/60" />

                <div
                  className="absolute inset-0 rounded-full border-[18px] border-transparent border-t-[#8D3D66] border-r-[#8D3D66] transition-all"
                  style={{
                    transform: `rotate(${
                      cycleInformation.progress *
                      3.6
                    }deg)`,
                  }}
                />

                <div className="text-center">
                  <p className="text-5xl font-bold">
                    {cycleInformation.day}
                  </p>

                  <p className="mt-1 text-sm">
                    cycle day
                  </p>
                </div>

              </div>

            </div>

          </div>

          <p className="mt-6 text-center text-xs text-[#765568]">
            Cycle, ovulation and fertile-window dates
            are estimates based on the information you
            entered. They may vary from cycle to cycle.
          </p>

        </section>

        {/* DAILY INSIGHT */}

        <section className="mb-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">

          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <p className="text-sm font-medium text-[#9A607A]">
              TODAY'S WELLNESS INSIGHT
            </p>

            <div className="mt-4 flex gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F8E2EA] text-3xl">
                {dailyInsight.emoji}
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {dailyInsight.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#765568]">
                  {dailyInsight.text}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-3xl bg-[#4A1838] p-7 text-white">

            <p className="text-sm font-medium text-[#EAC6D6]">
              CURRENT PHASE
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {phaseInformation.emoji}{" "}
              {phaseInformation.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#F5DFE9]">
              {phaseInformation.text}
            </p>

          </div>

        </section>

        {/* CALENDAR */}

        <section className="mb-8 rounded-3xl bg-white p-7 shadow-sm">

          <div className="mb-7">
            <p className="text-sm font-medium text-[#9A607A]">
              YOUR CURRENT CYCLE
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Cycle Calendar 📅
            </h2>
          </div>

          <div className="grid grid-cols-7 gap-2">

            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div
                key={day}
                className="pb-2 text-center text-xs font-semibold text-[#927582]"
              >
                {day}
              </div>
            ))}

            {calendarData.map((day) => {

              let background =
                "bg-[#FFF9F7]";

              if (day.phase === "Menstrual") {
                background = "bg-[#F8E2EA]";
              }

              if (day.phase === "Ovulation") {
                background = "bg-[#F4E5B9]";
              }

              if (day.isFertile) {
                background = "bg-[#F3E6F0]";
              }

              if (day.isToday) {
                background =
                  "bg-[#8D3D66] text-white";
              }

              return (
                <div
                  key={day.date.toISOString()}
                  className={`relative flex min-h-16 flex-col items-center justify-center rounded-xl text-sm ${background}`}
                >
                  <span className="font-semibold">
                    {day.date.getDate()}
                  </span>

                  <span className="mt-1 text-[9px] opacity-70">
                    {day.dayNumber}
                  </span>
                </div>
              );
            })}

          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-[#765568]">

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#F8E2EA]" />
              Period
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#F3E6F0]" />
              Estimated fertile window
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#F4E5B9]" />
              Estimated ovulation
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#8D3D66]" />
              Today
            </span>

          </div>

        </section>

        {/* CYCLE SETTINGS */}

        <section className="mb-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <label className="text-sm font-semibold">
              Cycle Start Date
            </label>

            <input
              type="date"
              value={cycleStartDate}
              onChange={(e) =>
                setCycleStartDate(e.target.value)
              }
              className="mt-3 w-full rounded-xl border border-[#E8D5DD] bg-[#FFF9F7] px-4 py-3 outline-none focus:border-[#8D3D66]"
            />

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <label className="text-sm font-semibold">
              Cycle Length
            </label>

            <input
              type="number"
              min="21"
              max="40"
              value={cycleLength}
              onChange={(e) =>
                setCycleLength(
                  Number(e.target.value)
                )
              }
              className="mt-3 w-full rounded-xl border border-[#E8D5DD] bg-[#FFF9F7] px-4 py-3 outline-none focus:border-[#8D3D66]"
            />

            <p className="mt-2 text-xs text-[#876A79]">
              Your cycle length can vary between
              cycles.
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <label className="text-sm font-semibold">
              Period Length
            </label>

            <input
              type="number"
              min="1"
              max="10"
              value={periodLength}
              onChange={(e) =>
                setPeriodLength(
                  Number(e.target.value)
                )
              }
              className="mt-3 w-full rounded-xl border border-[#E8D5DD] bg-[#FFF9F7] px-4 py-3 outline-none focus:border-[#8D3D66]"
            />

          </div>

        </section>

        {/* MOOD + SYMPTOMS */}

        <section className="grid gap-8 lg:grid-cols-2">

          {/* MOOD */}

          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <div className="mb-6">
              <p className="text-sm font-medium text-[#9A607A]">
                DAILY CHECK-IN
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                How are you feeling today? 💗
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">

              {moods.map((mood) => {

                const selected =
                  selectedMood === mood.name;

                return (
                  <button
                    key={mood.name}
                    onClick={() =>
                      setSelectedMood(
                        mood.name
                      )
                    }
                    className={`rounded-2xl border p-4 transition ${
                      selected
                        ? "border-[#8D3D66] bg-[#F8E2EA] shadow-sm"
                        : "border-[#F0E1E7] bg-[#FFF9F7] hover:bg-[#F9EEF2]"
                    }`}
                  >

                    <div className="text-3xl">
                      {mood.emoji}
                    </div>

                    <p className="mt-2 text-sm font-medium">
                      {mood.name}
                    </p>

                  </button>
                );
              })}

            </div>

          </div>

          {/* SYMPTOMS */}

          <div className="rounded-3xl bg-white p-7 shadow-sm">

            <div className="mb-6">
              <p className="text-sm font-medium text-[#9A607A]">
                SYMPTOM TRACKER
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                What are you experiencing? 🌸
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">

              {symptoms.map((symptom) => {

                const selected =
                  selectedSymptoms.includes(
                    symptom.name
                  );

                return (
                  <button
                    key={symptom.name}
                    onClick={() =>
                      toggleSymptom(
                        symptom.name
                      )
                    }
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-[#8D3D66] bg-[#F8E2EA]"
                        : "border-[#F0E1E7] bg-[#FFF9F7] hover:bg-[#F9EEF2]"
                    }`}
                  >

                    <span className="text-xl">
                      {symptom.emoji}
                    </span>

                    <span className="text-sm font-medium">
                      {symptom.name}
                    </span>

                  </button>
                );
              })}

            </div>

            <div className="mt-6">

              <label className="text-sm font-semibold">
                Symptom intensity
              </label>

              <div className="mt-3 flex items-center gap-3">

                {[1, 2, 3, 4, 5].map(
                  (value) => (
                    <button
                      key={value}
                      onClick={() =>
                        setSeverity(value)
                      }
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        severity >= value
                          ? "bg-[#8D3D66] text-white"
                          : "bg-[#F8E8EE] text-[#8D3D66]"
                      }`}
                    >
                      {value}
                    </button>
                  )
                )}

              </div>

            </div>

          </div>

        </section>

        {/* CYCLE PHASES */}

        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">

          <div className="mb-7">
            <p className="text-sm font-medium text-[#9A607A]">
              UNDERSTAND YOUR CYCLE
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Your Cycle Phases 🌺
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">

            <PhaseCard
              emoji="🩸"
              title="Menstrual"
              description="Your period phase. A time to slow down, rest and care for yourself."
              active={
                cycleInformation.phase ===
                "Menstrual"
              }
            />

            <PhaseCard
              emoji="🌱"
              title="Follicular"
              description="The phase after your period and before estimated ovulation."
              active={
                cycleInformation.phase ===
                "Follicular"
              }
            />

            <PhaseCard
              emoji="✨"
              title="Ovulation"
              description="Ovulation may occur around this part of the cycle."
              active={
                cycleInformation.phase ===
                "Ovulation"
              }
            />

            <PhaseCard
              emoji="🌙"
              title="Luteal"
              description="The phase after ovulation leading toward your next period."
              active={
                cycleInformation.phase ===
                "Luteal"
              }
            />

          </div>

        </section>

        {/* INSIGHTS */}

        <section className="mt-8 rounded-3xl bg-gradient-to-br from-[#4A1838] to-[#702750] p-7 text-white shadow-sm">

          <div className="mb-7">
            <p className="text-sm font-medium text-[#EAC6D6]">
              YOUR PERSONAL PATTERNS
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Your Insights 📊
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <InsightCard
              emoji="📅"
              value={insights.trackedDays}
              label="Days tracked"
            />

            <InsightCard
              emoji="🌸"
              value={insights.mostCommonSymptom}
              label="Frequently tracked symptom"
            />

            <InsightCard
              emoji="💗"
              value={insights.mostCommonMood}
              label="Frequently tracked mood"
            />

          </div>

          {/* SYMPTOM PATTERNS */}

          {insights.symptomList.length > 0 && (
            <div className="mt-6 rounded-2xl bg-white/10 p-5">

              <h3 className="font-semibold">
                Symptom patterns
              </h3>

              <div className="mt-4 space-y-3">

                {insights.symptomList.map(
                  ([symptom, count]) => {

                    const maxCount =
                      insights.symptomList[0][1];

                    const width =
                      (count / maxCount) * 100;

                    return (
                      <div key={symptom}>

                        <div className="mb-1 flex justify-between text-xs text-[#E8C9D8]">
                          <span>{symptom}</span>
                          <span>
                            {count}{" "}
                            {count === 1
                              ? "time"
                              : "times"}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/10">

                          <div
                            className="h-full rounded-full bg-[#E8C9D8]"
                            style={{
                              width: `${width}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

          <div className="mt-6 rounded-2xl bg-white/10 p-5">

            <p className="text-sm leading-6 text-[#F5DFE9]">
              Keep tracking your mood and symptoms over
              time. More check-ins can help you notice
              personal patterns in your wellness journey.
            </p>

          </div>

        </section>

        {/* SAVE */}

        <div className="mt-8 flex flex-col items-center">

          {message && (
            <p className="mb-4 rounded-full bg-[#F8E2EA] px-5 py-2 text-sm">
              {message}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-[#8D3D66] px-10 py-4 font-semibold text-white shadow-lg transition hover:bg-[#702750] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Today's Check-in 💗"}
          </button>

        </div>

        {/* DISCLAIMER */}

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-[#927582]">
          Femora's hormonal health tools are designed
          for wellness tracking and educational purposes.
          They are not intended to diagnose or treat
          medical conditions. Cycle and fertile-window
          estimates are not reliable for pregnancy
          prevention.
        </p>

      </main>
    </div>
  );
}

// ============================================================
// PHASE CARD
// ============================================================

function PhaseCard({
  emoji,
  title,
  description,
  active,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        active
          ? "border-[#8D3D66] bg-[#F8E2EA]"
          : "border-[#F0E1E7] bg-[#FFF9F7]"
      }`}
    >

      <div className="text-3xl">
        {emoji}
      </div>

      <h3 className="mt-3 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#765568]">
        {description}
      </p>

      {active && (
        <span className="mt-4 inline-block rounded-full bg-[#8D3D66] px-3 py-1 text-xs font-medium text-white">
          Current phase
        </span>
      )}

    </div>
  );
}

// ============================================================
// INSIGHT CARD
// ============================================================

function InsightCard({
  emoji,
  value,
  label,
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-5">

      <div className="text-2xl">
        {emoji}
      </div>

      <p className="mt-3 text-xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#E8C9D8]">
        {label}
      </p>

    </div>
  );
}

export default HormonalHealth;

