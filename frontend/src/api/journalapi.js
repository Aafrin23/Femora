const API_URL = "http://localhost:5000/api/journal";

const getToken = () => {
  return localStorage.getItem("token");
};

// ============================================================
// GET JOURNALS
// ============================================================

export const getJournals = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch journals");
  }

  return data;
};

// ============================================================
// CREATE JOURNAL
// ============================================================

export const createJournal = async (journalData) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify(journalData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save journal");
  }

  return data;
};

// ============================================================
// UPDATE JOURNAL
// ============================================================

export const updateJournal = async (id, journalData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify(journalData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update journal");
  }

  return data;
};

// ============================================================
// DELETE JOURNAL
// ============================================================

export const deleteJournal = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete journal");
  }

  return data;
};