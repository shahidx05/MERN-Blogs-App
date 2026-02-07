import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUser, getUserPosts } from '../services/api'

const PublicProfile = () => {
    const { username } = useParams()
    const [user, setUser] = useState(null)
    const [posts, setposts] = useState([])

    const loadProfile = async () => {
        try {
            const data = await getUser(username)
            if (data) {
                setUser(data.user)
            }
        } catch (error) {
            alert("something went wrong")
            console.log(error)
        }
    }

    const loadPosts = async () => {
        try {
            const data = await getUserPosts(user._id)
            if (data) {
                setposts(data.posts)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setposts([]); 
        loadProfile()
    }, [username])

    useEffect(() => {
        if (user?._id) {
            loadPosts();
        }
    }, [user])

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });


    if (!user) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-5xl mx-auto p-4 space-y-8">

                {/* Profile Header */}
                <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                    <img
                        src={user.profile_img}
                        alt="User"
                        className="w-32 h-32 rounded-full object-cover border mb-4"
                    />

                    <h2 className="text-xl font-semibold">
                        {user.name}
                    </h2>
                    <p className="text-gray-600">@{user.username}</p>

                    <p className="text-gray-500 text-sm mt-1">
                        Member since {formatDate(user.createdAt)}
                    </p>
                </div>

                {/* User Posts */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">
                        Posts by {user.name}
                    </h3>

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
                                    <h4 className="font-semibold text-lg mb-1">
                                        {post.title}
                                    </h4>

                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                        {post.content}
                                    </p>

                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>{formatDate(post.createdAt)}</span>
                                        <button className="text-blue-600 hover:underline">
                                            <Link to={`/post/${post._id}`}>
                                                Read more →
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {posts.length === 0 && (
                        <p className="text-center text-gray-500 mt-6">
                            This user hasn’t posted anything yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;