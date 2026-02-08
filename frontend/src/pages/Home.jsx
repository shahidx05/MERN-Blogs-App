import { useState, useEffect } from "react";
import { getAllPosts, ToggleLike } from "../services/api";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])

  const loadPosts = async () => {
    try {
      const data = await getAllPosts()
      if (data) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const toggleLike = async (id) => {
    try {
      await ToggleLike(id)
      loadPosts()
    } catch (error) {
      console.log(error)
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

        {/* Page Title */}
        <h1 className="text-2xl font-semibold">Latest Posts</h1>

        {/* Posts */}
        {posts.map((post) => {
          const isLiked = post.likes?.includes(user?._id);
          return (
            <div
              key={post._id}
              className="bg-white rounded shadow overflow-hidden"
            >
              {/* Post Image */}
              <img
                src={post.img}
                alt="Post"
                className="w-full h-56 object-cover"
              />

              {/* Post Content */}
              <div className="p-5 space-y-3">
                {/* Title */}
                <h2 className="text-xl font-semibold">
                  {post.title}
                </h2>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <img
                    src={post.author.profile_img}
                    alt="Author"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-700 hover:text-blue-700">
                    <Link to={`/user/${post.author.username}`} >
                      {post.author.username}
                    </Link>
                  </span>
                  <span>•</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>

                {/* Content preview */}
                <p className="text-gray-700 line-clamp-3">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  {/* Like UI */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLike(post._id)}
                      className={`transition ${isLiked
                        ? "text-red-500"
                        : "text-gray-600 hover:text-red-500"
                        }`}
                    >
                      <Heart className="w-5 h-5"
                      fill={isLiked ? "currentColor" : "none"}
                       />
                    </button>
                    <span className="text-sm font-medium">
                      {post.likes.length} Likes
                    </span>
                  </div>

                  {/* Read More */}
                  <Link
                    to={`/post/${post._id}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Home;
