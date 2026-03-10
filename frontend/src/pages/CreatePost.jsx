import { useState } from "react";
import { Createpost } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { MdImage, MdClose, MdErrorOutline } from "react-icons/md";
import RichTextEditor from "../components/RichTextEditor";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [img, setImg] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImg(null);
        setPreview(null);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
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
            if (img) formData.append("img", img);
            formData.append("tags", tags);

            const data = await Createpost(formData);
            if (data.success) {
                navigate("/profile");
            } else {
                setError(data.message || "Failed to create post.");
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Something went wrong.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        Create Post
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
                    {preview ? (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Cover"
                                className="w-full h-56 object-cover"
                            />
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
                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>optional</span>
                            <input type="file" accept="image/*" hidden onChange={handleImage} />
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

                    {/* Tags input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Add tags separated by commas  e.g. react, nodejs, webdev"
                            className="input-field"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                            Max 5 tags
                        </p>
                        {/* Tag preview */}
                        {tags && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.split(",").map(t => t.trim()).filter(Boolean).slice(0, 5).map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-0.5 rounded-full"
                                        style={{
                                            backgroundColor: 'var(--color-primary-light)',
                                            color: 'var(--color-primary)'
                                        }}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-1">
                        <button
                            onClick={submitHandler}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-lg text-sm font-semibold"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-text-inverse)',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreatePost;