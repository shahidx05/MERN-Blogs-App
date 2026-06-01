import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBookmarks, ToggleBookmark, ToggleLike } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { MdBookmark } from "react-icons/md";
import PostCard from "../components/PostCard";
import RateLimitModal from "../components/RateLimitModal";
import BackButton from "../components/BackButton";
import PageLoader from "../components/PageLoader";

const Bookmarks = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [rateLimitMsg, setRateLimitMsg] = useState("");

    const loadPosts = async () => {
        if (!user?.username) return;
        try {
            const data = await getBookmarks(user?.username);
            setPosts(data?.bookmarks);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [user]);

    const toggleLike = async (id) => {
        setPosts(prev =>
            prev.map(post => {
                if (post._id === id) {
                    const hasLiked = post.likes.includes(user?._id);
                    const updatedLikes = hasLiked
                        ? post.likes.filter((userId) => userId !== user?._id)
                        : [...post.likes, user?._id];
                    return { ...post, likes: updatedLikes };
                }
                return post;
            })
        );
        try {
            await ToggleLike(id);
        } catch (error) {
            setPosts(prev =>
                prev.map(post => {
                    if (post._id === id) {
                        const hasLiked = post.likes.includes(user?._id);
                        const updatedLikes = hasLiked
                            ? post.likes.filter((userId) => userId !== user?._id)
                            : [...post.likes, user?._id];
                        return { ...post, likes: updatedLikes };
                    }
                    return post;
                })
            );
            if (error.status === 429) {
                setRateLimitMsg("Too many likes! Slow down a bit.");
            }
        }
    };

    const toggleSave = async (id) => {
        try {
            const res = await ToggleBookmark(id);
            if (res.success) {
                setUser({ ...user, bookmarks: res.bookmarks });
                setPosts(prev => prev.filter(p => res.bookmarks.includes(p._id)));
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!user) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Rate limit modal */}
            <RateLimitModal
                isOpen={!!rateLimitMsg}
                onClose={() => setRateLimitMsg("")}
                message={rateLimitMsg}
            />
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <MdBookmark size={22} className="text-[var(--color-primary)]" />
                        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                            Saved Posts
                        </h1>
                        {posts.length > 0 && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                                {posts.length}
                            </span>
                        )}
                    </div>
                    <BackButton />
                </div>

                {/* Empty state */}
                {posts.length === 0 ? (
                    <div className="rounded-xl border py-20 text-center border-[var(--color-border)] bg-[var(--color-bg-card)]">
                        <MdBookmark size={36} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
                        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                            No saved posts yet
                        </p>
                        <p className="text-xs mt-1 text-[var(--color-text-muted)]">
                            Posts you bookmark will appear here
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                currentUserId={user?._id}
                                bookmarks={user?.bookmarks}
                                onLike={toggleLike}
                                onBookmark={toggleSave}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookmarks;