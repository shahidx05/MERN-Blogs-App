import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { getAllPosts, getFollowingPosts, ToggleLike, ToggleBookmark } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { MdTrendingUp, MdPeople } from "react-icons/md";
import PostCard from "../components/PostCard";

const TABS = { FOR_YOU: "for_you", FOLLOWING: "following" };

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState(TABS.FOR_YOU);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const loadPosts = async (pageNumber = 1, tab = activeTab) => {
    try {
      setLoading(true);
      let data;

      if (tab === TABS.FOLLOWING) {
        data = await getFollowingPosts(pageNumber, 10);
      } else {
        data = await getAllPosts(pageNumber, 10, q);
      }

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
    loadPosts(1, activeTab);
  }, [q, activeTab]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

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
      if (res.success) setUser({ ...user, bookmarks: res.bookmarks });
    } catch (error) {
      console.log(error);
    }
  };
  
  const Skeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
        >
          <div className="h-44 animate-pulse" style={{ backgroundColor: "var(--color-bg-input)" }} />
          <div className="p-4 space-y-3">
            <div className="h-4 rounded animate-pulse w-3/4" style={{ backgroundColor: "var(--color-bg-input)" }} />
            <div className="h-3 rounded animate-pulse w-1/2" style={{ backgroundColor: "var(--color-bg-input)" }} />
            <div className="h-3 rounded animate-pulse w-full" style={{ backgroundColor: "var(--color-bg-input)" }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* ── Tabs ── */}
        <div
          className="flex items-center gap-1 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          {/* For You tab — always visible */}
          <button
            onClick={() => handleTabChange(TABS.FOR_YOU)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px"
            style={{
              borderColor: activeTab === TABS.FOR_YOU ? 'var(--color-primary)' : 'transparent',
              color: activeTab === TABS.FOR_YOU ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            <MdTrendingUp size={17} />
            For You
          </button>

          {/* Following tab — only if logged in */}
          {user && (
            <button
              onClick={() => handleTabChange(TABS.FOLLOWING)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px"
              style={{
                borderColor: activeTab === TABS.FOLLOWING ? 'var(--color-primary)' : 'transparent',
                color: activeTab === TABS.FOLLOWING ? 'var(--color-primary)' : 'var(--color-text-muted)',
              }}
            >
              <MdPeople size={17} />
              Following
            </button>
          )}

          {/* search label */}
          {q && (
            <span className="ml-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Results for "{q}"
              <button
                onClick={() => navigate("/")}
                className="ml-2 hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                ✕
              </button>
            </span>
          )}
        </div>

        {/* ── Loading skeleton ── */}
        {loading && posts.length === 0 && <Skeleton />}

        {/* ── Posts Grid ── */}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
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
            className="rounded-xl border py-20 text-center space-y-3"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-card)" }}
          >
            {activeTab === TABS.FOLLOWING ? (
              <>
                <p className="text-3xl">👥</p>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  No posts from people you follow yet
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Follow some authors to see their posts here
                </p>
                <button
                  onClick={() => handleTabChange(TABS.FOR_YOU)}
                  className="text-sm hover:underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  Browse all posts →
                </button>
              </>
            ) : (
              <>
                <p className="text-3xl">📭</p>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                  {q ? `No results for "${q}"` : "No posts yet"}
                </p>
                {q && (
                  <button
                    onClick={() => navigate("/")}
                    className="text-sm hover:underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Clear search
                  </button>
                )}
                {!q && user && (
                  <Link
                    to="/create-post"
                    className="inline-block text-sm font-medium hover:underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Be the first to write →
                  </Link>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Load More ── */}
        {page < totalPages && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => loadPosts(page + 1)}
              disabled={loading}
              className="px-6 py-2 rounded-lg text-sm font-medium border"
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