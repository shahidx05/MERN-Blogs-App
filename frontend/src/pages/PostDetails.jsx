import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPost, ToggleLike, getPostComments, CreateComment, DeleteComment, ToggleBookmark } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
    MdFavorite, MdFavoriteBorder, MdBookmark, MdBookmarkBorder,
    MdDelete, MdArrowBack, MdShare, MdCheck, MdChatBubbleOutline, MdVisibility,
    MdEdit
} from "react-icons/md";
import RateLimitModal from "../components/RateLimitModal";
import PageLoader from "../components/PageLoader";
import BackButton from "../components/BackButton";


const PostDetails = () => {
    const { user, setUser } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [myComment, setMycomment] = useState(false);
    const [sortType, setSortType] = useState("latest");
    const [copied, setCopied] = useState(false);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [rateLimitMsg, setRateLimitMsg] = useState("");

    const loadPost = async () => {
        try {
            const data = await getPost(id);
            setPost(data.post);
        } catch (error) { /* silently handle */ }
    };

    const loadComments = async (page = 1) => {
        try {
            setCommentLoading(true);
            const res = await getPostComments(id, page, 5);
            if (res) {
                setComments((prev) => (page === 1 ? res.comments : [...prev, ...res.comments]));
                setHasMoreComments(res.hasMore);
                setCommentPage(page);
            }
        } catch (error) { /* silently handle */ }
        finally { setCommentLoading(false); }
    };

    useEffect(() => {
        loadPost();
        loadComments(1);
    }, []);

    const toggleLike = async () => {
        try {
            await ToggleLike(id);
            loadPost();
        } catch (error) {
            if (error.status === 429) {
                setRateLimitMsg("Too many likes! Slow down a bit.");
            }
        }
    };

    const toggleSave = async () => {
        try {
            const res = await ToggleBookmark(id);
            if (res.success) setUser({ ...user, bookmarks: res.bookmarks });
        } catch (error) { /* silently handle */ }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePostComment = async () => {
        try {
            if (!content.trim()) return;
            const res = await CreateComment(id, content);
            if (res) { loadComments(); setContent(""); }
        } catch (error) {
            if (error.status === 429) {
                setRateLimitMsg("Too many comments! Please slow down.");
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await DeleteComment(commentId);
            loadComments();
        } catch (error) { /* silently handle */ }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
        });

    if (!post) {
        return (
            <PageLoader text="Loading post..." />
        );
    }

    let filteredComments = [...comments];

    filteredComments = myComment
        ? filteredComments.filter((c) => c.author._id === user?._id)
        : filteredComments;

    if (sortType === "latest") {
        filteredComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
        filteredComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    const isLiked = post.likes?.includes(user?._id);
    const isBookmark = user?.bookmarks?.includes(id);

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <RateLimitModal
                isOpen={!!rateLimitMsg}
                onClose={() => setRateLimitMsg("")}
                message={rateLimitMsg}
            />
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* Back */}
                <div className="flex justify-end">
                    <BackButton onClick={() => navigate("/home")} />
                </div>

                {/* Post Card */}
                <div className="card rounded-2xl border overflow-hidden">
                    {/* Cover Image */}
                    {post.img && (
                        <img
                            src={post.img}
                            alt={post.title}
                            className="w-full aspect-video object-cover"
                        />
                    )}

                    <div className="p-6 space-y-5">
                        {/* Title */}
                        <h1 className="text-2xl font-bold leading-snug text-[var(--color-text-primary)]">
                            {post.title}
                        </h1>

                        {/* Tags — clickable */}
                        {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, i) => (
                                    <Link key={i} to={`/home?tag=${tag}`} className="tag">
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Author row */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <Link to={`/user/${post.author.username}`} className="flex items-center gap-3">
                                <img
                                    src={post.author.profile_img}
                                    alt={post.author.username}
                                    className="w-10 h-10 rounded-full object-cover border border-[var(--color-border)]"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
                                        {post.author.username}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {formatDate(post.createdAt)}
                                    </p>
                                </div>
                            </Link>

                            {/* Action buttons */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                                    <MdVisibility size={18} />
                                    <span className="font-medium">{post.views ?? 0}</span>
                                </span>

                                <button
                                    onClick={toggleLike}
                                    className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? "text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"}`}
                                >
                                    {isLiked ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
                                    <span className="font-medium">{post.likes.length}</span>
                                </button>

                                <button
                                    onClick={toggleSave}
                                    className={`transition-colors ${isBookmark ? "text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"}`}
                                    title={isBookmark ? "Unsave" : "Save"}
                                >
                                    {isBookmark ? <MdBookmark size={20} /> : <MdBookmarkBorder size={20} />}
                                </button>

                                <button
                                    onClick={handleShare}
                                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors bg-[var(--color-bg-input)] ${
                                        copied
                                            ? "border-[var(--color-success)] text-[var(--color-success)] hover:bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)]"
                                            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                                    }`}
                                >
                                    {copied ? <MdCheck size={15} /> : <MdShare size={15} />}
                                    {copied ? "Copied!" : "Share"}
                                </button>

                                {/* Edit post — only author */}
                                {user?._id === post.author._id && (
                                    <button
                                        onClick={() => navigate(`/edit-post/${post._id}`)}
                                        className="btn-success-outline"
                                    >
                                        <MdEdit size={13} /> Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[var(--color-border)]" />

                        {/* Post content — rich text */}
                        <div
                            className="prose-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>

                {/* Comments Section */}
                <div className="card rounded-2xl border p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <MdChatBubbleOutline size={18} className="text-[var(--color-primary)]" />
                            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                                Comments
                            </h2>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                                {filteredComments.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setMycomment((prev) => !prev)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                                    myComment
                                        ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] border-[var(--color-primary)]"
                                        : "bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] border-[var(--color-border)]"
                                }`}
                            >
                                My Comments
                            </button>

                            <select
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value)}
                                className="text-xs px-2.5 py-1.5 rounded-lg border outline-none bg-[var(--color-bg-input)] border-[var(--color-border)] text-[var(--color-text-secondary)]"
                            >
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>
                    </div>

                    {/* Add Comment */}
                    {user && (
                        <div className="flex gap-3">
                            <img
                                src={user?.profile_img}
                                alt="user"
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 space-y-2">
                                <textarea
                                    placeholder="Write a comment..."
                                    className="input-field resize-none"
                                    rows={2}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handlePostComment();
                                        }
                                    }}
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        Press Enter to post
                                    </p>
                                    <button
                                        onClick={handlePostComment}
                                        disabled={!content.trim()}
                                        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                                            content.trim()
                                                ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] cursor-pointer"
                                                : "bg-[var(--color-bg-input)] text-[var(--color-text-muted)] cursor-not-allowed"
                                        }`}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-[var(--color-border)]" />

                    {/* Comments List */}
                    {filteredComments.length === 0 ? (
                        <div className="flex flex-col items-center py-10 gap-2 text-[var(--color-text-muted)]">
                            <MdChatBubbleOutline size={28} />
                            <p className="text-sm">No comments yet</p>
                            <p className="text-xs">Be the first to comment</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredComments.map((c) => {
                                const isOwn = c.author._id === user?._id;
                                const canDelete = user && (user._id === c.author._id || user._id === post.author._id);
                                return (
                                    <div key={c._id} className="flex gap-3">
                                        <img
                                            src={c.author.profile_img}
                                            alt={c.author.username}
                                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
                                        />
                                        <div
                                            className={`flex-1 rounded-xl px-4 py-3 border ${
                                                isOwn
                                                    ? "bg-[var(--color-primary-light)] border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)]"
                                                    : "bg-[var(--color-bg-input)] border-[var(--color-border)]"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/user/${c.author.username}`}
                                                        className="text-xs font-semibold hover:underline text-[var(--color-text-primary)]"
                                                    >
                                                        {c.author.username}
                                                    </Link>
                                                    {isOwn && (
                                                        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
                                                            you
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-[var(--color-text-muted)]">
                                                        {formatDate(c.createdAt)}
                                                    </span>
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDeleteComment(c._id)}
                                                            className="p-1 rounded-full transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
                                                            title="Delete"
                                                        >
                                                            <MdDelete size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                                                {c.content}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Load more comments */}
                    {hasMoreComments && (
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => loadComments(commentPage + 1)}
                                disabled={commentLoading}
                                className="btn-ghost text-sm px-5 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {commentLoading ? "Loading..." : "Load more comments"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
