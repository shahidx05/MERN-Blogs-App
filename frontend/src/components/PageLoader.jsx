/**
 * Shared full-screen loading state used across all pages.
 */
const PageLoader = ({ text = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
    <p className="text-sm text-[var(--color-text-muted)]">{text}</p>
  </div>
);

export default PageLoader;
