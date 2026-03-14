import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser, getUserPosts, ToggleLike, ToggleBookmark, ToggleFollow } from '../services/api'
import { MdCalendarToday, MdPersonAdd, MdPersonRemove } from "react-icons/md";
import PostCard from "../components/PostCard";

const PublicProfile = () => {
    const { username } = useParams()
    const { user: authUser, setUser: setAuthUser } = useAuth();
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);

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
            alert("Something went wrong");
            console.log(error);
        }
    };

    const loadPosts = async () => {
        try {
            const data = await getUserPosts(user._id)
            if (data) {
                setPosts(data.posts)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user?._id) {
            loadPosts();
        }
    }, [user])


    const followbtn = async () => {
        if (!authUser) return;
        setFollowLoading(true);
        try {
            const res = await ToggleFollow(user._id);
            if (res.success) {
                setUser(prev => ({
                    ...prev,
                    followers: res.following
                        ? [...prev.followers, authUser._id]
                        : prev.followers.filter(id => id !== authUser._id)
                }));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setFollowLoading(false);
        }
    };

    const toggleLike = async (id) => {
        setPosts(prev =>
            prev.map(post => {
                if (post._id === id) {
                    const hasLiked = post.likes.includes(authUser?._id)
                    const updatedLikes = hasLiked
                        ? post.likes.filter((userId) => userId !== authUser?._id)
                        : [...post.likes, authUser?._id];
                    return { ...post, likes: updatedLikes };
                }
                return post
            })
        );
        try {
            await ToggleLike(id)
        } catch (error) {
            console.log(error)
        }
    }

    const toggleSave = async (id) => {
        try {
            const res = await ToggleBookmark(id);
            if (res.success) {
                setAuthUser(prev => ({ ...prev, bookmarks: res.bookmarks }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* ── Profile Card ── */}
                <div
                    className="rounded-2xl border overflow-hidden"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: 'var(--color-border)',
                        boxShadow: 'var(--shadow-card)',
                    }}
                >
                    {/* Banner */}
                    <div
                        className="h-28 w-full"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, #a78bfa 100%)',
                        }}
                    />

                    <div className="px-6 pb-6">

                        {/* Avatar + stats row */}
                        <div className="flex items-end justify-between -mt-12 mb-4 flex-wrap gap-y-3">
                            <img
                                src={user.profile_img}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover border-4"
                                style={{ borderColor: 'var(--color-bg-card)' }}
                            />

                            {/* ── Stats: Posts · Followers · Following ── */}
                            <div className="flex items-center gap-2.5">

                                <div
                                    className="text-center px-4 py-2 rounded-xl border"
                                    style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}
                                >
                                    <p className="text-lg font-bold leading-none" style={{ color: 'var(--color-text-primary)' }}>
                                        {posts.length}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Posts</p>
                                </div>

                                <div
                                    className="text-center px-4 py-2 rounded-xl border"
                                    style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}
                                >
                                    <p className="text-lg font-bold leading-none" style={{ color: 'var(--color-text-primary)' }}>
                                        {user.followers?.length || 0}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Followers</p>
                                </div>

                                <div
                                    className="text-center px-4 py-2 rounded-xl border"
                                    style={{ backgroundColor: 'var(--color-bg-input)', borderColor: 'var(--color-border)' }}
                                >
                                    <p className="text-lg font-bold leading-none" style={{ color: 'var(--color-text-primary)' }}>
                                        {user.following?.length || 0}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Following</p>
                                </div>

                            </div>
                        </div>

                        {/* Name & username */}
                        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                            {user.name}
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                            @{user.username}
                        </p>

                        {/* Bio */}
                        {user.bio && (
                            <p className="text-sm mt-3 leading-relaxed max-w-lg" style={{ color: 'var(--color-text-secondary)' }}>
                                {user.bio}
                            </p>
                        )}

                        {/* Joined date */}
                        {user.createdAt && (
                            <div className="flex items-center gap-1.5 mt-3" style={{ color: 'var(--color-text-muted)' }}>
                                <MdCalendarToday size={13} />
                                <span className="text-xs">Joined {formatDate(user.createdAt)}</span>
                            </div>
                        )}

                        {/* ── Follow Button ── */}
                        {authUser?._id !== user._id && (
                            <div className="mt-5">
                                <button
                                    onClick={followbtn}
                                    disabled={followLoading}
                                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold border transition-all"
                                    style={isFollowing ? {
                                        backgroundColor: 'var(--color-bg-input)',
                                        color: 'var(--color-text-secondary)',
                                        borderColor: 'var(--color-border)',
                                        opacity: followLoading ? 0.6 : 1,
                                        cursor: followLoading ? 'not-allowed' : 'pointer',
                                    } : {
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'var(--color-text-inverse)',
                                        borderColor: 'var(--color-primary)',
                                        opacity: followLoading ? 0.6 : 1,
                                        cursor: followLoading ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {isFollowing
                                        ? <><MdPersonRemove size={17} /> {followLoading ? 'Updating...' : 'Unfollow'}</>
                                        : <><MdPersonAdd size={17} /> {followLoading ? 'Updating...' : 'Follow'}</>
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Posts Section ── */}
                <div>
                    <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                        Posts by {user.name}
                    </h3>

                    {loading ? (
                        <p className="text-sm text-center py-10" style={{ color: 'var(--color-text-muted)' }}>
                            Loading posts...
                        </p>
                    ) : posts.length === 0 ? (
                        <div
                            className="rounded-xl border py-14 text-center"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
                        >
                            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                                This user hasn't posted anything yet.
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