const API = `${import.meta.env.VITE_API_URL}/api`

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

export const getAllPosts = async (page=1, limit=10, q="") => {
  const res = await fetch(`${API}/posts?page=${page}&limit=${limit}&q=${q}`);

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

export const Editpost = async (formData, id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/posts/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  return res.json();
};

export const Editprofile = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/users/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  return res.json();
};

export const getUser = async (username) => {
  const res = await fetch(`${API}/users/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("Not Found");

  return res.json();
}

export const getUserPosts = async (id) => {
  const res = await fetch(`${API}/posts/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("Not Found");

  return res.json();
}

export const ToggleLike = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/posts/like/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
    });

    // ✅ parse response first
    const data = await res.json();

    if (res.status === 429) {
        // throw with special message so UI can catch it
        const err = new Error("Rate limited");
        err.status = 429;
        throw err;
    }

    if (!res.ok) throw new Error("Failed");
    return data;
};

export const getPostComments = async (id, page=1, limit=5) => {
  const res = await fetch(`${API}/comments/${id}?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("Not Found");

  return res.json();
}

export const CreateComment = async (id, content) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/comments/${id}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({content}),
  });

  return res.json();
};

export const DeleteComment = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) throw new Error("UnAuthorise");

  return res.json();
}

export const ToggleBookmark = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/users/bookmarks/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Not Found");

  return res.json();
};

export const getBookmarks = async (username) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/users/bookmarks/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    }
  });
  return res.json();
}

export const ToggleFollow = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/users/follow/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Not Found");

  return res.json();
};

export const getFollowingPosts = async (page = 1, limit = 10) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/posts/following?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
};

export const getFollowers = async (username) => {
  const res = await fetch(`${API}/users/${username}/followers`, {
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
};

export const getFollowing = async (username) => {
  const res = await fetch(`${API}/users/${username}/following`, {
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
};

export const generatePostContent = async (title) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/ai/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
};