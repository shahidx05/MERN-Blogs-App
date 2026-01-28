const API = "http://localhost:3000/api";

export const getAllPosts = async () => {
  const res = await fetch(`${API}/posts`);

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
};

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
    body: JSON.stringify({email, password}),
  });

  return res.json();
};
