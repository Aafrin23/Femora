
import React, { useEffect, useMemo, useState } from "react";
import FeaturesNavbar from "../components/featuresnavbar";
import {
  getJournals,
  createJournal,
  updateJournal,
  deleteJournal,
} from "../api/journalapi";

const moods = [
  { name: "Happy", emoji: "😊" },
  { name: "Loved", emoji: "🥰" },
  { name: "Calm", emoji: "😌" },
  { name: "Sad", emoji: "😔" },
  { name: "Stressed", emoji: "😣" },
  { name: "Angry", emoji: "😤" },
  { name: "Grateful", emoji: "🙏" },
  { name: "Tired", emoji: "😴" },
];

const prompts = [
  "What made you smile today?",
  "What are you grateful for today?",
  "What is something you're proud of?",
  "How are you really feeling today?",
  "What would you like to let go of?",
  "What is one thing you want to improve tomorrow?",
  "What was the best part of your day?",
];

function Journal() {
  const [journals, setJournals] = useState([]);

  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("Calm");

  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  // ============================================================
  // LOAD JOURNALS
  // ============================================================

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      setLoading(true);

      const data = await getJournals();

      setJournals(data.journals || []);
    } catch (error) {
      console.error(error);

      setMessage("Unable to load your journal entries.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SAVE JOURNAL
  // ============================================================

  const handleSave = async () => {
    if (!entry.trim()) {
      setMessage("Write something before saving your journal ✨");
      return;
    }

    try {
      setSaving(true);

      const journalData = {
        title: title.trim() || "Today's Thoughts",
        content: entry,
        mood,
        prompt: selectedPrompt,
      };

      if (editingId) {
        const data = await updateJournal(editingId, journalData);

        setJournals((prev) =>
          prev.map((journal) =>
            journal._id === editingId ? data.journal : journal
          )
        );

        setMessage("Journal updated successfully ✨");
      } else {
        const data = await createJournal(journalData);

        setJournals((prev) => [data.journal, ...prev]);

        setMessage("Your thoughts have been saved 💗");
      }

      resetEditor();
    } catch (error) {
      console.error(error);

      setMessage(error.message || "Something went wrong.");
    } finally {
      setSaving(false);

      setTimeout(() => {
        setMessage("");
      }, 2500);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this journal entry?"
    );

    if (!confirmDelete) return;

    try {
      await deleteJournal(id);

      setJournals((prev) =>
        prev.filter((journal) => journal._id !== id)
      );

      if (editingId === id) {
        resetEditor();
      }

      setMessage("Journal entry deleted.");
    } catch (error) {
      console.error(error);

      setMessage("Unable to delete this entry.");
    }
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleEdit = (journal) => {
    setEditingId(journal._id);

    setTitle(journal.title || "");
    setEntry(journal.content || "");
    setMood(journal.mood || "Calm");
    setSelectedPrompt(
      journal.prompt || prompts[0]
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // RESET
  // ============================================================

  const resetEditor = () => {
    setTitle("");
    setEntry("");
    setMood("Calm");
    setSelectedPrompt(prompts[0]);
    setEditingId(null);
  };

  // ============================================================
  // RANDOM PROMPT
  // ============================================================

  const generatePrompt = () => {
    const randomPrompt =
      prompts[Math.floor(Math.random() * prompts.length)];

    setSelectedPrompt(randomPrompt);
  };

  // ============================================================
  // CHARACTER COUNT
  // ============================================================

  const characterCount = entry.length;

  // ============================================================
  // JOURNAL STREAK
  // ============================================================

  const streak = useMemo(() => {
    if (!journals.length) return 0;

    const uniqueDates = [
      ...new Set(
        journals.map((journal) =>
          new Date(journal.createdAt).toLocaleDateString("en-CA")
        )
      ),
    ];

    const sortedDates = uniqueDates
      .map((date) => new Date(date))
      .sort((a, b) => b - a);

    let count = 0;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);

      expectedDate.setDate(today.getDate() - i);

      if (
        sortedDates[i].toDateString() ===
        expectedDate.toDateString()
      ) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }, [journals]);

  // ============================================================
  // DATE
  // ============================================================

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#4A1838]">
      <FeaturesNavbar />

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-10">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="text-center mb-10">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F7E4E6] text-3xl mb-4 shadow-sm">
            📖
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#4A2438]">
            A little space for you ✨
          </h1>

          <p className="mt-3 text-[#8A6875]">
            Write freely. Reflect gently. Be completely yourself.
          </p>

          <p className="mt-2 text-sm text-[#B76E79]">
            {today}
          </p>

        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">

          <div className="bg-white rounded-2xl border border-[#EBDDD9] p-5 text-center shadow-sm">
            <div className="text-2xl mb-1">🔥</div>

            <p className="text-2xl font-semibold text-[#4A2438]">
              {streak}
            </p>

            <p className="text-xs text-[#9A7B84]">
              Day Streak
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBDDD9] p-5 text-center shadow-sm">
            <div className="text-2xl mb-1">📚</div>

            <p className="text-2xl font-semibold text-[#4A2438]">
              {journals.length}
            </p>

            <p className="text-xs text-[#9A7B84]">
              Journal Entries
            </p>
          </div>

        </div>

        {/* =====================================================
            MESSAGE
        ===================================================== */}

        {message && (
          <div className="max-w-3xl mx-auto mb-5 rounded-xl bg-[#F7E7EA] border border-[#E5C6CC] px-5 py-3 text-center text-sm text-[#6D304A]">
            {message}
          </div>
        )}

        {/* =====================================================
            JOURNAL CARD
        ===================================================== */}

        <section className="max-w-4xl mx-auto">

          <div className="bg-[#FFFDFC] rounded-3xl shadow-[0_15px_50px_rgba(74,36,56,0.10)] border border-[#E8D8D2] overflow-hidden">

            {/* TOP BAR */}

            <div className="flex flex-col md:flex-row justify-between gap-4 px-6 md:px-10 py-5 border-b border-[#EBDDD9] bg-[#FCF5F1]">

              <div>
                <p className="text-xs uppercase tracking-widest text-[#B76E79]">
                  {editingId ? "Editing entry" : "Today's journal"}
                </p>

                <p className="text-sm text-[#8A6875] mt-1">
                  Your thoughts are yours alone 🔒
                </p>
              </div>

              <button
                onClick={generatePrompt}
                className="self-start px-4 py-2 rounded-full bg-white border border-[#DDBFC3] text-[#B76E79] text-sm hover:bg-[#B76E79] hover:text-white transition"
              >
                💭 New Prompt
              </button>

            </div>

            {/* CONTENT */}

            <div className="p-6 md:p-10">

              {/* TITLE */}

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give today's entry a title..."
                className="w-full bg-transparent outline-none text-2xl md:text-3xl font-serif font-semibold text-[#4A2438] placeholder:text-[#C4AEB3]"
              />

              <div className="mt-4 border-b border-[#D9B8BC]" />

              {/* PROMPT */}

              <div className="mt-7 rounded-2xl bg-[#FBF0F1] border border-[#EBD5D8] p-5">

                <p className="text-xs uppercase tracking-wider text-[#B76E79] mb-2">
                  Today's reflection
                </p>

                <p className="font-serif text-lg text-[#4A2438]">
                  {selectedPrompt}
                </p>

              </div>

              {/* MOOD */}

              <div className="mt-8">

                <p className="text-sm font-medium mb-4">
                  How are you feeling today?
                </p>

                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">

                  {moods.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setMood(item.name)}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl border transition ${
                        mood === item.name
                          ? "bg-[#B76E79] text-white border-[#B76E79] scale-[1.03]"
                          : "bg-white border-[#E8D8D2] hover:border-[#B76E79]"
                      }`}
                    >
                      <span className="text-xl">
                        {item.emoji}
                      </span>

                      <span className="text-[10px] mt-1">
                        {item.name}
                      </span>
                    </button>
                  ))}

                </div>

              </div>

              {/* WRITING AREA */}

              <div className="relative mt-8 rounded-2xl border border-[#E8D8D2] overflow-hidden bg-[#FFFDFC]">

                <div
                  className="absolute inset-0 pointer-events-none opacity-50"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, #DCC6C5 32px)",
                  }}
                />

                <textarea
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="Start writing what's on your mind..."
                  className="relative w-full min-h-[380px] resize-none bg-transparent outline-none border-none px-6 py-4 text-[#4A2438] font-serif text-lg leading-8 placeholder:text-[#C4AEB3]"
                />

                <div className="relative flex justify-end px-5 py-3 border-t border-[#E8D8D2] bg-[#FFFDFC]">
                  <span className="text-xs text-[#9A7B84]">
                    {characterCount} characters
                  </span>
                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6">

                <button
                  onClick={resetEditor}
                  className="px-6 py-3 rounded-full border border-[#B76E79] text-[#B76E79] text-sm hover:bg-[#B76E79] hover:text-white transition"
                >
                  {editingId ? "Cancel Edit" : "Clear"}
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 rounded-full bg-[#B76E79] text-white text-sm hover:bg-[#4A1838] transition shadow-md disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Entry ✨"
                    : "Save Entry ✨"}
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            RECENT ENTRIES
        ===================================================== */}

        <section className="max-w-5xl mx-auto mt-14">

          <div className="flex justify-between items-end mb-5">

            <div>
              <p className="text-xs uppercase tracking-widest text-[#B76E79]">
                Your memories
              </p>

              <h2 className="text-2xl font-serif font-semibold text-[#4A2438] mt-1">
                Recent entries 📚
              </h2>
            </div>

          </div>

          {loading ? (
            <div className="text-center py-10 text-[#9A7B84]">
              Loading your journal...
            </div>
          ) : journals.length === 0 ? (

            <div className="bg-white border border-[#EBDDD9] rounded-2xl p-10 text-center">

              <div className="text-4xl mb-3">
                🌷
              </div>

              <h3 className="font-serif text-xl font-semibold">
                Your journal is waiting for you
              </h3>

              <p className="text-sm text-[#9A7B84] mt-2">
                Your first entry will appear here.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {journals.map((journal) => {

                const moodData = moods.find(
                  (item) => item.name === journal.mood
                );

                return (
                  <article
                    key={journal._id}
                    className="group bg-white border border-[#EBDDD9] rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
                  >

                    <div className="flex justify-between items-start">

                      <div>
                        <p className="text-xs text-[#B76E79]">
                          {new Date(
                            journal.createdAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>

                        <h3 className="font-serif text-lg font-semibold mt-1">
                          {journal.title}
                        </h3>
                      </div>

                      <span className="text-2xl">
                        {moodData?.emoji || "😌"}
                      </span>

                    </div>

                    <p className="text-sm text-[#806873] mt-4 line-clamp-4 leading-6">
                      {journal.content}
                    </p>

                    <div className="flex gap-2 mt-5 pt-4 border-t border-[#F0E5E2]">

                      <button
                        onClick={() => handleEdit(journal)}
                        className="text-xs px-3 py-1.5 rounded-full border border-[#DDBFC3] text-[#B76E79] hover:bg-[#B76E79] hover:text-white transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(journal._id)
                        }
                        className="text-xs px-3 py-1.5 rounded-full border border-[#E5C6CC] text-[#A54E64] hover:bg-[#A54E64] hover:text-white transition"
                      >
                        Delete
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

        {/* PRIVACY */}

        <div className="text-center mt-12 pb-8">

          <p className="text-xs text-[#9A7B84]">
            🔒 Your journal entries are private and connected to your Femora account.
          </p>

        </div>

      </main>
    </div>
  );
}

export default Journal;

