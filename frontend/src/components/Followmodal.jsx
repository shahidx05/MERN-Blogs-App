import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFollowers, getFollowing } from "../services/api";
import { MdClose } from "react-icons/md";

const FollowModal = ({ username, type, onClose }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadList();
    }, [username, type]);

    const loadList = async () => {
        try {
            setLoading(true);
            const data = type === "followers"
                ? await getFollowers(username)
                : await getFollowing(username);
            setList(data.followers || data.following || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'var(--color-bg-overlay)' }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl border w-full max-w-sm overflow-hidden"
                style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderColor: 'var(--color-border)',
                    boxShadow: 'var(--shadow-dropdown)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-4 border-b"
                    style={{ borderColor: 'var(--color-border)' }}
                >
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {type === "followers" ? "Followers" : "Following"}
                        {!loading && (
                            <span
                                className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                            >
                                {list.length}
                            </span>
                        )}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        <MdClose size={18} />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto max-h-80">
                    {loading ? (
                        <div className="space-y-0">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 px-5 py-3 border-b"
                                    style={{ borderColor: 'var(--color-border)' }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-full animate-pulse flex-shrink-0"
                                        style={{ backgroundColor: 'var(--color-bg-input)' }}
                                    />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 rounded animate-pulse w-24" style={{ backgroundColor: 'var(--color-bg-input)' }} />
                                        <div className="h-2.5 rounded animate-pulse w-16" style={{ backgroundColor: 'var(--color-bg-input)' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : list.length === 0 ? (
                        <p className="text-sm text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
                            {type === "followers" ? "No followers yet" : "Not following anyone yet"}
                        </p>
                    ) : (
                        list.map(u => (
                            <Link
                                key={u._id}
                                to={`/user/${u.username}`}
                                onClick={onClose}
                                className="flex items-center gap-3 px-5 py-3 border-b last:border-0 transition-colors hover:opacity-80"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                <img
                                    src={u.profile_img}
                                    alt={u.username}
                                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                                        {u.name}
                                    </p>
                                    <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                                        @{u.username}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowModal;