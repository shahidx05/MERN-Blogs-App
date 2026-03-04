import { Link } from "react-router-dom";
import { MdFavorite, MdFavoriteBorder, MdBookmark, MdBookmarkBorder, MdDelete, MdEdit } from "react-icons/md";

/**
 * PostCard — reusable card for Home feed and Profile page
 *
 * Props:
 *  - post         : post object
 *  - currentUserId: logged-in user's _id (for like/bookmark state)
 *  - bookmarks    : array of bookmarked post ids (from user)
 *  - onLike       : (postId) => void        [optional]
 *  - onBookmark   : (postId) => void        [optional]
 *  - onDelete     : (postId) => void        [optional — shows delete btn]
 *  - showActions  : bool — show edit/delete (profile page only)
 */

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const PostCard = ({
  post,
  currentUserId,
  bookmarks = [],
  onLike,
  onBookmark,
  onDelete,
  showActions = false,
}) => {
  const isLiked = post.likes?.includes(currentUserId);
  const isBookmarked = bookmarks?.includes(post._id);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Post Image */}
      {post.img && (
        <Link to={`/post/${post._id}`}>
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">

        {/* Title */}
        <Link to={`/post/${post._id}`}>
          <h3
            className="font-semibold text-base leading-snug hover:underline"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {post.title}
          </h3>
        </Link>

        {/* Author + Date */}
        <div className="flex items-center gap-2">
          <img
            src={post.author?.profile_img}
            alt={post.author?.username}
            className="w-7 h-7 rounded-full object-cover"
          />
          <Link
            to={`/user/${post.author?.username}`}
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {post.author?.username}
          </Link>
          <span style={{ color: 'var(--color-text-muted)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Excerpt — strip HTML tags, limit to 120 chars */}
        <p
          className="text-sm line-clamp-2 leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {(() => {
            const plain = post.content?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || '';
            return plain.length > 120 ? plain.slice(0, 120) + '...' : plain;
          })()}
        </p>

        {/* Divider */}
        <div className="h-px" style={{ backgroundColor: 'var(--color-border)' }} />

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-0.5">

          {/* Left: Like + Bookmark */}
          <div className="flex items-center gap-4">

            {/* Like */}
            {onLike && (
              <button
                onClick={() => onLike(post._id)}
                className="flex items-center gap-1 text-sm transition-colors"
                style={{ color: isLiked ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                {isLiked
                  ? <MdFavorite size={18} />
                  : <MdFavoriteBorder size={18} />
                }
                <span>{post.likes?.length ?? 0}</span>
              </button>
            )}

            {/* Bookmark */}
            {onBookmark && (
              <button
                onClick={() => onBookmark(post._id)}
                className="transition-colors"
                style={{ color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                title={isBookmarked ? 'Unsave' : 'Save'}
              >
                {isBookmarked
                  ? <MdBookmark size={18} />
                  : <MdBookmarkBorder size={18} />
                }
              </button>
            )}
          </div>

          {/* Right: Read more OR Edit/Delete */}
          <div className="flex items-center gap-3">
            {showActions ? (
              <>
                <Link
                  to={`/edit-post/${post._id}`}
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <MdEdit size={15} /> Edit
                </Link>
                <button
                  onClick={() => onDelete?.(post._id)}
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: 'var(--color-error)' }}
                >
                  <MdDelete size={15} /> Delete
                </button>
              </>
            ) : (
              <Link
                to={`/post/${post._id}`}
                className="text-xs font-semibold hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Read more →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;