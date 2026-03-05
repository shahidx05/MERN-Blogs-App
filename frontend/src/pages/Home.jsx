import { useState, useEffect } from "react";
import { getAllPosts, ToggleLike, ToggleBookmark } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  MdSearch, MdFavorite, MdFavoriteBorder,
  MdBookmark, MdBookmarkBorder, MdArrowForward
} from "react-icons/md";
import PostCard from "../components/PostCard";


const Home = () => {
  const { user, setUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [q, setq] = useState("");

  const loadPosts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const data = await getAllPosts(pageNumber, 10, q)

      if (data) {
        setPosts((prev) => [...prev, ...data.posts])
        setTotalPages(data.totalPages)
        setPage(pageNumber);
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPosts([]);     // clear old posts
    setPage(1);       // reset page
    loadPosts(1);
  }, [q])

  const toggleLike = async (id) => {
    setPosts(prev =>
      prev.map(post => {
        if (post._id === id) {
          const hasLiked = post.likes.includes(user?._id)
          const updatedLikes = hasLiked
            ? post.likes.filter((userId) => userId !== user?._id)
            : [...post.likes, user?._id];
          return { ...post, likes: updatedLikes };
        }
        return post
      }
      )
    );

    try {
      await ToggleLike(id)
    } catch (error) {
      console.log(error)
    }
  }

  const toggleSave = async (id) => {
    try {
      const res = await ToggleBookmark(id);
      if (res.success) {
        setUser({ ...user, bookmarks: res.bookmarks });
      }
    } catch (error) {
      console.log("Error bookmarking post:", error);
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Container */}
      <div className="max-w-5xl mx-auto p-4 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Latest Posts</h1>

          {/* Search Bar UI Only */}
          <div className="relative w-full sm:w-80 shadow-sm rounded-lg">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-black transition"
              value={q}
              onChange={e => setq(e.target.value)}
            />
            <MdSearch className="w-5 h-5 text-gray-400 absolute left-3 top-3"/>
          </div>
        </div>

        {/* Posts */}
        {posts.map((post) => {
          return (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={user?._id}
              bookmarks={user.bookmarks}
              onLike={toggleLike}
              onBookmark={toggleSave}
              showActions={false}
            />
          )
        })}
        {page < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => loadPosts(page + 1)}
              disabled={loading}
              className="px-6 py-2 border border-gray-400 text-gray-700 
                 rounded-md hover:bg-gray-100 transition
                 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        {posts.length === 0 && !loading && (
          <p className="text-center text-gray-500">No posts found</p>
        )}


      </div>
    </div>
  );
};

export default Home;
