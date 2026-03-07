import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdHome } from "react-icons/md";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* ── Animated 404 ── */}
      <div className="relative select-none mb-6">
        <p
          className="text-[10rem] font-black leading-none tracking-tighter"
          style={{
            color: 'var(--color-border)',
            lineHeight: 1,
          }}
        >
          404
        </p>
        {/* overlay accent */}
        <p
          className="text-[10rem] font-black leading-none tracking-tighter absolute inset-0"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px var(--color-primary)',
            lineHeight: 1,
            opacity: 0.25,
          }}
        >
          404
        </p>
      </div>

      {/* ── Message ── */}
      <div className="text-center space-y-2 mb-8">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Page not found
        </h1>
        <p
          className="text-sm max-w-xs mx-auto leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* ── Divider ── */}
      <div
        className="w-12 h-px mb-8"
        style={{ backgroundColor: 'var(--color-border)' }}
      />

      {/* ── Actions ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-secondary)',
            backgroundColor: 'var(--color-bg-card)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-text-secondary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          <MdArrowBack size={16} /> Go back
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-inverse)',
          }}
        >
          <MdHome size={16} /> Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;