import { useState, useEffect } from "react";
import { getAllPosts, ToggleLike, ToggleBookmark } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { MdSearch, MdTrendingUp } from "react-icons/md";
import PostCard from "../components/PostCard";

const Home = () => {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [q, setq] = useState("");

  const loadPosts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const data = await getAllPosts(pageNumber, 10, q);
      if (data) {
        setPosts((prev) =>
          pageNumber === 1 ? data.posts : [...prev, ...data.posts]
        );
        setTotalPages(data.totalPages);
        setPage(pageNumber);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    loadPosts(1);
  }, [q]);

  const toggleLike = async (id) => {
    setPosts((prev) =>
      prev.map((post) => {
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
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSave = async (id) => {
    try {
      const res = await ToggleBookmark(id);
      if (res.success) {
        setUser({ ...user, bookmarks: res.bookmarks });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MdTrendingUp size={22} style={{ color: "var(--color-primary)" }} />
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Latest Posts
            </h1>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <MdSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search articles..."
              className="input-field pl-9"
              value={q}
              onChange={(e) => setq(e.target.value)}
            />
          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && posts.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border overflow-hidden"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div
                  className="h-48 animate-pulse"
                  style={{ backgroundColor: "var(--color-bg-input)" }}
                />
                <div className="p-4 space-y-3">
                  <div
                    className="h-4 rounded animate-pulse w-3/4"
                    style={{ backgroundColor: "var(--color-bg-input)" }}
                  />
                  <div
                    className="h-3 rounded animate-pulse w-1/2"
                    style={{ backgroundColor: "var(--color-bg-input)" }}
                  />
                  <div
                    className="h-3 rounded animate-pulse w-full"
                    style={{ backgroundColor: "var(--color-bg-input)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Posts Grid ── */}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?._id}
                bookmarks={user?.bookmarks}
                onLike={user ? toggleLike : undefined}
                onBookmark={user ? toggleSave : undefined}
                showActions={false}
              />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {posts.length === 0 && !loading && (
          <div
            className="rounded-xl border py-16 text-center"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg-card)",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {q ? `No results for "${q}"` : "No posts yet"}
            </p>
            {q && (
              <button
                onClick={() => setq("")}
                className="mt-3 text-sm hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* ── Load More ── */}
        {page < totalPages && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => loadPosts(page + 1)}
              disabled={loading}
              className="px-6 py-2 rounded-lg text-sm font-medium border transition-colors"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-bg-card)",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;