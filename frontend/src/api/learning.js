const API_URL = "http://localhost:5000/api/learning";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ============================================================
// GET POSTS
// ============================================================

export const getLearningPosts = async () => {
  const response = await fetch(API_URL, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch learning posts");
  }

  return response.json();
};

// ============================================================
// CREATE POST
// ============================================================

export const createLearningPost = async (postData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create post");
  }

  return response.json();
};

// ============================================================
// DELETE
// ============================================================

export const deleteLearningPost = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  return response.json();
};

// ============================================================
// LIKE
// ============================================================

export const toggleLearningLike = async (id) => {
  const response = await fetch(`${API_URL}/${id}/like`, {
    method: "PUT",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to update like");
  }

  return response.json();
};

// ============================================================
// SAVE
// ============================================================

export const toggleLearningSave = async (id) => {
  const response = await fetch(`${API_URL}/${id}/save`, {
    method: "PUT",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to update save");
  }

  return response.json();
};

// ============================================================
// COMMENT
// ============================================================

export const addLearningComment = async (id, text) => {
  const response = await fetch(`${API_URL}/${id}/comments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      text,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add comment");
  }

  return response.json();
};