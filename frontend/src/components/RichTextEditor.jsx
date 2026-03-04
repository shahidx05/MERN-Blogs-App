import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useState } from 'react';
import {
    MdFormatBold, MdFormatItalic, MdFormatListBulleted,
    MdFormatListNumbered, MdFormatQuote, MdCode,
    MdFormatStrikethrough, MdHorizontalRule, MdUndo, MdRedo,
    MdLink, MdLinkOff,
} from 'react-icons/md';

/**
 * RichTextEditor — reusable TipTap editor
 *
 * Props:
 *  - content    : string (HTML)  — initial content (supports async load)
 *  - onChange   : (html) => void — called on every change
 *  - placeholder: string         — placeholder text
 */

// ── Toolbar Button ──
const ToolbarBtn = ({ onClick, active, disabled, title, children }) => (
    <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        title={title}
        disabled={disabled}
        className="p-1.5 rounded transition-colors"
        style={{
            backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
            color: disabled
                ? 'var(--color-text-muted)'
                : active
                    ? 'var(--color-primary)'
                    : 'var(--color-text-secondary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.4 : 1,
        }}
    >
        {children}
    </button>
);

const Divider = () => (
    <span className="w-px h-5 mx-1 flex-shrink-0" style={{ backgroundColor: 'var(--color-border)' }} />
);

