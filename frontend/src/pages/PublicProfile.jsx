import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser, getUserPosts, ToggleLike, ToggleBookmark, ToggleFollow } from '../services/api';
import { MdCalendarToday, MdPersonAdd, MdPersonRemove, MdArticle } from "react-icons/md";
import PostCard from "../components/PostCard";
import FollowModal from "../components/FollowModal";
import RateLimitModal from "../components/RateLimitModal";
import PageLoader from "../components/PageLoader";

const PublicProfile = () => {
    const { username } = useParams();
    const { user: authUser, setUser: setAuthUser } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [modal, setModal] = useState(null);
    const [rateLimitMsg, setRateLimitMsg] = useState("");

    const isFollowing = user?.followers?.includes(authUser?._id) || false;

    useEffect(() => {
        setPosts([]);
        setUser(null);
        setLoading(true);
        loadProfile();
    }, [username]);

    const loadProfile = async () => {
        try {
            const data = await getUser(username);
            if (data) setUser(data.user);
        } catch (error) {
            /* silently handle */
        }
    };

    const loadPosts = async () => {
        try {
            const data = await getUserPosts(user._id);
            if (data) setPosts(data.posts);
        } catch (error) {
            /* silently handle */
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) loadPosts();
    }, [user]);

    const followbtn = async () => {
        if (!authUser) return;
        setFollowLoading(true);
        try {
            const res = await ToggleFollow(user._id);
            if (res.success) {
                setUser((prev) => ({
                    ...prev,
                    followers: res.following
                        ? [...prev.followers, authUser._id]
                        : prev.followers.filter((id) => id !== authUser._id),
                }));
                setAuthUser((prev) => ({
                    ...prev,
                    following: res.following
                        ? [...prev.following, user._id]
                        : prev.following.filter((id) => id !== user._id),
                }));
            }
        } catch (error) {
            /* silently handle */
        } finally {
            setFollowLoading(false);
        }
    };

    const toggleLike = async (id) => {
        setPosts((prev) =>
            prev.map((post) => {
                if (post._id === id) {
                    const hasLiked = post.likes.includes(authUser?._id);
                    const updatedLikes = hasLiked
                        ? post.likes.filter((userId) => userId !== authUser?._id)
                        : [...post.likes, authUser?._id];
                    return { ...post, likes: updatedLikes };
                }
                return post;
            })
        );
        try {
            await ToggleLike(id);
        } catch (error) {
            setPosts((prev) =>
                prev.map((post) => {
                    if (post._id === id) {
                        const hasLiked = post.likes.includes(authUser?._id);
                        const updatedLikes = hasLiked
                            ? post.likes.filter((userId) => userId !== authUser?._id)
                            : [...post.likes, authUser?._id];
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
                setAuthUser((prev) => ({ ...prev, bookmarks: res.bookmarks }));
            }
        } catch (error) {
            /* silently handle */
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
        });

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

            {/* Modal */}
            {modal && (
                <FollowModal
                    username={username}
                    type={modal}
                    onClose={() => setModal(null)}
                />
            )}

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* Profile Card */}
                <div className="rounded-2xl border overflow-hidden bg-[var(--color-bg-card)] border-[var(--color-border)] shadow-[var(--shadow-card)]">
                    {/* Banner */}
                    <div className="h-32 w-full bg-[linear-gradient(135deg,var(--color-primary)_0%,#7c3aed_50%,#a78bfa_100%)]" />

                    <div className="px-6 pb-7">
                        {/* Avatar + Stats row */}
                        <div className="flex items-end justify-between -mt-14 mb-5 flex-wrap gap-y-4">
                            <img
                                src={user.profile_img}
                                alt={user.name}
                                className="w-28 h-28 rounded-full object-cover border-4 border-[var(--color-bg-card)] shadow-[0_0_0_3px_var(--color-primary)]"
                            />

                            {/* Stats */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="text-center px-5 py-2.5 rounded-xl border bg-[var(--color-bg-input)] border-[var(--color-border)]">
                                    <p className="text-xl font-black leading-none text-[var(--color-text-primary)]">
                                        {posts.length}
                                    </p>
                                    <p className="text-xs mt-0.5 text-[var(--color-text-muted)]">Posts</p>
                                </div>

                                <button
                                    onClick={() => setModal("followers")}
                                    className="text-center px-5 py-2.5 rounded-xl border hover:opacity-75 transition-opacity bg-[var(--color-bg-input)] border-[var(--color-border)]"
                                >
                                    <p className="text-xl font-black leading-none text-[var(--color-text-primary)]">
                                        {user.followers?.length || 0}
                                    </p>
                                    <p className="text-xs mt-0.5 text-[var(--color-text-muted)]">Followers</p>
                                </button>

                                <button
                                    onClick={() => setModal("following")}
                                    className="text-center px-5 py-2.5 rounded-xl border hover:opacity-75 transition-opacity bg-[var(--color-bg-input)] border-[var(--color-border)]"
                                >
                                    <p className="text-xl font-black leading-none text-[var(--color-text-primary)]">
                                        {user.following?.length || 0}
                                    </p>
                                    <p className="text-xs mt-0.5 text-[var(--color-text-muted)]">Following</p>
                                </button>
                            </div>
                        </div>

                        {/* Name & username */}
                        <h1 className="text-2xl font-bold leading-tight text-[var(--color-text-primary)]">
                            {user.name}
                        </h1>
                        <p className="text-sm mt-0.5 font-medium text-[var(--color-text-muted)]">
                            @{user.username}
                        </p>

                        {/* Bio */}
                        {user.bio && (
                            <p className="text-sm mt-3 leading-relaxed max-w-lg text-[var(--color-text-secondary)]">
                                {user.bio}
                            </p>
                        )}

                        {/* Joined */}
                        {user.createdAt && (
                            <div className="flex items-center gap-1.5 mt-3 text-[var(--color-text-muted)]">
                                <MdCalendarToday size={13} />
                                <span className="text-xs">Joined {formatDate(user.createdAt)}</span>
                            </div>
                        )}

                        {/* Follow Button */}
                        {authUser?._id !== user._id && (
                            <div className="mt-5">
                                <button
                                    onClick={followbtn}
                                    disabled={followLoading}
                                    className={`text-sm px-5 py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                                        isFollowing ? "btn-ghost" : "btn-primary"
                                    }`}
                                >
                                    {isFollowing
                                        ? <><MdPersonRemove size={17} /> {followLoading ? "Updating..." : "Unfollow"}</>
                                        : <><MdPersonAdd size={17} /> {followLoading ? "Updating..." : "Follow"}</>
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Posts */}
                <div>
                    <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-[var(--color-text-primary)]">
                        <MdArticle size={18} className="text-[var(--color-primary)]" />
                        Posts by {user.name}
                    </h2>

                    {loading ? (
                        <p className="text-sm text-center py-10 text-[var(--color-text-muted)]">
                            Loading posts...
                        </p>
                    ) : posts.length === 0 ? (
                        <div className="rounded-xl border py-14 text-center border-[var(--color-border)] bg-[var(--color-bg-card)]">
                            <p className="text-sm text-[var(--color-text-muted)]">
                                This user has not posted anything yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    currentUserId={authUser?._id}
                                    bookmarks={authUser?.bookmarks}
                                    onLike={authUser ? toggleLike : undefined}
                                    onBookmark={authUser ? toggleSave : undefined}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PublicProfile;