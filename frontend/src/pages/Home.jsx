import { useState, useEffect } from "react";
import { getAllPosts } from "../services/api";

const Home = () => {
  const [posts, setPosts] = useState([])

  const loadPosts = async () => {
    try {
      const data = await getAllPosts()
      if(data){
        setPosts(data.posts)
      }
   } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

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
        {posts.map((post) => (
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
                <span className="font-medium text-gray-700">
                  {post.author.name}
                </span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>

              {/* Content preview */}
              <p className="text-gray-700 line-clamp-3">
                {post.content}
              </p>

              {/* Read More */}
              <button className="text-blue-600 font-medium hover:underline">
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
