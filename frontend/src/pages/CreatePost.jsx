import { useState} from "react";
import { Createpost } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [img, setImg] = useState(null);
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!title || !content) {
            alert("Title and content are required");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (img) formData.append("img", img);

            const data = await Createpost(formData)
            if (data.success) {
                navigate("/profile");
            } else {
                alert(data.message || "Failed to create post");
            }
            navigate('/profile')
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow p-4">
                <h1 className="text-xl font-semibold text-center">
                    Create Post
                </h1>
            </div>

            <div className="max-w-3xl mx-auto p-4">
                <div className="bg-white p-6 rounded shadow space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            placeholder="Post title"
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
                            placeholder="Write your post..."
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Post Image (optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full"
                            onChange={(e) => setImg(e.target.files[0])}
                        />
                    </div>

                    <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                        onClick={submitHandler}
                    >
                        Publish Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
