const API_URL = "http://localhost:5000/api/community";

// ============================================================
// GET TOKEN
// ============================================================

const getToken = () => {
  return localStorage.getItem("token");
};

// ============================================================
// COMMON REQUEST
// ============================================================

const request = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ============================================================
// GET ALL POSTS
// ============================================================

export const getCommunityPosts = async () => {
  return request("/");
};

// ============================================================
// GET SINGLE POST
// ============================================================

export const getCommunityPost = async (id) => {
  return request(`/${id}`);
};

// ============================================================
// CREATE POST
// ============================================================

export const createCommunityPost = async (postData) => {
  return request("/", {
    method: "POST",
    body: JSON.stringify(postData),
  });
};

// ============================================================
// UPDATE POST
// ============================================================

export const updateCommunityPost = async (id, postData) => {
  return request(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(postData),
  });
};

// ============================================================
// DELETE POST
// ============================================================

export const deleteCommunityPost = async (id) => {
  return request(`/${id}`, {
    method: "DELETE",
  });
};

// ============================================================
// LIKE / UNLIKE
// ============================================================

export const toggleCommunityLike = async (id) => {
  return request(`/${id}/like`, {
    method: "POST",
  });
};

// ============================================================
// SAVE / UNSAVE
// ============================================================

export const toggleCommunitySave = async (id) => {
  return request(`/${id}/save`, {
    method: "POST",
  });
};

// ============================================================
// GET COMMENTS
// ============================================================

export const getCommunityComments = async (id) => {
  return request(`/${id}/comments`);
};

// ============================================================
// ADD COMMENT
// ============================================================

export const addCommunityComment = async (id, content) => {
  return request(`/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({
      content,
    }),
  });
};

// ============================================================
// DELETE COMMENT
// ============================================================

export const deleteCommunityComment = async (
  postId,
  commentId
) => {
  return request(
    `/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );
};