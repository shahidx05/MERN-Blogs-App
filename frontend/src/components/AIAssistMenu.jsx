import { useState, useRef, useEffect } from 'react';
import { aiAssist } from '../services/api';
import {
    MdAutoAwesome, MdCreate, MdAutoFixHigh, MdCompress,
    MdOpenInFull, MdSpellcheck, MdClose,
    MdKeyboardArrowDown, MdWarningAmber,
} from 'react-icons/md';

// ─────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────

/** Strip HTML tags and collapse whitespace to get plain text */
const getPlainText = (html) =>
    html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/** Friendly label for error codes */
const friendlyError = (data) => {
    if (data?.code === 'RATE_LIMITED')
        return 'AI rate limit reached. You can make 10 AI requests per hour.';
    if (data?.code === 'AI_UNAVAILABLE')
        return 'AI service is temporarily unavailable. Please try again shortly.';
    if (data?.code === 'CONTENT_TOO_SHORT')
        return data.message || 'Content is too short for this action.';
    if (data?.code === 'INVALID_INPUT')
        return data.message || 'Please check your input and try again.';
    if (data?.code === 'EMPTY_RESPONSE')
        return 'AI returned an empty response. Please try again.';
    return data?.message || 'Something went wrong. Please try again.';
};

// ─────────────────────────────────────────────────────────────────
//  Contextual loading labels per action
// ─────────────────────────────────────────────────────────────────
const LOADING_LABELS = {
    generate: 'Generating post…',
    rewrite: 'Rewriting content…',
    improve: 'Improving writing…',
    shorten: 'Shortening content…',
    expand: 'Expanding content…',
    'fix-grammar': 'Fixing grammar…',
};

// ─────────────────────────────────────────────────────────────────
//  AI Actions configuration
const AI_ACTIONS = [
    {
        id: 'generate',
        label: 'Generate New Post',
        description: 'Create a full article from your title',
        icon: MdCreate,
        gradientClass: 'from-[#6366F1] to-[#8B5CF6]',
        // Only depends on title — works even if editor has content
        disabledReason: (title) => {
            if ((title || '').trim().length < 3) return 'Title required — add at least 3 characters';
            return null;
        },
    },
    {
        id: 'rewrite',
        label: 'Rewrite Content',
        description: 'Completely rewrite with fresh language',
        icon: MdAutoFixHigh,
        gradientClass: 'from-[#8B5CF6] to-[#EC4899]',
        disabledReason: (title, plainText) => {
            if (plainText < 30) return 'Write at least 30 characters first';
            return null;
        },
    },
    {
        id: 'improve',
        label: 'Improve Writing',
        description: 'Better clarity, flow, and word choices',
        icon: MdAutoAwesome,
        gradientClass: 'from-[#06B6D4] to-[#6366F1]',
        disabledReason: (title, plainText) => {
            if (plainText < 30) return 'Write at least 30 characters first';
            return null;
        },
    },
    {
        id: 'shorten',
        label: 'Shorten Content',
        description: 'Concise — cut fluff, keep key points',
        icon: MdCompress,
        gradientClass: 'from-[#F59E0B] to-[#EF4444]',
        disabledReason: (title, plainText) => {
            if (plainText < 30) return 'Write at least 30 characters first';
            return null;
        },
    },
    {
        id: 'expand',
        label: 'Expand Content',
        description: 'Add examples, depth, and explanations',
        icon: MdOpenInFull,
        gradientClass: 'from-[#10B981] to-[#06B6D4]',
        disabledReason: (title, plainText) => {
            if (plainText < 30) return 'Write at least 30 characters first';
            return null;
        },
    },
    {
        id: 'fix-grammar',
        label: 'Fix Grammar',
        description: 'Grammar, spelling, and punctuation',
        icon: MdSpellcheck,
        gradientClass: 'from-[#16A34A] to-[#10B981]',
        disabledReason: (title, plainText) => {
            if (plainText < 10) return 'Write at least 10 characters first';
            return null;
        },
    },
];
//  Tooltip wrapper
// ─────────────────────────────────────────────────────────────────
const Tooltip = ({ text, children }) => {
    const [show, setShow] = useState(false);
    return (
        <div
            className="relative"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && text && (
                <div className="absolute bottom-full left-1/2 mb-2 px-2.5 py-1.5 text-xs rounded-lg whitespace-nowrap pointer-events-none z-50 transition-all duration-200 -translate-x-1/2 bg-[var(--color-text-primary)] text-[var(--color-bg)] shadow-[var(--shadow-dropdown)]">
                    {text}
                    <div className="absolute top-full left-1/2 w-0 h-0 -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[var(--color-text-primary)]" />
                </div>
            )}
        </div>
    );
};
// ─────────────────────────────────────────────────────────────────
//  Main AI Assist Menu Component
// ─────────────────────────────────────────────────────────────────

/**
 * AIAssistMenu
 *
 * Props:
 *  - title        : string   — current post title
 *  - content      : string   — current editor HTML content
 *  - onApply      : (html) => void  — called with AI-generated HTML to inject into editor
 */
