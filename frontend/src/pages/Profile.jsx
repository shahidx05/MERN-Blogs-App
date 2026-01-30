import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyPosts, DeletePost } from "../services/api";

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await getMyPosts();
    setPosts(data.posts);
  };

  const deletePost = async (id) => {
    try {
      await DeletePost(id)
      loadPosts();
    } catch (error) {
      alert("something went wrong")
      console.log(error)
    }
  }

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4">
        <h1 className="text-xl font-semibold text-center">Profile</h1>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <img
            src={user.user.profile_img}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border mb-4"
          />

          <button className="text-sm text-blue-600 hover:underline mb-4">
            Change Avatar
          </button>

          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold">{user.user.name}</h2>
            <p className="text-gray-600">@{user.user.username}</p>
            <p className="text-gray-500 text-sm">{user.user.email}</p>
          </div>
        </div>

        {/* Create Post Button */}
        <div className="flex justify-end">
          <Link
            to="/create-post"
            className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
          >
            Create Post
          </Link>
        </div>

        {/* My Posts */}
        <div>
          <h2 className="text-lg font-semibold mb-4">My Posts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded shadow overflow-hidden"
              >
                {/* Post Image */}
                {post.img && (
                  <img
                    src={post.img}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                )}

                {/* Post Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {post.content}
                  </p>

                  <div className="flex justify-end gap-4">
                    <button className="text-blue-600 text-sm hover:underline">
                      <Link to={`/edit-post/${post._id}`} >Edit</Link>
                    </button>
                    <button className="text-red-600 text-sm hover:underline"
                      onClick={() => {
                        deletePost(post._id)
                      }
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              No posts yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
