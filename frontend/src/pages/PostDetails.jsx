import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost, ToggleLike, getPostComments, CreateComment, DeleteComment, ToggleBookmark } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
    MdFavorite, MdFavoriteBorder, MdBookmark, MdBookmarkBorder,
    MdDelete, MdArrowBack, MdShare, MdCheck, MdChatBubbleOutline, MdVisibility
} from "react-icons/md";


const PostDetails = () => {
    const { user, setUser } = useAuth();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [myComment, setMycomment] = useState(false);
    const [sortType, setSortType] = useState("latest");
    const [copied, setCopied] = useState(false);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);


    const loadPost = async () => {
        try {
            const data = await getPost(id);
            setPost(data.post);
        } catch (error) { console.log(error); }
    };
    const loadComments = async (page = 1) => {
        try {
            setCommentLoading(true);
            const res = await getPostComments(id, page, 5);
            if (res) {
                setComments(prev => page === 1 ? res.comments : [...prev, ...res.comments]);
                setHasMoreComments(res.hasMore);
                setCommentPage(page);
            }
        } catch (error) { console.log(error); }
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
        } catch (error) { console.log(error); }
    };

    const toggleSave = async () => {
        try {
            const res = await ToggleBookmark(id);
            if (res.success) setUser({ ...user, bookmarks: res.bookmarks });
        } catch (error) { console.log(error); }
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
            if (res) { loadComments(); setContent(''); }
        } catch (error) { console.log(error); }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await DeleteComment(commentId);
            loadComments();
        } catch (error) { console.log(error); }
    };


    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading post...</p>
            </div>
        );
    }

    let filteredComments = [...comments]

    filteredComments = myComment
        ? filteredComments.filter(c => c.author._id === user?._id)
        : filteredComments;

    if (sortType === "latest") {
        filteredComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
        filteredComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    const isLiked = post.likes?.includes(user?._id);
    const isBookmark = user?.bookmarks?.includes(id);

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* ── Back ── */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm hover:underline"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    <MdArrowBack size={16} /> Back to Home
                </Link>

                {/* ── Post Card ── */}
                <div
                    className="rounded-2xl border overflow-hidden"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: 'var(--color-border)',
                        boxShadow: 'var(--shadow-card)',
                    }}
                >
                    {/* Cover Image */}
                    {post.img && (
                        <img
                            src={post.img}
                            alt={post.title}
                            className="w-full h-72 object-cover"
                        />
                    )}

                    <div className="p-6 space-y-5">
                        {/* Title */}
                        <h1 className="text-2xl font-bold leading-snug" style={{ color: 'var(--color-text-primary)' }}>
                            {post.title}
                        </h1>

                        {/* Tags */}
                        {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2.5 py-1 rounded-full"
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

                        {/* Author row */}
                        <div className="flex items-center justify-between">
                            <Link to={`/user/${post.author.username}`} className="flex items-center gap-3">
                                <img
                                    src={post.author.profile_img}
                                    alt={post.author.username}
                                    className="w-10 h-10 rounded-full object-cover border"
                                    style={{ borderColor: 'var(--color-border)' }}
                                />
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                        {post.author.username}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                        {formatDate(post.createdAt)}
                                    </p>
                                </div>
                            </Link>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <span
                                    className="flex items-center gap-1.5 text-sm"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    <MdVisibility size={18} />
                                    <span className="font-medium">{post.views ?? 0}</span>
                                </span>
                                {/* Like */}
                                <button
                                    onClick={toggleLike}
                                    className="flex items-center gap-1.5 text-sm transition-colors"
                                    style={{ color: isLiked ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                                >
                                    {isLiked ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
                                    <span className="font-medium">{post.likes.length}</span>
                                </button>

                                {/* Bookmark */}
                                <button
                                    onClick={toggleSave}
                                    className="transition-colors"
                                    title={isBookmark ? 'Unsave' : 'Save'}
                                    style={{ color: isBookmark ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                                >
                                    {isBookmark ? <MdBookmark size={20} /> : <MdBookmarkBorder size={20} />}
                                </button>

                                {/* Share */}
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                                    style={{
                                        borderColor: copied ? 'var(--color-success)' : 'var(--color-border)',
                                        color: copied ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                        backgroundColor: 'var(--color-bg-input)',
                                    }}
                                >
                                    {copied ? <MdCheck size={15} /> : <MdShare size={15} />}
                                    {copied ? 'Copied!' : 'Share'}
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px" style={{ backgroundColor: 'var(--color-border)' }} />

                        {/* Content — rendered as HTML from rich text editor */}
                        <div
                            className="rte-content"
                            style={{ color: 'var(--color-text-primary)', fontSize: '0.95rem', lineHeight: '1.8' }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>

                {/* ── Comments Section ── */}
                <div
                    className="rounded-2xl border p-6 space-y-5"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: 'var(--color-border)',
                        boxShadow: 'var(--shadow-card)',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <MdChatBubbleOutline size={18} style={{ color: 'var(--color-primary)' }} />
                            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                Comments
                            </h2>
                            <span
                                className="text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                            >
                                {filteredComments.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* My Comments toggle */}
                            <button
                                onClick={() => setMycomment(prev => !prev)}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                                style={{
                                    backgroundColor: myComment ? 'var(--color-primary)' : 'var(--color-bg-input)',
                                    color: myComment ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                                    borderColor: myComment ? 'var(--color-primary)' : 'var(--color-border)',
                                }}
                            >
                                My Comments
                            </button>

                            {/* Sort */}
                            <select
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value)}
                                className="text-xs px-2.5 py-1.5 rounded-lg border outline-none"
                                style={{
                                    backgroundColor: 'var(--color-bg-input)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-secondary)',
                                }}
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
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handlePostComment();
                                        }
                                    }}
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                        Press Enter to post
                                    </p>
                                    <button
                                        onClick={handlePostComment}
                                        disabled={!content.trim()}
                                        className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                                        style={{
                                            backgroundColor: content.trim() ? 'var(--color-primary)' : 'var(--color-bg-input)',
                                            color: content.trim() ? 'var(--color-text-inverse)' : 'var(--color-text-muted)',
                                            cursor: content.trim() ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="h-px" style={{ backgroundColor: 'var(--color-border)' }} />

                    {/* Comments List */}
                    {filteredComments.length === 0 ? (
                        <div className="flex flex-col items-center py-10 gap-2" style={{ color: 'var(--color-text-muted)' }}>
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
                                            className="flex-1 rounded-xl px-4 py-3"
                                            style={{
                                                backgroundColor: isOwn ? 'var(--color-primary-light)' : 'var(--color-bg-input)',
                                                border: `1px solid ${isOwn ? 'color-mix(in srgb, var(--color-primary) 25%, transparent)' : 'var(--color-border)'}`,
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/user/${c.author.username}`}
                                                        className="text-xs font-semibold hover:underline"
                                                        style={{ color: 'var(--color-text-primary)' }}
                                                    >
                                                        {c.author.username}
                                                    </Link>
                                                    {isOwn && (
                                                        <span
                                                            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                                                        >
                                                            you
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                        {formatDate(c.createdAt)}
                                                    </span>
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDeleteComment(c._id)}
                                                            className="p-1 rounded-full transition-colors"
                                                            style={{ color: 'var(--color-text-muted)' }}
                                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-error)'}
                                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                                            title="Delete"
                                                        >
                                                            <MdDelete size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                                                {c.content}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Load more */}
                    {hasMoreComments && (
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => loadComments(commentPage + 1)}
                                disabled={commentLoading}
                                className="text-sm px-5 py-2 rounded-lg border"
                                style={{
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-secondary)',
                                    backgroundColor: 'var(--color-bg-input)',
                                    opacity: commentLoading ? 0.6 : 1,
                                }}
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
