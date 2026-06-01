import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdHome } from "react-icons/md";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--color-bg)]">
      {/* ── Animated 404 ── */}
      <div className="relative select-none mb-6">
        <p className="text-[10rem] font-black leading-none tracking-tighter text-[var(--color-border)]">
          404
        </p>
        {/* overlay accent */}
        <p
          className="text-[10rem] font-black leading-none tracking-tighter absolute inset-0 text-transparent opacity-25 [-webkit-text-stroke:2px_var(--color-primary)]"
        >
          404
        </p>
      </div>

      {/* ── Message ── */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Page not found
        </h1>
        <p className="text-sm max-w-xs mx-auto leading-relaxed text-[var(--color-text-muted)]">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="w-12 h-px mb-8 bg-[var(--color-border)]" />

      {/* ── Actions ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost text-sm px-4 py-2"
        >
          <MdArrowBack size={16} /> Go back
        </button>

        <button
          onClick={() => navigate('/')}
          className="btn-primary text-sm px-4 py-2"
        >
          <MdHome size={16} /> Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;