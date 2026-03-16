import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyPosts, DeletePost, Editprofile, ToggleLike, ToggleBookmark } from "../services/api";
import { MdEdit, MdBookmark, MdAdd, MdCameraAlt, MdErrorOutline } from "react-icons/md";
import PostCard from "../components/PostCard";
import FollowModal from "../components/FollowModal";

const Profile = () => {
  const { user, fetchUserProfile, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getMyPosts();
      setPosts(data.posts);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleLike = async (id) => {
    setPosts(prev =>
      prev.map(post => {
        if (post._id === id) {
          const hasLiked = post.likes.includes(user?._id);
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter(uid => uid !== user?._id)
              : [...post.likes, user?._id],
          };
        }
        return post;
      })
    );
    try {
      await ToggleLike(id);
    } catch (err) { console.log(err); }
  };

  const toggleSave = async (id) => {
    try {
      const res = await ToggleBookmark(id);
      if (res.success) setUser({ ...user, bookmarks: res.bookmarks });
    } catch (err) { console.log(err); }
  };

  const deletePost = async (id) => {
    try {
      await DeletePost(id);
      loadPosts();
    } catch (err) {
      setError("Failed to delete post. Please try again.");
      console.log(err);
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
      if (!data.success) {
        setError(data.message || "Avatar update failed");
        return;
      }
      await fetchUserProfile();
    } catch (err) {
      setError("Something went wrong updating your avatar.");
      console.log(err);
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
 
      {/* ── Modal ── */}
      {modal && (
        <FollowModal
          username={user.username}
          type={modal}
          onClose={() => setModal(null)}
        />
      )}
 
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
 
        {/* ── Error Banner ── */}
        {error && (
          <div
            className="flex items-start gap-2.5 text-sm px-4 py-3 rounded-lg"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-error) 10%, transparent)',
              color: 'var(--color-error)',
              border: '1px solid color-mix(in srgb, var(--color-error) 25%, transparent)',
            }}
          >
            <MdErrorOutline size={18} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")} className="flex-shrink-0 text-xs opacity-70 hover:opacity-100">✕</button>
          </div>
        )}
 
        {/* ── Profile Card ── */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div
            className="h-28 w-full"
            style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #a78bfa 100%)' }}
          />
 
          <div className="px-6 pb-6">
            {/* Avatar + stats */}
            <div className="flex items-end justify-between -mt-12 mb-4 flex-wrap gap-y-3">
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
 
              {/* Stats */}
              <div className="flex items-center gap-2.5">
 
                {/* Posts — not clickable */}
                <div
                  className="text-center px-4 py-2 rounded-xl border"
                  style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}
                >
                  <p className="text-lg font-bold leading-none" style={{ color: 'var(--color-text-primary)' }}>{posts.length}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Posts</p>
                </div>
 
                {/* Followers — clickable */}
                <button
                  onClick={() => setModal('followers')}
                  className="text-center px-4 py-2 rounded-xl border hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}
                >
                  <p className="text-lg font-bold leading-none" style={{ color: 'var(--color-text-primary)' }}>{user.followers?.length ?? 0}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Followers</p>
                </button>
 
                {/* Following — clickable */}
                <button
                  onClick={() => setModal('following')}
                  className="text-center px-4 py-2 rounded-xl border hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}
                >
                  <p className="text-lg font-bold leading-none" style={{ color: 'var(--color-text-primary)' }}>{user.following?.length ?? 0}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Following</p>
                </button>
 
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
              {posts.map(post => (
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