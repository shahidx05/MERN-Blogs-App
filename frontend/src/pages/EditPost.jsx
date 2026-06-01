import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, Editpost, DeletePost } from "../services/api";
import { MdImage, MdClose, MdErrorOutline, MdDelete } from "react-icons/md";
import RichTextEditor from "../components/RichTextEditor";
import AIAssistMenu from "../components/AIAssistMenu";
import BackButton from "../components/BackButton";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [img, setImg] = useState("");
    const [file, setFile] = useState(null);
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // AI injection: when set, RichTextEditor will force-replace its content
    const [aiContent, setAiContent] = useState(null);

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
                setTags(data.post.tags?.join(", ") || "");
            }
        } catch (error) {
            setError("Failed to load post.");
            console.error(error);
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

    /** Called by AIAssistMenu when user clicks "Apply" in preview modal */
    const handleAiApply = (html) => {
        setAiContent(html);
        setError("");
    };

    /** Called by RichTextEditor after external AI content has been applied */
    const handleAiApplied = () => {
        setAiContent(null);
    };

    const editBtnHandler = async () => {
        setError("");

        // Validate using plain text, not raw HTML
        const plainText = content.replace(/<[^>]+>/g, "").trim();
        if (!title || !plainText) {
            setError("Title and content are required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (file) formData.append("img", file);
            formData.append("tags", tags);

            const data = await Editpost(formData, id);
            if (data.success) {
                navigate("/profile");
            } else {
                setError(data.message || "Failed to update post.");
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Something went wrong.");
            console.error(error);
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
            console.error(error);
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">

            {/* ── Delete Confirm Modal ── */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[var(--color-bg-overlay)]">
                    <div className="card rounded-2xl border p-6 w-full max-w-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)]">
                                <MdDelete size={20} className="text-[var(--color-error)]" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                                    Delete this post?
                                </p>
                                <p className="text-xs mt-0.5 text-[var(--color-text-muted)]">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn-ghost flex-1 py-2 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deletePost}
                                disabled={deleteLoading}
                                className="btn-danger flex-1 py-2 text-sm justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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
                    <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                        Edit Post
                    </h1>
                    <BackButton />
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg error-surface">
                        <MdErrorOutline size={16} />
                        {error}
                    </div>
                )}

                {/* Cover Image */}
                <div className="card rounded-2xl border overflow-hidden">
                    {img ? (
                        <div className="relative">
                            <img src={img} alt="Cover" className="w-full aspect-video object-cover" />
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
                            <span className="text-xs">optional</span>
                            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </label>
                    )}
                </div>

                {/* Form */}
                <div className="card rounded-2xl border p-6 space-y-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
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
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                                Content
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
                            placeholder="Write your story..."
                            externalContent={aiContent}
                            onExternalApplied={handleAiApplied}
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
                        <p className="text-xs mt-1 text-[var(--color-text-muted)]">
                            Max 5 tags
                        </p>
                        {/* Tag preview */}
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

                    {/* Buttons */}
                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={editBtnHandler}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="btn-error-outline"
                        >
                            <MdDelete size={13} /> Delete
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditPost;