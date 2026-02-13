import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBookmarks, ToggleBookmark, ToggleLike } from "../services/api";
import { Bookmark, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Bookmarks = () => {
    const { user, setUser } = useAuth()
    const [posts, setPosts] = useState([])

    const loadPosts = async () => {
        if (!user?.username) return;
        try {
            const data = await getBookmarks(user?.username)
            setPosts(data?.bookmarks)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadPosts();
    }, [user])

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

    if (!user) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-5xl mx-auto p-4 space-y-6">

                {/* Header */}
                <div className="flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-semibold">Saved Posts</h1>
                </div>

                {/* Posts */}
                {posts.map((post) => {
                    const isLiked = post.likes?.includes(user?._id);
                    const isBookmark = user?.bookmarks?.includes(post._id)
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
                                    <div className="flex items-center gap-5">

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
                                        <button
                                            onClick={() => toggleSave(post._id)}
                                            className={`transition ${isBookmark
                                                ? "text-blue-600"
                                                : "text-gray-600 hover:text-blue-600"
                                                }`}
                                            title="Save post"
                                        >
                                            <Bookmark
                                                className="w-5 h-5"
                                                fill={isBookmark ? "currentColor" : "none"}
                                            />
                                        </button>
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
                {posts.length === 0 && (
                    <p className="text-center text-gray-500">No posts found</p>
                )}
            </div>
        </div>
    );
};

export default Bookmarks;
