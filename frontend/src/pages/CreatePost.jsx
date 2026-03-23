import { useState } from "react";
import { Createpost, generatePostContent } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { MdImage, MdClose, MdErrorOutline, MdAutoAwesome } from "react-icons/md";
import RichTextEditor from "../components/RichTextEditor";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [img, setImg] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
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

    const handleGenerate = async () => {
        if (!title.trim()) {
            setError("Please enter a title first to generate content.");
            return;
        }
        setError("");
        setAiLoading(true);
        try {
            const data = await generatePostContent(title);
            if (data.success) {
                setContent(data.content);
            } else {
                setError(data.message || "Failed to generate content.");
            }
        } catch (err) {
            setError("AI generation failed. Please try again.");
            console.log(err);
        } finally {
            setAiLoading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required.");
            return;
        }
        if (!content || content === "<p></p>" || content.trim() === "") {
            setError("Content is required.");
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
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.log(err);
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
 
                {/* Error banner */}
                {error && (
                    <div
                        className="flex items-start gap-2.5 text-sm px-4 py-3 rounded-lg"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-error) 10%, transparent)',
                            color: 'var(--color-error)',
                            border: '1px solid color-mix(in srgb, var(--color-error) 25%, transparent)',
                        }}
                    >
                        <MdErrorOutline size={18} className="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
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
                            <img src={preview} alt="Cover" className="w-full h-56 object-cover" />
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
                            <span className="text-xs">optional · max 2MB</span>
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
                            Title <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your post title..."
                            className="input-field text-base font-medium"
                            value={title}
                            maxLength={100}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <p className="text-xs text-right" style={{ color: 'var(--color-text-muted)' }}>
                            {title.length}/100
                        </p>
                    </div>
 
                    {/* Content */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Content <span style={{ color: 'var(--color-error)' }}>*</span>
                            </label>
 
                            {/* ── AI Generate Button ── */}
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={aiLoading || !title.trim()}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                                style={{
                                    backgroundColor: aiLoading ? 'var(--color-bg-input)' : 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                                    color: 'var(--color-primary)',
                                    borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
                                    opacity: (!title.trim() || aiLoading) ? 0.6 : 1,
                                    cursor: (!title.trim() || aiLoading) ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {aiLoading ? (
                                    <>
                                        <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <MdAutoAwesome size={14} />
                                        Generate with AI
                                    </>
                                )}
                            </button>
                        </div>
 
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Write your story or click 'Generate with AI'..."
                        />
                    </div>
 
                    {/* Tags */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Tags
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. react, nodejs, webdev"
                            className="input-field"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Comma separated · max 5 tags
                        </p>
                        {tags && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.split(",").map(t => t.trim()).filter(Boolean).slice(0, 5).map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
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
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-text-inverse)',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Publishing...
                                </>
                            ) : 'Publish Post'}
                        </button>
                    </div>
                </div>
 
            </div>
        </div>
    );
};
 
export default CreatePost;