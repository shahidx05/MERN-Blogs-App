import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyPosts, DeletePost, Editprofile } from "../services/api";
import { Bookmark, Edit3 } from "lucide-react";

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

  const deletePost = async (id) => {
    try {
      await DeletePost(id)
      loadPosts();
    } catch (error) {
      alert("something went wrong")
      console.log(error)
    }
  }

  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setUser(prev => ({
        ...prev,
        profile_img: previewUrl,
      }));

      const formData = new FormData();
      formData.append("profile_img", file);

      const data = await Editprofile(formData);

      if (!data.success) {
        alert(data.message || "Avatar update failed");
        return;
      }

      await fetchUserProfile();

    } catch (error) {
      console.log(error);
      alert("something went  m wrong");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Loading...</p>;
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <img
            src={user.profile_img}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border mb-4"
          />

          <label className="text-sm text-blue-600 hover:underline mb-4 cursor-pointer">
            Change Avatar
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </label>


          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          <div className="flex gap-4 mt-6">

            {/* Edit Profile Button */}
            <Link
              to="/edit-profile"
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition"
            >
              <Edit3 size={16} />
              Edit Profile
            </Link>

            {/* Saved Bookmarks Button */}
            <Link
              to="/bookmarks"
              className="flex items-center gap-2 px-4 py-2 text-sm border border-blue-600 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
            >
              <Bookmark size={16} />
              Saved Posts
            </Link>

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