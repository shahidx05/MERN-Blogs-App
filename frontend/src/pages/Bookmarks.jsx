import { useState, useEffect } from "react";
import { getBookmarks, ToggleBookmark, ToggleLike } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { MdBookmark } from "react-icons/md";
import PostCard from "../components/PostCard";

const Bookmarks = () => {
    const { user, setUser } = useAuth();
    const [posts, setPosts] = useState([]);

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
            console.log(error);
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
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <MdBookmark size={22} style={{ color: 'var(--color-primary)' }} />
                        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                            Saved Posts
                        </h1>
                        {posts.length > 0 && (
                            <span
                                className="text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: 'var(--color-primary-light)',
                                    color: 'var(--color-primary)',
                                }}
                            >
                                {posts.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Empty state */}
                {posts.length === 0 ? (
                    <div
                        className="rounded-xl border py-20 text-center"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
                    >
                        <MdBookmark size={36} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
                        <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            No saved posts yet
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
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