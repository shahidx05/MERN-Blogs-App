import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { getAllPosts, getFollowingPosts, ToggleLike, ToggleBookmark } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { MdTrendingUp, MdPeople, MdAdd, MdInbox, MdClose, MdAutoAwesome, MdExplore } from "react-icons/md";
import PostCard from "../components/PostCard";
import RateLimitModal from "../components/RateLimitModal";

const TABS = { FOR_YOU: "for_you", FOLLOWING: "following" };

const GREETINGS = [
  "What will you discover today?",
  "Find something worth reading.",
  "Good stories, all in one place.",
  "Stories worth your attention.",
  "Your daily dose of great writing.",
];

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
  const tag = searchParams.get("tag") || "";

  // Pick a random greeting once per mount
  const [greeting] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);

  const loadPosts = async (pageNumber = 1, tab = activeTab) => {
    try {
      setLoading(true);
      let data;

      if (tab === TABS.FOLLOWING) {
        data = await getFollowingPosts(pageNumber, 12);
      } else {
        data = await getAllPosts(pageNumber, 12, q, tag);
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
  }, [q, tag, activeTab]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  const [rateLimitMsg, setRateLimitMsg] = useState("");

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
    } catch (error) {
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
      if (error.status === 429) {
        setRateLimitMsg("Too many likes! Slow down a bit.");
      }
    }
  };

  const toggleSave = async (id) => {
    try {
      const res = await ToggleBookmark(id);
      if (res.success) setUser({ ...user, bookmarks: res.bookmarks });
    } catch (error) {
      /* silently handle */
    }
  };

  // Collect unique tags from fetched posts for the trending row
  const trendingTags = [...new Set(posts.flatMap((p) => p.tags || []))].slice(0, 12);

  const Skeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border overflow-hidden bg-[var(--color-bg-card)] border-[var(--color-border)]"
        >
          <div className="h-44 animate-pulse bg-[var(--color-bg-input)]" />
          <div className="p-4 space-y-3">
            <div className="h-4 rounded animate-pulse w-3/4 bg-[var(--color-bg-input)]" />
            <div className="h-3 rounded animate-pulse w-1/2 bg-[var(--color-bg-input)]" />
            <div className="h-3 rounded animate-pulse w-full bg-[var(--color-bg-input)]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* Rate limit modal */}
      <RateLimitModal
        isOpen={!!rateLimitMsg}
        onClose={() => setRateLimitMsg("")}
        message={rateLimitMsg}
      />

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden border-b bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_8%,var(--color-bg))_0%,var(--color-bg)_100%)] border-[var(--color-border)]">
        {/* Decorative orb */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none bg-[var(--color-primary)]" />

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div className="space-y-2">
              {/* Contextual heading */}
              {q ? (
                <>
                  <div className="flex items-center gap-2">
                    <MdExplore size={20} className="text-[var(--color-primary)]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                      Search Results
                    </span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
                    Results for &ldquo;{q}&rdquo;
                  </h1>
                </>
              ) : tag ? (
                <>
                  <div className="flex items-center gap-2">
                    <MdTrendingUp size={20} className="text-[var(--color-primary)]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                      Filtered by Tag
                    </span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
                    #{tag}
                  </h1>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <MdAutoAwesome size={18} className="text-[var(--color-primary)]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                      {user ? `Welcome back, ${user.name?.split(" ")[0]}` : "The Blogiary Feed"}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
                    {greeting}
                  </h1>
                </>
              )}

              {/* Subtitle */}
              <p className="text-sm max-w-md text-[var(--color-text-muted)]">
                {q || tag
                  ? "Showing posts that match your search."
                  : "Read and discover posts from writers around the world."
                }
              </p>
            </div>

            {/* Write CTA */}
            <Link
              to={user ? "/create-post" : "/register"}
              className="btn-primary text-sm px-5 py-2.5 rounded-xl"
            >
              <MdAdd size={18} />
              Write a Post
            </Link>
          </div>

          {/* ── Trending Tags ── */}
          {trendingTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-hide">
              <MdTrendingUp size={15} className="flex-shrink-0 text-[var(--color-text-muted)]" />
              <span className="text-xs font-semibold flex-shrink-0 text-[var(--color-text-muted)]">
                Trending
              </span>
              <div className="w-px h-4 flex-shrink-0 bg-[var(--color-border)]" />
              {tag && (
                <button
                  onClick={() => navigate("/home")}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-full flex-shrink-0 font-medium transition-opacity hover:opacity-80 bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                >
                  #{tag}
                  <MdClose size={12} />
                </button>
              )}
              {trendingTags
                .filter((t) => t !== tag)
                .map((t) => (
                  <button
                    key={t}
                    onClick={() => navigate(`/home?tag=${t}`)}
                    className="tag flex-shrink-0"
                  >
                    #{t}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 border-b border-[var(--color-border)]">
          <button
            onClick={() => handleTabChange(TABS.FOR_YOU)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === TABS.FOR_YOU
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-text-muted)]"
            }`}
          >
            <MdTrendingUp size={17} />
            For You
          </button>

          {user && (
            <button
              onClick={() => handleTabChange(TABS.FOLLOWING)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === TABS.FOLLOWING
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-text-muted)]"
              }`}
            >
              <MdPeople size={17} />
              Following
            </button>
          )}

          {/* Active filter labels */}
          {(q || tag) && (
            <span className="ml-auto text-xs flex items-center gap-1.5 text-[var(--color-text-muted)]">
              {q && `"${q}"`}
              {tag && `#${tag}`}
              <button
                onClick={() => navigate("/home")}
                className="hover:underline flex-shrink-0 font-medium text-[var(--color-primary)]"
              >
                Clear
              </button>
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && posts.length === 0 && <Skeleton />}

        {/* Posts Grid */}
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

        {/* Empty state */}
        {posts.length === 0 && !loading && (
          <div className="rounded-xl border py-20 text-center space-y-3 border-[var(--color-border)] bg-[var(--color-bg-card)]">
            {activeTab === TABS.FOLLOWING ? (
              <>
                <MdPeople size={36} className="mx-auto text-[var(--color-text-muted)]" />
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Your following feed is empty
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Follow writers you enjoy to fill this feed with their stories
                </p>
                <button
                  onClick={() => handleTabChange(TABS.FOR_YOU)}
                  className="text-sm hover:underline font-medium text-[var(--color-primary)]"
                >
                  Explore all stories
                </button>
              </>
            ) : (
              <>
                <MdInbox size={36} className="mx-auto text-[var(--color-text-muted)]" />
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {q ? `Nothing matched "${q}"` : tag ? `No stories tagged #${tag} yet` : "No stories to show yet"}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {q || tag ? "Try a different search or browse all stories." : "Be the first to share something."}
                </p>
                {(q || tag) && (
                  <button
                    onClick={() => navigate("/home")}
                    className="text-sm hover:underline font-medium text-[var(--color-primary)]"
                  >
                    Clear filter
                  </button>
                )}
                {!q && !tag && user && (
                  <Link
                    to="/create-post"
                    className="inline-block text-sm font-medium hover:underline text-[var(--color-primary)]"
                  >
                    Write the first story
                  </Link>
                )}
              </>
            )}
          </div>
        )}

        {/* Load More */}
        {page < totalPages && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => loadPosts(page + 1)}
              disabled={loading}
              className="btn-ghost px-6 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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