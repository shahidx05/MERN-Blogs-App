import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost } from "../services/api";

const PostDetails = () => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const loadPost = async () => {
        try {
            const data = await getPost(id)
            setPost(data.post)
            console.log(data)
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
                <div className="flex justify-between items-center">
                    <button className="text-blue-600 hover:underline">
                        <Link to='/'>
                            ← Back to Home
                        </Link>
                    </button>

                    <div className="flex gap-4">
                        <button className="text-gray-600 hover:text-black">
                            Like
                        </button>
                        <button className="text-gray-600 hover:text-black">
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
