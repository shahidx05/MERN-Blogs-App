import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost, ToggleLike } from "../services/api";
import { Heart, Share2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PostDetails = () => {
    const { user } = useAuth()
    const { id } = useParams()
    const [post, setPost] = useState(null)

    const loadPost = async () => {
        try {
            const data = await getPost(id)
            setPost(data.post)
        } catch (error) {
            console.log(error)
        }
    }

    const toggleLike = async () => {
        try {
            await ToggleLike(id)
            loadPost()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadPost()
    }, [])

    if (!post) {
        return <p className="text-center mt-10">Loading post...</p>;
    }

    const isLiked = post.likes?.includes(user?._id);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto p-4 space-y-6">

                {/* Post Image */}
                <div className="bg-white rounded shadow overflow-hidden">
                    <img
                        src={post.img}
                        alt="img"
                        className="w-full h-72 object-cover"
                    />
                </div>

                {/* Post Content */}
                <div className="bg-white rounded shadow p-6 space-y-4">

                    {/* Title */}
                    <h1 className="text-3xl font-semibold">
                        {post.title}
                    </h1>

                    {/* Author Info */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <img
                            src={post.author.profile_img}
                            alt="Author"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium text-gray-800">
                                {post.author.username}
                            </p>
                            <p>
                                Sep 25, 2025 • 5 min read
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-gray-800 leading-relaxed space-y-4">
                        <p>
                            {post.content}
                        </p>
                        <p>
                            This is the full content of the blog post. Unlike the
                            home page preview, this section contains the complete
                            article with all paragraphs and details.
                        </p>

                        <p>
                            You can structure this content however you want later —
                            markdown, rich text, or plain text.
                        </p>

                        <p>
                            This layout is clean, readable, and works well for long
                            articles.
                        </p>
                    </div>
                </div>

                {/* Actions (optional) */}
                <div className="flex justify-between items-center bg-white rounded shadow p-4">

                    <Link
                        to="/"
                        className="text-blue-600 hover:underline"
                    >
                        ← Back to Home
                    </Link>

                    {/* Like & Share UI */}
                    <div className="flex items-center gap-6">

                        {/* Like */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleLike}
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

                        {/* Share */}
                        <button className="flex items-center gap-2 text-gray-600 hover:text-black transition">
                            <Share2 className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                Share
                            </span>
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default PostDetails;
