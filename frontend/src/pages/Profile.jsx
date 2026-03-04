import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyPosts, DeletePost, Editprofile, ToggleLike, ToggleBookmark } from "../services/api";
import { MdEdit, MdBookmark, MdAdd, MdCameraAlt } from "react-icons/md";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user, fetchUserProfile, setUser } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await getMyPosts();
    setPosts(data.posts);
  };

  const toggleLike = async (id) => {
    setPosts(prev =>
      prev.map(post => {
        if (post._id === id) {
          const hasLiked = post.likes.includes(user?._id);
          const updatedLikes = hasLiked
            ? post.likes.filter((userId) => userId !== user?._id)
            : [...post.likes, user?._id];
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );
    try {
      await ToggleLike(id);
    } catch (error) { console.log(error); }
  };

  const toggleSave = async (id) => {
    try {
      const res = await ToggleBookmark(id);
      if (res.success) setUser({ ...user, bookmarks: res.bookmarks });
    } catch (error) { console.log(error); }
  };

  const deletePost = async (id) => {
    try {
      await DeletePost(id);
      loadPosts();
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  };

  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      setUser(prev => ({ ...prev, profile_img: URL.createObjectURL(file) }));
      const formData = new FormData();
      formData.append("profile_img", file);
      const data = await Editprofile(formData);
      if (!data.success) { alert(data.message || "Avatar update failed"); return; }
      await fetchUserProfile();
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ── Profile Card ── */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Banner */}
          <div
            className="h-28 w-full"
            style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #a78bfa 100%)' }}
          />

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="relative">
                <img
                  src={user.profile_img}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4"
                  style={{ borderColor: 'var(--color-bg-card)' }}
                />
                <label
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                  title="Change avatar"
                >
                  <MdCameraAlt size={14} />
                  <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </label>
              </div>

              {/* Post count */}
              <div
                className="text-center px-5 py-2 rounded-xl border"
                style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}
              >
                <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{posts.length}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Posts</p>
              </div>
            </div>

            {/* Info */}
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{user.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>@{user.username}</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>

            {user.bio ? (
              <p className="text-sm mt-3 leading-relaxed max-w-lg" style={{ color: 'var(--color-text-secondary)' }}>
                {user.bio}
              </p>
            ) : (
              <p className="text-sm mt-3 italic" style={{ color: 'var(--color-text-muted)' }}>
                No bio yet.{' '}
                <Link to="/edit-profile" className="not-italic hover:underline" style={{ color: 'var(--color-primary)' }}>
                  Add one
                </Link>
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-5 flex-wrap">
              <Link
                to="/edit-profile"
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-bg-input)',
                }}
              >
                <MdEdit size={15} /> Edit Profile
              </Link>
              <Link
                to="/bookmarks"
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border"
                style={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  backgroundColor: 'var(--color-primary-light)',
                }}
              >
                <MdBookmark size={15} /> Saved Posts
              </Link>
            </div>
          </div>
        </div>

        {/* ── My Posts ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              My Posts
            </h3>
            <Link
              to="/create-post"
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
            >
              <MdAdd size={16} /> New Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div
              className="rounded-xl border py-14 text-center"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No posts yet.</p>
              <Link
                to="/create-post"
                className="inline-block mt-3 text-sm font-medium hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Write your first post →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={user._id}
                  bookmarks={user.bookmarks}
                  onLike={toggleLike}
                  onBookmark={toggleSave}
                  onDelete={deletePost}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;