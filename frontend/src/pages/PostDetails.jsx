import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost, ToggleLike, getPostComments, CreateComment, DeleteComment } from "../services/api";
import { Heart, Share2, Trash2, MessageCircle, CaseLower } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const PostDetails = () => {
    const { user } = useAuth()
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [content, setContent] = useState('')
    const [myComment, setMycomment] = useState(false)
    const [sortType, setSortType] = useState("latest");

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

    const loadComments = async () => {
        try {
            const res = await getPostComments(id)
            if (res) {
                setComments(res.comments)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePostComment = async () => {
        try {
            if (!content) return
            const res = await CreateComment(id, content)
            if (res) {
                loadComments()
                setContent('')
            }
        } catch (error) {
            alert("something went wrong")
            console.log(error)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await DeleteComment(commentId)
            loadComments()
        } catch (error) {
            alert("something went wrong")
            console.log(error)
        }
    }

    const handleMyComment = () => {
        setMycomment((prev) => !prev)
    }

    useEffect(() => {
        loadPost()
        loadComments()
    }, [])

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    let filteredComments = [...comments]

    filteredComments = myComment
        ? filteredComments.filter(c => c.author._id === user?._id)
        : filteredComments;

    if (sortType === "latest") {
        filteredComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
        filteredComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

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
                                {formatDate(post.createdAt)}
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
                {/* Comments Section */}
                <div className="bg-white rounded shadow p-6 space-y-6">

                    {/* Comments Header */}
                    <div className="flex items-center justify-between">

                        {/* Left: Count */}
                        <h2 className="text-xl font-semibold">
                            Comments ({filteredComments.length})
                        </h2>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-3">

                            {/* My Comments Toggle (UI only) */}
                            <button
                                className={`text-sm px-3 py-1 rounded border transition ${myComment
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                                onClick={handleMyComment}
                            >
                                My Comments
                            </button>


                            {/* Sort Dropdown (UI only) */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Sort:</span>
                                <select
                                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={sortType}
                                    onChange={(e) => setSortType(e.target.value)}
                                >
                                    <option value="latest">Latest</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>


                        </div>
                    </div>


                    {/* Add Comment */}
                    <div className="flex gap-3">
                        <img
                            src={user?.profile_img || "https://res.cloudinary.com/dcezxzzxo/image/upload/v1769693349/posts/ch40q2asunurvlf1ljod.jpg"}
                            alt="user"
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="flex-1">
                            <textarea
                                placeholder="Write a comment..."
                                className="w-full border rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                rows={2}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            <div className="flex justify-end mt-2">
                                <button className="bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800"
                                    onClick={handlePostComment}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {filteredComments.map((c) => (
                            <div key={c._id} className="flex gap-3">
                                {c.author.profile_img && (
                                    <img
                                        src={c.author.profile_img}
                                        alt="profile_img"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                )}

                                <div className={`rounded-lg p-3 flex-1 ${c.author._id === user._id ? "bg-blue-50 border border-blue-200" : "bg-gray-100 "}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-sm text-gray-900">
                                            {c.author.username}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">
                                                {formatDate(c.createdAt)}
                                            </span>
                                            {user && (user._id === c.author._id || user._id === post.author._id) &&
                                                <button
                                                    onClick={() => handleDeleteComment(c._id)}
                                                    className="text-gray-400 hover:text-red-600 transition p-1 rounded-full hover:bg-red-50"
                                                    title="Delete comment"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            }
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {c.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>

                    {comments.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                            <MessageCircle className="w-8 h-8 mb-2" />
                            <p className="text-sm">No comments yet</p>
                            <p className="text-xs mt-1">Be the first to comment</p>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default PostDetails;
