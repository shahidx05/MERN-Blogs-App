import { Link, useNavigate } from "react-router-dom";
import {
  MdFavorite, MdFavoriteBorder,
  MdBookmark, MdBookmarkBorder,
  MdDelete, MdEdit, MdVisibility
} from "react-icons/md";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

const PostCard = ({
  post,
  currentUserId,
  bookmarks = [],
  onLike,
  onBookmark,
  onDelete,
  showActions = false,
}) => {
  const navigate = useNavigate();
  const isLiked = post.likes?.includes(currentUserId);
  const isBookmarked = bookmarks?.includes(post._id);
  const excerpt = stripHtml(post.content);

  return (
    <div className="rounded-xl border overflow-hidden flex flex-col group bg-[var(--color-bg-card)] border-[var(--color-border)] shadow-[var(--shadow-card)] transition-all duration-200 hover:border-[color-mix(in_srgb,var(--color-primary)_40%,transparent)] hover:shadow-[var(--shadow-dropdown)]">
      {/* Cover Image */}
      <Link to={`/post/${post._id}`} className="block overflow-hidden flex-shrink-0">
        {post.img ? (
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-52 flex items-center justify-center bg-[var(--color-bg-input)] border-b border-[var(--color-border)]">
            <span className="text-5xl font-black select-none text-[var(--color-text-muted)]">
              {post.title?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">

        {/* Title */}
        <Link to={`/post/${post._id}`}>
          <h3 className="font-bold text-base leading-snug mb-2 transition-colors duration-150 text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed line-clamp-2 mb-4 text-[var(--color-text-secondary)]">
          {excerpt.length > 120 ? excerpt.slice(0, 120) + "..." : excerpt}
        </p>

        {/* Tags — clickable */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag, i) => (
              <button
                key={i}
                onClick={() => navigate(`/home?tag=${tag}`)}
                className="tag"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Footer — always at bottom */}
        <div className="mt-auto space-y-3">

          {/* Author */}
          <div className="flex items-center gap-2">
            <Link to={`/user/${post.author?.username}`}>
              <img
                src={post.author?.profile_img}
                alt={post.author?.username}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
            </Link>
            <Link
              to={`/user/${post.author?.username}`}
              className="text-xs font-medium hover:underline flex-1 truncate text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              {post.author?.username}
            </Link>
            <span className="text-xs flex-shrink-0 text-[var(--color-text-muted)]">
              {formatDate(post.createdAt)}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--color-border)]" />

          {/* Actions */}
          <div className="flex items-center justify-between">

            {/* Left: views · like · bookmark */}
            <div className="flex items-center gap-3.5">
              <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                <MdVisibility size={18} />
                <span className="text-xs">{post.views ?? 0}</span>
              </span>

              {onLike ? (
                <button
                  onClick={() => onLike(post._id)}
                  className={`flex items-center gap-1 transition-colors hover:text-[var(--color-accent)] ${
                    isLiked ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {isLiked ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
                  <span className="text-xs font-medium">{post.likes?.length ?? 0}</span>
                </button>
              ) : (
                <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                  <MdFavoriteBorder size={18} />
                  <span className="text-xs">{post.likes?.length ?? 0}</span>
                </span>
              )}

              {onBookmark && (
                <button
                  onClick={() => onBookmark(post._id)}
                  className={`transition-colors hover:text-[var(--color-primary)] ${
                    isBookmarked ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                  }`}
                  title={isBookmarked ? "Unsave" : "Save"}
                >
                  {isBookmarked ? <MdBookmark size={18} /> : <MdBookmarkBorder size={18} />}
                </button>
              )}
            </div>

            {/* Right: Edit / Delete / Read more */}
            <div className="flex items-center gap-1.5">
              {showActions ? (
                <>
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="btn-success-outline"
                  >
                    <MdEdit size={13} /> Edit
                  </Link>
                  <button
                    onClick={() => onDelete?.(post._id)}
                    className="btn-error-outline"
                  >
                    <MdDelete size={13} /> Delete
                  </button>
                </>
              ) : (
                <Link
                  to={`/post/${post._id}`}
                  className="text-xs font-semibold hover:underline text-[var(--color-primary)]"
                >
                  Read more
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