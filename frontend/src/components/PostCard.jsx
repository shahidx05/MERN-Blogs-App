import { Link } from "react-router-dom";
import {
  MdFavorite, MdFavoriteBorder,
  MdBookmark, MdBookmarkBorder,
  MdDelete, MdEdit,
} from "react-icons/md";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

const stripHtml = (html) =>
  html?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || '';

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
  const excerpt = stripHtml(post.content);

  return (
    <div
      className="rounded-lg border overflow-hidden flex flex-col group"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 40%, transparent)';
        e.currentTarget.style.boxShadow = 'var(--shadow-dropdown)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* ── Cover Image ── */}
      <Link to={`/post/${post._id}`} className="block overflow-hidden flex-shrink-0">
        {post.img ? (
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-44 flex items-center justify-center"
            style={{
              backgroundColor: 'var(--color-bg-input)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <span
              className="text-5xl font-black select-none"
              style={{ color: 'var(--color-border)' }}
            >
              {post.title?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4">

        {/* Title */}
        <Link to={`/post/${post._id}`}>
          <h3
            className="font-bold text-base leading-snug mb-2 transition-colors duration-150"
            style={{ color: 'var(--color-text-primary)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
          >
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p
          className="text-sm leading-relaxed line-clamp-2 mb-4"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {excerpt.length > 120 ? excerpt.slice(0, 120) + '...' : excerpt}
        </p>

        {/* ── Footer — always at bottom ── */}
        <div className="mt-auto space-y-3">

          {/* Author */}
          <div className="flex items-center gap-2">
            <img
              src={post.author?.profile_img}
              alt={post.author?.username}
              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            />
            <Link
              to={`/user/${post.author?.username}`}
              className="text-xs font-medium hover:underline flex-1 truncate"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {post.author?.username}
            </Link>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
              {formatDate(post.createdAt)}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ backgroundColor: 'var(--color-border)' }} />

          {/* Actions */}
          <div className="flex items-center justify-between">

            {/* Left: like · bookmark */}
            <div className="flex items-center gap-3.5">

              {/* Like */}
              {onLike ? (
                <button
                  onClick={() => onLike(post._id)}
                  className="flex items-center gap-1 transition-colors"
                  style={{ color: isLiked ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                >
                  {isLiked ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
                  <span className="text-xs font-medium">{post.likes?.length ?? 0}</span>
                </button>
              ) : (
                <span className="flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                  <MdFavoriteBorder size={18} />
                  <span className="text-xs">{post.likes?.length ?? 0}</span>
                </span>
              )}

              {/* Bookmark */}
              {onBookmark && (
                <button
                  onClick={() => onBookmark(post._id)}
                  className="transition-colors"
                  title={isBookmarked ? 'Unsave' : 'Save'}
                  style={{ color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                >
                  {isBookmarked ? <MdBookmark size={18} /> : <MdBookmarkBorder size={18} />}
                </button>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {showActions ? (
                <>
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded border"
                    style={{
                      color: 'var(--color-primary)',
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'var(--color-primary-light)',
                    }}
                  >
                    <MdEdit size={13} /> Edit
                  </Link>
                  <button
                    onClick={() => onDelete?.(post._id)}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded border"
                    style={{
                      color: 'var(--color-error)',
                      borderColor: 'var(--color-error)',
                      backgroundColor: 'color-mix(in srgb, var(--color-error) 8%, transparent)',
                    }}
                  >
                    <MdDelete size={13} /> Delete
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
    </div>
  );
};

export default PostCard;