// ── Link Popup (replaces window.prompt) ──
const LinkPopup = ({ onConfirm, onClose }) => {
    const [url, setUrl] = useState('https://');
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); onConfirm(url); }
        if (e.key === 'Escape') onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-bg-overlay)' }}
            onMouseDown={onClose}
        >
            <div
                className="rounded-xl border p-5 w-full max-w-sm space-y-3 shadow-lg"
                style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Insert Link
                </p>
                <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com"
                    className="input-field"
                />
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 text-sm rounded-lg border"
                        style={{
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-secondary)',
                            backgroundColor: 'var(--color-bg-input)',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(url)}
                        className="px-4 py-1.5 text-sm rounded-lg font-medium"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-text-inverse)',
                        }}
                    >
                        Insert
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Editor ──
const RichTextEditor = ({ content = '', onChange, placeholder = 'Write your story...' }) => {
    const [showLinkPopup, setShowLinkPopup] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ link: false }),
            Link.configure({ openOnClick: false, autolink: true }),
            Placeholder.configure({ placeholder }),
        ],
        content,
        onUpdate({ editor }) {
            const html = editor.getHTML();
            // word count
            const text = editor.getText();
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            setWordCount(words);
            onChange(html);
        },
        onFocus() { setIsFocused(true); },
        onBlur() { setIsFocused(false); },
    });

    // ── Fix: sync content when loaded async (EditPost) ──
    useEffect(() => {
        if (editor && content && editor.isEmpty) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    // ── Link handler ──
    const handleLinkConfirm = (url) => {
        setShowLinkPopup(false);
        if (!url || url === 'https://') return;
        if (editor.state.selection.empty) {
            // no text selected — insert URL as text + link
            editor.chain().focus()
                .insertContent(`<a href="${url}">${url}</a>`)
                .run();
        } else {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const canUndo = editor.can().undo();
    const canRedo = editor.can().redo();

    return (
        <>
            {/* Link popup modal */}
            {showLinkPopup && (
                <LinkPopup
                    onConfirm={handleLinkConfirm}
                    onClose={() => setShowLinkPopup(false)}
                />
            )}

            <div
                className="rounded-xl border overflow-hidden transition-colors"
                style={{
                    borderColor: isFocused ? 'var(--color-border-focus)' : 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-card)',
                    boxShadow: isFocused ? '0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)' : 'none',
                }}
            >
                {/* ── Toolbar ── */}
                <div
                    className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b"
                    style={{
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-bg-input)',
                    }}
                >
                    {/* Text formatting */}
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
                        <MdFormatBold size={18} />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
                        <MdFormatItalic size={18} />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                        <MdFormatStrikethrough size={18} />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
                        <MdCode size={18} />
                    </ToolbarBtn>

                    <Divider />

                    {/* Headings */}
                    {[1, 2, 3].map(level => (
                        <ToolbarBtn
                            key={level}
                            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                            active={editor.isActive('heading', { level })}
                            title={`Heading ${level}`}
                        >
                            <span className="text-xs font-bold w-5 text-center block">H{level}</span>
                        </ToolbarBtn>
                    ))}

                    <Divider />

                    {/* Lists + blocks */}
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
                        <MdFormatListBulleted size={18} />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
                        <MdFormatListNumbered size={18} />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                        <MdFormatQuote size={18} />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
                        <span className="text-xs font-mono font-bold">{'<>'}</span>
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontal rule">
                        <MdHorizontalRule size={18} />
                    </ToolbarBtn>

                    <Divider />

                    {/* Link */}
                    <ToolbarBtn onClick={() => setShowLinkPopup(true)} active={editor.isActive('link')} title="Insert link">
                        <MdLink size={18} />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        active={false}
                        disabled={!editor.isActive('link')}
                        title="Remove link"
                    >
                        <MdLinkOff size={18} />
                    </ToolbarBtn>

                    <Divider />

                    {/* Undo / Redo */}
                    <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} disabled={!canUndo} title="Undo (Ctrl+Z)">
                        <MdUndo size={18} />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} disabled={!canRedo} title="Redo (Ctrl+Y)">
                        <MdRedo size={18} />
                    </ToolbarBtn>
                </div>

                {/* ── Editor Content ── */}
                <EditorContent editor={editor} className="rte-content" />

                {/* ── Footer: word count ── */}
                <div
                    className="px-4 py-1.5 border-t flex justify-end"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-input)' }}
                >
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </span>
                </div>
            </div>

            {/* ── Scoped CSS ── */}
            <style>{`
                .rte-content .ProseMirror {
                    min-height: 300px;
                    padding: 16px;
                    outline: none;
                    color: var(--color-text-primary);
                    font-size: 0.95rem;
                    line-height: 1.8;
                }

                /* Placeholder */
                .rte-content .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    color: var(--color-text-muted);
                    pointer-events: none;
                    float: left;
                    height: 0;
                }

                /* Headings */
                .rte-content .ProseMirror h1 { font-size: 1.75rem; font-weight: 700; margin: 1.2rem 0 0.5rem; color: var(--color-text-primary); line-height: 1.3; }
                .rte-content .ProseMirror h2 { font-size: 1.4rem;  font-weight: 700; margin: 1rem 0 0.4rem;   color: var(--color-text-primary); line-height: 1.3; }
                .rte-content .ProseMirror h3 { font-size: 1.15rem; font-weight: 600; margin: 0.9rem 0 0.3rem; color: var(--color-text-primary); line-height: 1.3; }

                /* Paragraph */
                .rte-content .ProseMirror p { margin: 0.5rem 0; }

                /* Lists */
                .rte-content .ProseMirror ul { list-style: disc;    padding-left: 1.5rem; margin: 0.6rem 0; }
                .rte-content .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin: 0.6rem 0; }
                .rte-content .ProseMirror li { margin: 0.25rem 0; }
                .rte-content .ProseMirror li p { margin: 0; }

                /* Blockquote */
                .rte-content .ProseMirror blockquote {
                    border-left: 3px solid var(--color-primary);
                    padding: 0.5rem 0 0.5rem 1rem;
                    margin: 0.75rem 0;
                    color: var(--color-text-secondary);
                    font-style: italic;
                    border-radius: 0 4px 4px 0;
                    background-color: var(--color-primary-light);
                }

                /* Inline code */
                .rte-content .ProseMirror code {
                    background-color: var(--color-bg-input);
                    color: var(--color-primary);
                    padding: 0.15rem 0.4rem;
                    border-radius: 4px;
                    font-size: 0.85em;
                    font-family: monospace;
                    border: 1px solid var(--color-border);
                }

                /* Code block */
                .rte-content .ProseMirror pre {
                    background-color: var(--color-bg-input);
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    padding: 1rem;
                    margin: 0.75rem 0;
                    overflow-x: auto;
                }
                .rte-content .ProseMirror pre code {
                    background: none;
                    border: none;
                    padding: 0;
                    color: var(--color-text-primary);
                    font-size: 0.875rem;
                }

                /* HR */
                .rte-content .ProseMirror hr {
                    border: none;
                    border-top: 2px solid var(--color-border);
                    margin: 1.25rem 0;
                }

                /* Link */
                .rte-content .ProseMirror a {
                    color: var(--color-primary);
                    text-decoration: underline;
                    cursor: pointer;
                }

                /* Text styles */
                .rte-content .ProseMirror strong { font-weight: 700; }
                .rte-content .ProseMirror em     { font-style: italic; }
                .rte-content .ProseMirror s      { text-decoration: line-through; }
            `}</style>
        </>
    );
};

export default RichTextEditor;