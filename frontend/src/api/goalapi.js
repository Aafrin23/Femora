const API_URL = "http://localhost:5000/api/goals";

// ============================================================
// AUTH HEADER
// ============================================================

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ============================================================
// GET GOALS
// ============================================================

export const getGoals = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch goals");
  }

  return data;
};

// ============================================================
// CREATE GOAL
// ============================================================

export const createGoal = async (goal) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(goal),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create goal");
  }

  return data;
};

// ============================================================
// UPDATE GOAL
// ============================================================

export const updateGoal = async (id, updates) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update goal");
  }

  return data;
};

// ============================================================
// DELETE GOAL
// ============================================================

export const deleteGoal = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete goal");
  }

  return data;
};