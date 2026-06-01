import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyPosts, DeletePost, Editprofile, ToggleLike, ToggleBookmark } from "../services/api";
import { MdEdit, MdBookmark, MdAdd, MdCameraAlt, MdClose, MdArticle } from "react-icons/md";
import PostCard from "../components/PostCard";
import FollowModal from "../components/FollowModal";
import RateLimitModal from "../components/RateLimitModal";
import PageLoader from "../components/PageLoader";

const Profile = () => {
  const { user, fetchUserProfile, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [rateLimitMsg, setRateLimitMsg] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getMyPosts();
      setPosts(data.posts);
    } catch (err) {
      /* silently handle */
    }
  };

  const toggleLike = async (id) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === id) {
          const hasLiked = post.likes.includes(user?._id);
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter((uid) => uid !== user?._id)
              : [...post.likes, user?._id],
          };
        }
        return post;
      })
    );
    try {
      await ToggleLike(id);
    } catch (err) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id === id) {
            const hasLiked = post.likes.includes(user?._id);
            return {
              ...post,
              likes: hasLiked
                ? post.likes.filter((uid) => uid !== user?._id)
                : [...post.likes, user?._id],
            };
          }
          return post;
        })
      );
      if (err.status === 429) {
        setRateLimitMsg("Too many likes! Slow down a bit.");
      }
    }
  };

  const toggleSave = async (id) => {
    try {
      const res = await ToggleBookmark(id);
      if (res.success) setUser({ ...user, bookmarks: res.bookmarks });
    } catch (err) { /* silently handle */ }
  };

  const deletePost = async (id) => {
    try {
      await DeletePost(id);
      loadPosts();
    } catch (err) {
      setError("Failed to delete post. Please try again.");
    }
  };

  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      setUser((prev) => ({ ...prev, profile_img: URL.createObjectURL(file) }));
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
    }
  };

  if (!user) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* Rate limit modal */}
      <RateLimitModal
        isOpen={!!rateLimitMsg}
        onClose={() => setRateLimitMsg("")}
        message={rateLimitMsg}
      />

      {/* Modal */}
      {modal && (
        <FollowModal
          username={user.username}
          type={modal}
          onClose={() => setModal(null)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-2.5 text-sm px-4 py-3 rounded-lg error-surface">
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError("")}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <MdClose size={16} />
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-2xl border overflow-hidden bg-[var(--color-bg-card)] border-[var(--color-border)] shadow-[var(--shadow-card)]">
          {/* Banner */}
          <div className="h-32 w-full bg-[linear-gradient(135deg,var(--color-primary)_0%,#7c3aed_50%,#a78bfa_100%)]" />

          <div className="px-6 pb-7">
            {/* Avatar + Stats row */}
            <div className="flex items-end justify-between -mt-14 mb-5 flex-wrap gap-y-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.profile_img}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-[var(--color-bg-card)] shadow-[0_0_0_3px_var(--color-primary)]"
                />
                <label
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:opacity-90 transition-opacity"
                  title="Change avatar"
                >
                  <MdCameraAlt size={15} />
                  <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </label>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-center px-5 py-2.5 rounded-xl border bg-[var(--color-bg-input)] border-[var(--color-border)]">
                  <p className="text-xl font-bold leading-none text-[var(--color-text-primary)]">
                    {posts.length}
                  </p>
                  <p className="text-xs mt-0.5 text-[var(--color-text-muted)]">Posts</p>
                </div>

                <button
                  onClick={() => setModal("followers")}
                  className="text-center px-5 py-2.5 rounded-xl border hover:opacity-75 transition-opacity bg-[var(--color-bg-input)] border-[var(--color-border)]"
                >
                  <p className="text-xl font-bold leading-none text-[var(--color-text-primary)]">
                    {user.followers?.length ?? 0}
                  </p>
                  <p className="text-xs mt-0.5 text-[var(--color-text-muted)]">Followers</p>
                </button>

                <button
                  onClick={() => setModal("following")}
                  className="text-center px-5 py-2.5 rounded-xl border hover:opacity-75 transition-opacity bg-[var(--color-bg-input)] border-[var(--color-border)]"
                >
                  <p className="text-xl font-bold leading-none text-[var(--color-text-primary)]">
                    {user.following?.length ?? 0}
                  </p>
                  <p className="text-xs mt-0.5 text-[var(--color-text-muted)]">Following</p>
                </button>
              </div>
            </div>

            {/* Name / username / bio */}
            <div className="mb-5">
              <h1 className="text-2xl font-bold leading-tight text-[var(--color-text-primary)]">
                {user.name}
              </h1>
              <p className="text-sm mt-0.5 font-medium text-[var(--color-text-muted)]">
                @{user.username}
              </p>
              <p className="text-xs mt-0.5 text-[var(--color-text-muted)]">
                {user.email}
              </p>

              {user.bio ? (
                <p className="text-sm mt-3 leading-relaxed max-w-lg text-[var(--color-text-secondary)]">
                  {user.bio}
                </p>
              ) : (
                <p className="text-sm mt-3 italic text-[var(--color-text-muted)]">
                  No bio yet.{" "}
                  <Link to="/edit-profile" className="not-italic hover:underline text-[var(--color-primary)]">
                    Add one
                  </Link>
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              <Link to="/edit-profile" className="btn-ghost text-sm px-4 py-2 rounded-lg">
                <MdEdit size={15} /> Edit Profile
              </Link>
              <Link to="/bookmarks" className="btn-secondary text-sm px-4 py-2 rounded-lg">
                <MdBookmark size={15} /> Saved Posts
              </Link>
            </div>
          </div>
        </div>

        {/* My Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2 text-[var(--color-text-primary)]">
              <MdArticle size={18} className="text-[var(--color-primary)]" />
              My Posts
            </h2>
            <Link to="/create-post" className="btn-primary text-sm px-4 py-2 rounded-lg">
              <MdAdd size={16} /> New Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-xl border py-14 text-center border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <p className="text-sm text-[var(--color-text-muted)]">No posts yet.</p>
              <Link
                to="/create-post"
                className="inline-block mt-3 text-sm font-medium hover:underline text-[var(--color-primary)]"
              >
                Write your first post
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