import axios from "axios";

const API_URL = "http://localhost:5000/api/inspiration";

// ============================================================
// GET ALL POSTS
// ============================================================

export const getInspirations = async (
  category = "All",
  search = ""
) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    params: {
      category,
      search,
    },

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================================
// GET MY POSTS
// ============================================================

export const getMyInspirations = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================================
// CREATE POST
// ============================================================

export const createInspiration = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ============================================================
// INSPIRE
// ============================================================

export const toggleInspire = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${id}/inspire`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ============================================================
// DELETE
// ============================================================

export const deleteInspiration = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};