import { useState, useRef } from "react";
import { Createpost } from "../services/api";
import { useNavigate } from "react-router-dom";
import { MdImage, MdClose, MdErrorOutline } from "react-icons/md";
import RichTextEditor from "../components/RichTextEditor";
import AIAssistMenu from "../components/AIAssistMenu";
import BackButton from "../components/BackButton";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [img, setImg] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // AI injection: when set, RichTextEditor will force-replace its content
    const [aiContent, setAiContent] = useState(null);

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

    /** Called by AIAssistMenu when user clicks "Apply" in the preview modal (or auto-inserts for generate) */
    const handleAiApply = (html) => {
        setAiContent(html);   // triggers RichTextEditor's externalContent effect
        setError("");
    };

    /** Called by RichTextEditor after it applies the external AI content */
    const handleAiApplied = () => {
        setAiContent(null);   // reset so future user edits don't re-trigger
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        // Validate using plain text length, not raw HTML (avoids false "empty" on <p></p>)
        const plainText = content.replace(/<[^>]+>/g, "").trim();
        if (!plainText) {
            setError("Content is required. Please write something or use AI Assist to generate content.");
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                        Create Post
                    </h1>
                    <BackButton />
                </div>

                {/* Error banner */}
                {error && (
                    <div className="flex items-start gap-2.5 text-sm px-4 py-3 rounded-lg error-surface">
                        <MdErrorOutline size={18} className="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Cover Image */}
                <div className="card rounded-2xl border overflow-hidden">
                    {preview ? (
                        <div className="relative">
                            <img src={preview} alt="Cover" className="w-full aspect-video object-cover" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/55 text-white"
                            >
                                <MdClose size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center h-40 cursor-pointer gap-2 text-[var(--color-text-muted)]">
                            <MdImage size={32} />
                            <span className="text-sm">Click to add a cover image</span>
                            <span className="text-xs">optional · max 2MB</span>
                            <input type="file" accept="image/*" hidden onChange={handleImage} />
                        </label>
                    )}
                </div>

                {/* Form */}
                <div className="card rounded-2xl border p-6 space-y-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                            Title <span className="text-[var(--color-error)]">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your post title..."
                            className="input-field text-base font-medium"
                            value={title}
                            maxLength={100}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <p className="text-xs text-right text-[var(--color-text-muted)]">
                            {title.length}/100
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                                Content <span className="text-[var(--color-error)]">*</span>
                            </label>

                            {/* ── AI Assist Menu ── */}
                            <AIAssistMenu
                                title={title}
                                content={content}
                                onApply={handleAiApply}
                            />
                        </div>

                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Write your story or use ✨ AI Assist to generate content..."
                            externalContent={aiContent}
                            onExternalApplied={handleAiApplied}
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                            Tags
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. react, nodejs, webdev"
                            className="input-field"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <p className="text-xs text-[var(--color-text-muted)]">
                            Comma separated · max 5 tags
                        </p>
                        {tags && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.split(",").map(t => t.trim()).filter(Boolean).slice(0, 5).map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]"
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
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)] disabled:opacity-70 disabled:cursor-not-allowed"
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