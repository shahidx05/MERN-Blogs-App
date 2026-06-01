import { MdClose, MdWarning } from "react-icons/md";

const RateLimitModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[var(--color-bg-overlay)]"
      onClick={onClose}
    >
      <div
        className="rounded-2xl border w-full max-w-sm overflow-hidden p-6 space-y-4 bg-[var(--color-bg-card)] border-[var(--color-border)] shadow-[var(--shadow-dropdown)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <MdWarning size={22} className="text-[var(--color-warning)]" />
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">Slow Down</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:opacity-80 text-[var(--color-text-muted)]"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{message}</p>

        {/* Action Button */}
        <div className="flex justify-end pt-1">
          <button onClick={onClose} className="btn-primary text-xs px-4 py-2 rounded-xl">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateLimitModal;