const AIAssistMenu = ({ title = '', content = '', onApply }) => {
    const [open, setOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);
    const [error, setError] = useState('');
    const menuRef = useRef(null);

    const plainText = getPlainText(content);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // Auto-dismiss error after 6s
    useEffect(() => {
        if (!error) return;
        const t = setTimeout(() => setError(''), 6000);
        return () => clearTimeout(t);
    }, [error]);

    const handleAction = async (action) => {
        setOpen(false);
        setError('');
        setLoadingAction(action.id);

        try {
            const payload =
                action.id === 'generate'
                    ? { title: title.trim() }
                    : { content, title: title.trim() };

            const data = await aiAssist(action.id, payload);

            if (!data.success) {
                setError(friendlyError(data));
                return;
            }

            const generatedHtml = data.content?.trim();
            if (!generatedHtml) {
                setError('AI returned an empty response. Please try again.');
                return;
            }

            onApply(generatedHtml);
        } catch (err) {
            setError(
                err.message?.includes('fetch')
                    ? 'Network error. Please check your connection and try again.'
                    : 'Something went wrong. Please try again.'
            );
        } finally {
            setLoadingAction(null);
        }
    };

    const isAnyLoading = !!loadingAction;
    const loadingLabel = loadingAction ? (LOADING_LABELS[loadingAction] ?? 'Generating…') : '';

    return (
        <>
            <div className="flex flex-col items-end gap-1.5" ref={menuRef}>
                {/* ── Trigger Button ── */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => !isAnyLoading && setOpen((v) => !v)}
                        disabled={isAnyLoading}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all select-none text-[var(--color-primary)] ${
                            isAnyLoading
                                ? 'bg-[var(--color-bg-input)] opacity-70 cursor-not-allowed'
                                : open
                                    ? 'bg-[linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))] border-[color-mix(in_srgb,var(--color-primary)_50%,transparent)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] cursor-pointer'
                                    : 'bg-[linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))] border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)] cursor-pointer'
                        }`}
                    >
                        {isAnyLoading ? (
                            <>
                                <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                {loadingLabel}
                            </>
                        ) : (
                            <>
                                <MdAutoAwesome size={14} className="ai-sparkle" />
                                AI Assist
                                <MdKeyboardArrowDown
                                    size={14}
                                    className={`transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                                />
                            </>
                        )}
                    </button>

                    {/* ── Dropdown Panel ── */}
                    {open && !isAnyLoading && (
                        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden z-50 bg-[var(--color-bg-card)] border border-[color-mix(in_srgb,var(--color-border)_60%,transparent)] shadow-[0_8px_32px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.12)] animate-[ai-menu-appear_0.18s_ease]">
                            {/* Header */}
                            <div className="px-3.5 py-2.5 border-b border-[color-mix(in_srgb,var(--color-border)_60%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_6%,transparent),color-mix(in_srgb,#8B5CF6_6%,transparent))]">
                                <div className="flex items-center gap-2">
                                    <MdAutoAwesome size={13} className="text-[var(--color-primary)]" />
                                    <span className="text-xs font-semibold text-[var(--color-primary)]">
                                        AI Writing Assistant
                                    </span>
                                </div>
                                <p className="text-xs mt-0.5 text-[var(--color-text-muted)] text-[0.7rem]">
                                    Choose an action to enhance your post
                                </p>
                            </div>

                            {/* Action list */}
                            <div className="py-1">
                                {AI_ACTIONS.map((action) => {
                                    const reason = action.disabledReason(title, plainText.length);
                                    const disabled = !!reason;
                                    const Icon = action.icon;

                                    return (
                                        <Tooltip key={action.id} text={reason}>
                                            <button
                                                type="button"
                                                onClick={() => !disabled && handleAction(action)}
                                                disabled={disabled}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left bg-transparent transition-colors disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:bg-[var(--color-bg-hover)]"
                                            >
                                                {/* Icon */}
                                                <div
                                                    className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
                                                        disabled
                                                            ? 'bg-[var(--color-bg-input)] opacity-50'
                                                            : `${action.gradientClass} opacity-100`
                                                    }`}
                                                >
                                                    <Icon
                                                        size={13}
                                                        className={disabled ? 'text-[var(--color-text-muted)]' : 'text-white'}
                                                    />
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={`text-xs font-semibold leading-tight ${
                                                            disabled ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]'
                                                        }`}
                                                    >
                                                        {action.label}
                                                    </p>
                                                    <p className="text-xs leading-tight mt-0.5 text-[var(--color-text-muted)] text-[0.68rem]">
                                                        {action.description}
                                                    </p>
                                                </div>
                                            </button>
                                        </Tooltip>
                                    );
                                })}
                            </div>

                            {/* Footer hint */}
                            <div className="px-3.5 py-2 border-t border-[color-mix(in_srgb,var(--color-border)_60%,transparent)] bg-[var(--color-bg-input)]">
                                <p className="text-[var(--color-text-muted)] text-[0.68rem]">
                                    ✦ 10 AI requests per hour
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Error Banner ── */}
                {error && (
                    <div className="flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg w-64 error-surface animate-[ai-menu-appear_0.2s_ease]">
                        <MdWarningAmber size={14} className="flex-shrink-0 mt-0.5" />
                        <span className="flex-1">{error}</span>
                        <button onClick={() => setError('')} className="flex-shrink-0 opacity-60 hover:opacity-100">
                            <MdClose size={13} />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Keyframe animations ── */}
            <style>{`
                @keyframes ai-menu-appear {
                    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes ai-sparkle-pulse {
                    0%, 100% { filter: drop-shadow(0 0 0px var(--color-primary)); }
                    50%       { filter: drop-shadow(0 0 4px var(--color-primary)); }
                }
                .ai-sparkle {
                    animation: ai-sparkle-pulse 2.5s ease-in-out infinite;
                }
            `}</style>
        </>
    );
};

export default AIAssistMenu;
