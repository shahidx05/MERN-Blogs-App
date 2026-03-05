import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getPost, Editpost, DeletePost } from "../services/api";
import { MdImage, MdClose, MdErrorOutline, MdDelete } from "react-icons/md";
import RichTextEditor from "../components/RichTextEditor";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [img, setImg] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        getPostData();
    }, []);

    const getPostData = async () => {
        try {
            const data = await getPost(id);
            if (data) {
                setTitle(data.post.title);
                setContent(data.post.content);
                setImg(data.post.img);
            }
        } catch (error) {
            setError("Failed to load post.");
            console.log(error);
        }
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImg(URL.createObjectURL(selectedFile));
        }
    };

    const removeImage = () => {
        setImg("");
        setFile(null);
    };

    const editBtnHandler = async () => {
        setError("");
        if (!title || !content || content === "<p></p>") {
            setError("Title and content are required.");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (file) formData.append("img", file);

            const data = await Editpost(formData, id);
            if (data.success) {
                navigate("/profile");
            } else {
                setError(data.message || "Failed to update post.");
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Something went wrong.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async () => {
        setDeleteLoading(true);
        try {
            await DeletePost(id);
            navigate('/profile');
        } catch (error) {
            setError("Failed to delete post.");
            console.log(error);
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

            {/* ── Delete Confirm Modal ── */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ backgroundColor: 'var(--color-bg-overlay)' }}
                >
                    <div
                        className="rounded-2xl border p-6 w-full max-w-sm space-y-4"
                        style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderColor: 'var(--color-border)',
                            boxShadow: 'var(--shadow-dropdown)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: 'color-mix(in srgb, var(--color-error) 12%, transparent)' }}
                            >
                                <MdDelete size={20} style={{ color: 'var(--color-error)' }} />
                            </div>
                            <div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                                    Delete this post?
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2 text-sm font-medium rounded-lg border"
                                style={{
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-secondary)',
                                    backgroundColor: 'var(--color-bg-input)',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deletePost}
                                disabled={deleteLoading}
                                className="flex-1 py-2 text-sm font-semibold rounded-lg"
                                style={{
                                    backgroundColor: 'var(--color-error)',
                                    color: '#fff',
                                    opacity: deleteLoading ? 0.7 : 1,
                                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        Edit Post
                    </h1>
                    <Link
                        to="/profile"
                        className="text-sm hover:underline"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        ← Cancel
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-error) 10%, transparent)',
                            color: 'var(--color-error)',
                            border: '1px solid color-mix(in srgb, var(--color-error) 25%, transparent)',
                        }}
                    >
                        <MdErrorOutline size={16} />
                        {error}
                    </div>
                )}

                {/* Cover Image */}
                <div
                    className="rounded-2xl border overflow-hidden"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: 'var(--color-border)',
                        boxShadow: 'var(--shadow-card)',
                    }}
                >
                    {img ? (
                        <div className="relative">
                            <img src={img} alt="Cover" className="w-full h-56 object-cover" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff' }}
                            >
                                <MdClose size={16} />
                            </button>
                        </div>
                    ) : (
                        <label
                            className="flex flex-col items-center justify-center h-40 cursor-pointer gap-2"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            <MdImage size={32} />
                            <span className="text-sm">Click to add a cover image</span>
                            <span className="text-xs">optional</span>
                            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </label>
                    )}
                </div>

                {/* Form */}
                <div
                    className="rounded-2xl border p-6 space-y-5"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: 'var(--color-border)',
                        boxShadow: 'var(--shadow-card)',
                    }}
                >
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Title
                        </label>
                        <input
                            type="text"
                            placeholder="Your post title..."
                            className="input-field text-base font-medium"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Content
                        </label>
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Write your story..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={editBtnHandler}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-text-inverse)',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold border"
                            style={{
                                borderColor: 'var(--color-error)',
                                color: 'var(--color-error)',
                                backgroundColor: 'color-mix(in srgb, var(--color-error) 8%, transparent)',
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditPost;