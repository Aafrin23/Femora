const API_URL = "http://localhost:5000/api/hormonal-health";

const getToken = () => {
  return localStorage.getItem("token");
};

// ============================================================
// GET DATA
// ============================================================

export const getHormonalHealth = async () => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load hormonal health");
  }

  return response.json();
};

// ============================================================
// UPDATE DATA
// ============================================================

export const updateHormonalHealth = async (data) => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update hormonal health");
  }

  return response.json();
};