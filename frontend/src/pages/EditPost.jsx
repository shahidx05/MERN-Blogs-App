import { useState, useEffect } from "react";
import { Createpost } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, Editpost, DeletePost } from "../services/api";
const EditPost = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [img, setImg] = useState(null);

    const getPostData = async () => {
        try {
            const data = await getPost(id)
            if (data) {
                setTitle(data.post.title)
                setContent(data.post.content)
                setImg(data.post.img)
            }

        } catch (error) {
            alert("something went wrong")
            console.log(error);
        }
    }

    const editBtnHandler = async () => {
        if (!title || !content) {
            alert("Title and content are required");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (img) formData.append("img", img);

            const data = await Editpost(formData, id)
            if (data.success) {
                navigate("/profile");
            } else {
                alert(data.message || "Failed to Edit post");
            }
            navigate('/profile')
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    }

    const deletePost = async () => {
        try {
            await DeletePost(id)
            navigate('/profile')
        } catch (error) {
            alert("something went wrong")
            console.log(error)
        }
    }


    useEffect(() => {
        getPostData()
    }, [])


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow p-4">
                <h1 className="text-xl font-semibold text-center">
                    Edit Post
                </h1>
            </div>

            <div className="max-w-3xl mx-auto p-4 space-y-4">
                {/* Current Image */}
                <div className="bg-white p-4 rounded shadow flex justify-center">
                    {!img ? (
                        <p>No image</p>
                    ) : (
                        <img
                            src={img}
                            alt="Post"
                            className="rounded object-cover"
                        />
                    )}
                </div>

                {/* Edit Form */}
                <div className="bg-white p-6 rounded shadow space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Content
                        </label>
                        <textarea
                            rows="6"
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Replace Image (optional)
                        </label>
                        <input
                            type="file"
                            className="w-full"
                            onChange={(e) => setImg(e.target.files[0])}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
                            onClick={editBtnHandler}
                        >
                            Update Post
                        </button>

                        <button className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                            onClick={deletePost}
                        >
                            Delete Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPost;
