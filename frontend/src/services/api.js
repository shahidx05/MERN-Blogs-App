const API = "http://localhost:3000/api";

export const register = async (name, username, email, password) => {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, username, email, password }),
  });

  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const getMe = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Unauthorized");

  return res.json();
};

export const getAllPosts = async () => {
  const res = await fetch(`${API}/posts`);

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
};

export const getMyPosts = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/posts/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("UnAuthorise");

  return res.json();
}

export const getPost = async (id) => {
  const res = await fetch(`${API}/posts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("Not Found");

  return res.json();
}

export const Createpost = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  return res.json();
};

export const DeletePost = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) throw new Error("UnAuthorise");

  return res.json();
}

export const Editpost = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/posts`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  return res.json();
};