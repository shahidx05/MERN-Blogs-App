import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    MdAutoAwesome,
    MdSpeed,
    MdCode,
    MdEdit,
    MdPeople,
    MdArrowOutward,
    MdStorage,
    MdShield,
    MdCreate,
    MdAutoFixHigh,
    MdCompress,
    MdOpenInFull,
    MdSpellcheck,
} from "react-icons/md";
import {
    FaReact,
    FaNodeJs,
    FaGithub,
    FaLinkedin,
    FaXTwitter,
} from "react-icons/fa6";
import { SiMongodb, SiCloudinary, SiJsonwebtokens } from "react-icons/si";
import logo from "../assets/logo.png";

/* ─── Badge ─── */
const Badge = ({ children }) => (
    <span className="inline-block text-[0.68rem] font-semibold tracking-[0.04em] text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] px-[10px] py-[3px] rounded-md">{children}</span>
);

/* ─── Section label ─── */
const SectionLabel = ({ children }) => (
    <p className="inline-block text-[0.68rem] font-bold tracking-[0.12em] uppercase text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[color-mix(in_srgb,var(--color-primary)_22%,transparent)] px-3 py-[3px] rounded-full mb-3">{children}</p>
);

/* ─── Divider ─── */
const Divider = () => <div className="h-px bg-[var(--color-border)] my-10" />;

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */

const techCategories = [
    {
        category: "Frontend",
        icon: <FaReact size={16} />,
        color: "#61DAFB",
        items: [
            { name: "React 19", desc: "Component-based UI library" },
            { name: "React Router v7", desc: "Client-side routing & protected routes" },
            { name: "TipTap Editor", desc: "Rich text editing with extensions" },
            { name: "Tailwind CSS v4", desc: "Utility-first styling framework" },
            { name: "Axios", desc: "HTTP client for API requests" },
        ],
    },
    {
        category: "Backend",
        icon: <FaNodeJs size={16} />,
        color: "#68A063",
        items: [
            { name: "Node.js", desc: "JavaScript server runtime" },
            { name: "Express v5", desc: "Minimal REST API framework" },
            { name: "Multer", desc: "Multipart file upload middleware" },
            { name: "sanitize-html", desc: "Strips unsafe HTML from posts" },
            { name: "express-rate-limit", desc: "API route abuse protection" },
        ],
    },
    {
        category: "Database",
        icon: <SiMongodb size={16} />,
        color: "#4DB33D",
        items: [
            { name: "MongoDB Atlas", desc: "Cloud-hosted NoSQL database" },
            { name: "Mongoose ODM", desc: "Schema modeling & validation" },
            { name: "Referenced models", desc: "ObjectId refs across collections" },
            { name: "Timestamps", desc: "Auto createdAt / updatedAt fields" },
        ],
    },
    {
        category: "AI Layer",
        icon: <MdAutoAwesome size={16} />,
        color: "#818CF8",
        items: [
            { name: "OpenRouter Gateway", desc: "Unified API connecting to global LLMs" },
            { name: "Step-3.5-Flash / Nemotron", desc: "Fast, context-aware writing models" },
            { name: "Multi-Model Fallback", desc: "Server-side retry chain for 100% uptime" },
            { name: "Format-Preserving Engines", desc: "Prompts tuned for semantic editor HTML" },
        ],
    },
    {
        category: "Auth & Security",
        icon: <SiJsonwebtokens size={16} />,
        color: "#F59E0B",
        items: [
            { name: "JWT", desc: "Stateless auth with 7-day tokens" },
            { name: "bcrypt", desc: "Password hashing, 10 rounds" },
            { name: "Bearer token auth", desc: "Authorization header validation" },
            { name: "HTML sanitization", desc: "XSS prevention on all content" },
        ],
    },
    {
        category: "Storage",
        icon: <SiCloudinary size={16} />,
        color: "#3448C5",
        items: [
            { name: "Cloudinary CDN", desc: "Cloud media hosting & delivery" },
            { name: "Buffer uploads", desc: "In-memory file handling via Multer" },
            { name: "Post cover images", desc: "Optional hero image per post" },
            { name: "Profile avatars", desc: "User profile picture storage" },
        ],
    },
];

const featureGroups = [
    {
        icon: <MdAutoAwesome size={20} />,
        title: "AI Writing Assistant",
        color: "#818CF8",
        bg: "rgba(129,140,248,0.1)",
        border: "rgba(129,140,248,0.2)",
        points: [
            "Generate complete structured post drafts from a title",
            "Rewrite, shorten, expand, or improve writing contextually",
            "Fix grammar, spelling, and punctuation with one click",
            "Powered by OpenRouter with a robust model fallback chain",
        ],
    },
    {
        icon: <MdPeople size={20} />,
        title: "Social Features",
        color: "#F43F5E",
        bg: "rgba(244,63,94,0.1)",
        border: "rgba(244,63,94,0.2)",
        points: [
            "Follow authors and get a personal feed",
            "Like, comment, and bookmark posts",
            "View follower and following lists",
        ],
    },
    {
        icon: <MdShield size={20} />,
        title: "Security",
        color: "#10B981",
        bg: "rgba(16,185,129,0.1)",
        border: "rgba(16,185,129,0.2)",
        points: [
            "JWT authentication with 7-day expiry",
            "HTML sanitization to prevent XSS",
            "Rate limiting on all API routes",
        ],
    },
    {
        icon: <MdEdit size={20} />,
        title: "Editor Experience",
        color: "#6366F1",
        bg: "rgba(99,102,241,0.1)",
        border: "rgba(99,102,241,0.2)",
        points: [
            "TipTap rich text editor",
            "Headings, bold, italic, and code blocks",
            "Cover image upload via Cloudinary",
        ],
    },
    {
        icon: <MdSpeed size={20} />,
        title: "Performance & UX",
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.1)",
        border: "rgba(245,158,11,0.2)",
        points: [
            "Paginated posts with search and tag filters",
            "Light and dark theme with persistence",
            "View count tracking per post",
        ],
    },
    {
        icon: <MdCode size={20} />,
        title: "Developer Workflow",
        color: "#64748B",
        bg: "rgba(100,116,139,0.1)",
        border: "rgba(100,116,139,0.2)",
        points: [
            "Environment-based configuration",
            "Seed scripts for demo data",
            "Vercel and Render deployment ready",
        ],
    },
];

const SIMULATED_DATA = {
    generate: {
        id: "generate",
        label: "Generate Post",
        description: "Create full posts from a title",
        icon: MdCreate,
        color: "#6366F1",
        bg: "rgba(99,102,241,0.08)",
        prompt: "Draft Prompt / Title",
        beforeLabel: "Enter Title to Start",
        beforeText: "Explain Quantum Computing in Simple Terms",
        afterText: `<h2>Understanding Quantum Computing</h2>
<p>Unlike classical computers that use bits (0s and 1s), quantum computers use <strong>qubits</strong>. Qubits can exist in a state of <em>superposition</em>, meaning they can represent both 0 and 1 simultaneously.</p>
<p>This allows quantum computers to process complex calculations at speeds unimaginable with traditional computers, potentially solving problems in cryptography, chemistry, and optimization in minutes rather than millennia.</p>`
    },
    rewrite: {
        id: "rewrite",
        label: "Rewrite",
        description: "Rephrase with fresh, elegant vocabulary",
        icon: MdAutoFixHigh,
        color: "#8B5CF6",
        bg: "rgba(139,92,246,0.08)",
        prompt: "Original Draft",
        beforeLabel: "Original Editor Content",
        beforeText: "<p>We want to make a really cool web app that uses databases and backend APIs. It should be fast and look nice for people who visit it, so they want to come back.</p>",
        afterText: "<p>Our objective is to architect a highly responsive, modern web application powered by robust database schemas and structured APIs. By prioritizing performance and premium aesthetics, we deliver an immersive user experience that drives sustained retention.</p>"
    },
    improve: {
        id: "improve",
        label: "Improve Writing",
        description: "Better sentence flow, tone, and clarity",
        icon: MdAutoAwesome,
        color: "#06B6D4",
        bg: "rgba(6,182,212,0.08)",
        prompt: "Draft Snippet",
        beforeLabel: "Original Editor Content",
        beforeText: "<p>I think coding is good. It makes you think. You can solve problems and build things that help everyone in the world.</p>",
        afterText: "<p>Programming is a powerful intellectual exercise that sharpens problem-solving skills. It empowers developers to build innovative solutions that address real-world challenges on a global scale.</p>"
    },
    shorten: {
        id: "shorten",
        label: "Shorten",
        description: "Condense and edit to eliminate wordiness",
        icon: MdCompress,
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.08)",
        prompt: "Wordy Source Text",
        beforeLabel: "Original Editor Content",
        beforeText: "<p>At the end of the day, when you look at how web development has changed over the years, the most important thing to keep in mind is that the simpler your code is, the easier it is to maintain and scale over time for everyone on the team.</p>",
        afterText: "<p>Ultimately, modern web development highlights a core truth: simpler codebases are significantly easier to maintain, scale, and collaborate on.</p>"
    },
    expand: {
        id: "expand",
        label: "Expand",
        description: "Flesh out ideas with details and examples",
        icon: MdOpenInFull,
        color: "#10B981",
        bg: "rgba(16,185,129,0.08)",
        prompt: "Simple Idea",
        beforeLabel: "Original Editor Content",
        beforeText: "<p>Rich text editors are essential for modern blogs.</p>",
        afterText: "<p>Rich text editors are the cornerstone of modern blogging platforms, transforming how writers create content. By providing intuitive formatting—such as headers, blockquotes, lists, and inline code blocks—they bridge the gap between technical structure and creative expression, ensuring a frictionless publishing experience.</p>"
    },
    'fix-grammar': {
        id: "fix-grammar",
        label: "Fix Grammar",
        description: "Fix spelling, punctuation, and grammar mistakes",
        icon: MdSpellcheck,
        color: "#16A34A",
        bg: "rgba(22,163,74,0.08)",
        prompt: "Draft with Mistakes",
        beforeLabel: "Original Editor Content",
        beforeText: "<p>their is many reason why coding are fun but sumtimes its hard to find bugs when u make mistakes</p>",
        afterText: "<p>There are many reasons why coding is fun, but sometimes it is hard to find bugs when you make mistakes.</p>"
    }
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
const About = () => {
    const [activeTab, setActiveTab] = useState("generate");
    const [simulating, setSimulating] = useState(false);
    const [simulatedContent, setSimulatedContent] = useState("");

    useEffect(() => {
        setSimulating(true);
        setSimulatedContent("");
        const timer = setTimeout(() => {
            setSimulating(false);
            setSimulatedContent(SIMULATED_DATA[activeTab].afterText);
        }, 1100);
        return () => clearTimeout(timer);
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <div className="max-w-[900px] mx-auto px-4 pt-8 pb-[60px] sm:px-6 sm:pt-9">

                {/* ── HERO ── */}
                <section className="flex flex-col items-start gap-[14px] pb-1">
                    <div className="flex flex-wrap gap-2">
                        <Badge>MERN Stack</Badge>
                        <Badge>AI Powered</Badge>
                        <Badge>JWT Auth</Badge>
                        <Badge>REST API</Badge>
                        <Badge>Portfolio Project</Badge>
                    </div>

                    <div className="flex items-center gap-[14px]">
                        <img src={logo} alt="Blogiary" className="w-12 h-12 object-contain flex-shrink-0" />
                        <h1 className="text-[clamp(2rem,5vw,2.8rem)] font-bold text-[var(--color-primary)] tracking-[-0.03em] leading-[1.1] m-0">
                            Blogiary
                        </h1>
                    </div>

                    <p className="text-base text-[var(--color-text-secondary)] leading-[1.75] max-w-[640px] m-0">
                        A full-stack blogging platform built with the MERN stack. Write and publish posts,
                        follow authors, interact with the community — with an AI writing assistant built in.
                    </p>

                    <div className="flex items-center gap-[10px] flex-wrap mt-1">
                        <a
                            href="https://github.com/shahidx05/blogiary"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-[6px] bg-transparent text-[var(--color-text-secondary)] text-[0.875rem] font-semibold px-[18px] py-2 rounded-[10px] border-[1.5px] border-[var(--color-border)] transition-all duration-200 hover:text-[var(--color-primary)] hover:border-[color-mix(in_srgb,var(--color-primary)_45%,transparent)] hover:bg-[var(--color-primary-light)]"
                            id="about-github-source"
                        >
                            <FaGithub size={15} />
                            View Source
                        </a>
                        <Link to="/register" className="inline-flex items-center gap-[6px] bg-[var(--color-primary)] text-white text-[0.875rem] font-semibold px-5 py-[9px] rounded-[10px] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white hover:-translate-y-[1px]" id="about-try-platform">
                            Try the Platform
                            <MdArrowOutward size={15} />
                        </Link>
                    </div>
                </section>

                <Divider />

                {/* ── OVERVIEW ── */}
                <section className="flex flex-col gap-5">
                    <div className="flex flex-col gap-[6px]">
                        <SectionLabel>Overview</SectionLabel>
                        <h2 className="text-[clamp(1.3rem,3.5vw,1.65rem)] font-bold text-[var(--color-text-primary)] tracking-[-0.025em] leading-[1.2]">
                            What is Blogiary?
                        </h2>
                    </div>

                    <div className="flex flex-col gap-[14px]">
                        <p className="text-[0.925rem] leading-[1.8] text-[var(--color-text-secondary)]">
                            Blogiary is a full-stack blogging application where users can write, edit,
                            and publish posts using a rich text editor. Posts support cover images, tags,
                            likes, comments, and view tracking. Readers can follow authors and get a
                            personalized feed of content from people they follow.
                        </p>
                        <p className="text-[0.925rem] leading-[1.8] text-[var(--color-text-secondary)]">
                            Under the hood, it’s built on production-ready architecture—featuring secure JWT authentication, rate-limited APIs, strict XSS sanitization, cloud media delivery, and highly optimized, paginated data fetching.
                        </p>
                    </div>

                    {/* AI Callout (Highlighted Intro) */}
                    <div className="flex items-start gap-[14px] bg-[var(--color-primary-light)] border border-[color-mix(in_srgb,var(--color-primary)_22%,transparent)] rounded-[14px] p-[18px_20px] mt-2">
                        <div className="w-9 h-9 rounded-[10px] bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 mt-px">
                            <MdAutoAwesome size={18} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[0.875rem] font-bold text-[var(--color-primary)] leading-[1.3] m-0">
                                Advanced AI Assist Suite
                            </p>
                            <p className="text-[0.825rem] text-[var(--color-text-secondary)] leading-[1.65] m-0 mt-0.5">
                                Meet your intelligent co-writer. The AI Assist suite helps you generate full drafts, refine your tone, condense ideas, or fix grammar on the fly. It securely processes your requests and outputs clean, semantic HTML that integrates flawlessly with the rich-text editor.
                            </p>
                        </div>
                    </div>

                    {/* Interactive AI Assist Showcase */}
                    <div className="flex flex-col gap-5 mt-4">
                        <div className="flex flex-col gap-[6px]">
                            <h3 className="text-[1rem] font-bold text-[var(--color-text-primary)]">
                                Try the AI Assist Suite
                            </h3>
                            <p className="text-[0.825rem] text-[var(--color-text-secondary)] leading-[1.6] max-w-[680px]">
                                Click on the editor actions below to see how our AI Writing Assistant contextually rephrases, expands, condenses, or corrects content.
                            </p>
                        </div>

                        {/* Actions Tabs */}
                        <div className="flex flex-wrap gap-[7px]">
                            {Object.values(SIMULATED_DATA).map((item) => {
                                const IconComponent = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex items-center gap-1.5 text-[0.72rem] font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-[linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))] border-[var(--color-primary)] text-[var(--color-primary)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
                                                : "bg-[var(--color-bg-card)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                        }`}
                                    >
                                        <IconComponent size={13} className={isActive ? "animate-pulse text-[var(--color-primary)]" : ""} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* macOS Browser Mockup */}
                        <div className="w-full bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200/90 flex flex-col font-sans select-none text-[#1E293B] mt-1">
                            {/* Browser Bar */}
                            <div className="h-[38px] bg-[#F4F4F9] border-b border-slate-200/60 px-4 flex items-center justify-between flex-shrink-0">
                                {/* Window dots */}
                                <div className="flex items-center gap-1.5 w-1/4">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                                </div>
                                {/* Address bar */}
                                <div className="w-2/4 max-w-[260px] h-[22px] bg-[#F3F4F6] rounded-md border border-slate-200/40 text-[9px] text-slate-400 flex items-center justify-center gap-1 font-medium shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                    <MdAutoAwesome size={9} className="text-[#6366F1]" />
                                    <span>blogiary.app/ai-assist/{activeTab}</span>
                                </div>
                                <div className="w-1/4" />
                            </div>

                            {/* Editor Area (Light themed mockup) */}
                            <div className="grid grid-cols-2 gap-px bg-slate-200/40 min-h-[190px] max-[640px]:grid-cols-1">
                                {/* Left Side: Original / Input */}
                                <div className="bg-[#FFFFFF] p-[16px_20px] flex flex-col gap-2.5 min-h-[150px]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                        <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">
                                            {SIMULATED_DATA[activeTab].prompt}
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-medium">Input Source</span>
                                    </div>
                                    <div className="text-[12px] leading-[1.65] text-[#475569] italic overflow-y-auto pr-1">
                                        {SIMULATED_DATA[activeTab].beforeText ? (
                                            <div dangerouslySetInnerHTML={{ __html: SIMULATED_DATA[activeTab].beforeText }} />
                                        ) : (
                                            <span className="text-slate-400 text-xs font-normal">(Editor is empty, awaiting input)</span>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: AI Transform */}
                                <div className="bg-[#FAFBFD] p-[16px_20px] flex flex-col gap-2.5 relative min-h-[150px]">
                                    <div className="flex items-center justify-between border-b border-slate-200/40 pb-1.5">
                                        <span className="text-[9px] font-bold tracking-wider uppercase text-[#6366F1] flex items-center gap-1">
                                            <MdAutoAwesome size={10} className="animate-spin-slow" />
                                            AI Assistant
                                        </span>
                                        <span className="text-[9px] text-[#6366F1] font-bold">Transformed Output</span>
                                    </div>
                                    <div className="text-[12px] leading-[1.65] text-[#1E293B] overflow-y-auto pr-1">
                                        {simulating ? (
                                            <div className="absolute inset-0 bg-[#FAFBFD]/90 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                                                <div className="relative flex items-center justify-center">
                                                    <div className="absolute w-8 h-8 rounded-full border-2 border-indigo-100 border-t-indigo-600 animate-spin" />
                                                    <MdAutoAwesome size={14} className="text-indigo-600 animate-pulse" />
                                                </div>
                                                <span className="text-[10px] font-bold text-indigo-600 tracking-wider animate-pulse">
                                                    OpenRouter Fallback Chain Active...
                                                </span>
                                            </div>
                                        ) : (
                                            <div 
                                                className="prose-mockup" 
                                                style={{ animation: 'fadeInUp 0.35s ease forwards' }}
                                                dangerouslySetInnerHTML={{ __html: simulatedContent }} 
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Engine Tech Details Grid */}
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 mt-1">
                            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[14px] p-4 flex flex-col gap-2.5 shadow-[var(--shadow-card)]">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <MdAutoAwesome size={15} />
                                </div>
                                <h4 className="text-[0.825rem] font-bold text-[var(--color-text-primary)]">Multi-Model Fallback Engine</h4>
                                <p className="text-[0.74rem] text-[var(--color-text-secondary)] leading-[1.65] m-0">
                                   Powered by the OpenRouter gateway. If the primary LLM experiences latency or downtime, requests instantly fall back to an alternative model, ensuring 100% service availability and uninterrupted writing.
                                </p>
                            </div>

                            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[14px] p-4 flex flex-col gap-2.5 shadow-[var(--shadow-card)]">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <MdCode size={15} />
                                </div>
                                <h4 className="text-[0.825rem] font-bold text-[var(--color-text-primary)]">TipTap HTML Integration</h4>
                                <p className="text-[0.74rem] text-[var(--color-text-secondary)] leading-[1.65] m-0">
                                    Custom backend utilities automatically strip markdown wrappers and sanitize the AI's output. This guarantees that the AI delivers raw, semantic HTML that perfectly matches the editor's strict document schema.
                                </p>
                            </div>

                            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[14px] p-4 flex flex-col gap-2.5 shadow-[var(--shadow-card)]">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <MdShield size={15} />
                                </div>
                                <h4 className="text-[0.825rem] font-bold text-[var(--color-text-primary)]">Rate-Limit & Security Controls</h4>
                                <p className="text-[0.74rem] text-[var(--color-text-secondary)] leading-[1.65] m-0">
                                    An IP-based rate-limiter protects our OpenRouter routing node from API abuse. Registered users are allocated 10 AI operations per hour, maintaining fair resources for everyone.
                                </p>
                            </div>
                        </div>
                    </div>

                    <style>{`
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(8px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .prose-mockup h2 {
                            font-size: 1.05rem;
                            font-weight: 700;
                            margin: 0 0 0.4rem 0;
                            color: #1E293B;
                            line-height: 1.3;
                        }
                        .prose-mockup p {
                            margin: 0 0 0.6rem 0;
                            color: #334155;
                            line-height: 1.6;
                        }
                        .prose-mockup p:last-child {
                            margin-bottom: 0;
                        }
                        .prose-mockup strong {
                            font-weight: 600;
                            color: #0F172A;
                        }
                        .prose-mockup em {
                            font-style: italic;
                        }
                        .animate-spin-slow {
                            animation: spin-slow 8s linear infinite;
                        }
                        @keyframes spin-slow {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </section>

                <Divider />

                {/* ── FEATURES ── */}
                <section className="flex flex-col gap-5">
                    <div className="flex flex-col gap-[6px]">
                        <SectionLabel>Core Features</SectionLabel>
                        <h2 className="text-[clamp(1.3rem,3.5vw,1.65rem)] font-bold text-[var(--color-text-primary)] tracking-[-0.025em] leading-[1.2]">
                            What's inside
                        </h2>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[14px]">
                        {featureGroups.map((group) => (
                            <div
                                key={group.title}
                                className="bg-[var(--color-bg-card)] border border-[var(--feature-border,var(--color-border))] rounded-[14px] p-5 flex flex-col gap-[14px] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                                style={{
                                    "--feature-color": group.color,
                                    "--feature-bg": group.bg,
                                    "--feature-border": group.border,
                                }}
                            >
                                <div className="flex items-center gap-[10px]">
                                    <div
                                        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                                        style={{ color: group.color, backgroundColor: group.bg }}
                                    >
                                        {group.icon}
                                    </div>
                                    <h3 className="text-[0.9rem] font-bold text-[var(--color-text-primary)]">
                                        {group.title}
                                    </h3>
                                </div>
                                <ul className="list-none flex flex-col gap-[7px]">
                                    {group.points.map((p) => (
                                        <li key={p} className="flex items-start gap-2 text-[0.8rem] text-[var(--color-text-secondary)] leading-[1.5]">
                                            <span
                                                className="w-[5px] h-[5px] rounded-full flex-shrink-0 mt-[5px]"
                                                style={{ backgroundColor: group.color }}
                                            />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <Divider />

                {/* ── TECH STACK ── */}
                <section className="flex flex-col gap-5">
                    <div className="flex flex-col gap-[6px]">
                        <SectionLabel>Tech Stack</SectionLabel>
                        <h2 className="text-[clamp(1.3rem,3.5vw,1.65rem)] font-bold text-[var(--color-text-primary)] tracking-[-0.025em] leading-[1.2]">
                            Technologies used
                        </h2>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
                        {techCategories.map((cat) => (
                            <div key={cat.category} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-[18px] flex flex-col gap-3 shadow-[var(--shadow-card)] transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)]">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-[30px] h-[30px] rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ color: cat.color, backgroundColor: `${cat.color}18` }}
                                    >
                                        {cat.icon}
                                    </span>
                                    <span className="text-[0.82rem] font-bold text-[var(--color-text-primary)] tracking-[0.01em]">
                                        {cat.category}
                                    </span>
                                </div>
                                <ul className="list-none flex flex-col gap-[5px]">
                                    {cat.items.map((item) => (
                                        <li key={item.name} className="flex flex-col gap-px py-[7px] border-b border-[var(--color-border)] last:border-b-0 last:pb-0 first:pt-0">
                                            <span className="text-[0.8rem] font-semibold text-[var(--color-text-primary)] leading-[1.3]">
                                                {item.name}
                                            </span>
                                            <span className="text-[0.72rem] text-[var(--color-text-muted)] leading-[1.4]">
                                                {item.desc}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <Divider />

                {/* ── PROJECT PHILOSOPHY ── */}
                <section className="flex flex-col gap-5">
                    <div className="flex flex-col gap-[6px]">
                        <SectionLabel>Project Philosophy</SectionLabel>
                        <h2 className="text-[clamp(1.3rem,3.5vw,1.65rem)] font-bold text-[var(--color-text-primary)] tracking-[-0.025em] leading-[1.2]">
                            Why this was built
                        </h2>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[14px]">
                        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[14px] p-[22px] flex flex-col gap-[10px] shadow-[var(--shadow-card)]">
                            <div className="w-9 h-9 rounded-[10px] bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                <MdCode size={18} />
                            </div>
                            <h3 className="text-[0.9rem] font-bold text-[var(--color-text-primary)]">Real-world architecture</h3>
                            <p className="text-[0.82rem] text-[var(--color-text-secondary)] leading-[1.7]">
                                Blogiary is built on robust, real-world patterns—implementing secure auth middleware, protected React routes, rigorous data validation, and strict API rate limiting.
                            </p>
                        </div>

                        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[14px] p-[22px] flex flex-col gap-[10px] shadow-[var(--shadow-card)]">
                            <div className="w-9 h-9 rounded-[10px] bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                <MdAutoAwesome size={18} />
                            </div>
                            <h3 className="text-[0.9rem] font-bold text-[var(--color-text-primary)]">AI in a real product context</h3>
                            <p className="text-[0.82rem] text-[var(--color-text-secondary)] leading-[1.7]">
                                Demonstrates how to effectively integrate LLMs at the backend layer, manage multi-model fallbacks, sanitize AI output, and safely inject it into a client-side interface.
                            </p>
                        </div>

                        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[14px] p-[22px] flex flex-col gap-[10px] shadow-[var(--shadow-card)]">
                            <div className="w-9 h-9 rounded-[10px] bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                <MdStorage size={18} />
                            </div>
                            <h3 className="text-[0.9rem] font-bold text-[var(--color-text-primary)]">Scalable data patterns</h3>
                            <p className="text-[0.82rem] text-[var(--color-text-secondary)] leading-[1.7]">
                                Every list endpoint is fully paginated and supports advanced search, tag filtering, and sorting—reflecting highly scalable API design decisions.
                            </p>
                        </div>
                    </div>
                </section>

                <Divider />

                {/* ── DEVELOPER ── */}
                <section className="flex flex-col gap-5">
                    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-7 shadow-[var(--shadow-card)] flex flex-col gap-[22px]">
                        <h3 className="text-[1.25rem] font-extrabold text-[var(--color-text-primary)] m-0 tracking-[-0.025em]">
                            About the Developer
                        </h3>
                        <div className="grid grid-cols-[260px_1fr] gap-7 items-stretch max-[680px]:grid-cols-1 max-[680px]:gap-6">
                            {/* Left: profile */}
                            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-[28px_20px] flex flex-col items-center text-center justify-center">
                                <div className="relative w-[92px] h-[92px] flex items-center justify-center mb-[14px]">
                                    <div className="about-dev-avatar-ring"></div>
                                    <div className="w-[78px] h-[78px] rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#ec4899] text-white text-[1.45rem] font-extrabold flex items-center justify-center tracking-[0.02em] shadow-[0_4px_12px_rgba(99,102,241,0.25)]">
                                        SK
                                    </div>
                                </div>
                                <h4 className="text-base font-bold text-[var(--color-text-primary)] m-0 mb-1 leading-[1.2]">
                                    Shahid Khan
                                </h4>
                                <p className="text-[0.76rem] font-semibold text-[var(--color-primary)] m-0 mb-5 tracking-[0.01em]">
                                    Full-Stack Developer
                                </p>

                                <div className="flex flex-col gap-2 w-full">
                                    <a
                                        href="https://github.com/shahidx05"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[0.78rem] font-semibold py-[8.5px] px-3 rounded-lg transition-all duration-200 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] hover:border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] hover:-translate-y-[1px]"
                                        id="about-dev-github"
                                    >
                                        <FaGithub size={15} />
                                        <span>Connect on GitHub</span>
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/shahidx05"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[0.78rem] font-semibold py-[8.5px] px-3 rounded-lg transition-all duration-200 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] hover:border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] hover:-translate-y-[1px]"
                                        id="about-dev-linkedin"
                                    >
                                        <FaLinkedin size={15} />
                                        <span>Connect on LinkedIn</span>
                                    </a>
                                    <a
                                        href="https://x.com/shahidx_05"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[0.78rem] font-semibold py-[8.5px] px-3 rounded-lg transition-all duration-200 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] hover:border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] hover:-translate-y-[1px]"
                                        id="about-dev-twitter"
                                    >
                                        <FaXTwitter size={15} />
                                        <span>Connect on X / Twitter</span>
                                    </a>
                                </div>
                            </div>

                            {/* Right: bio */}
                            <div className="flex flex-col justify-center">
                                <h4 className="text-[1.05rem] font-bold text-[var(--color-text-primary)] m-0 mb-[10px] leading-[1.3]">
                                    Hi there, I'm Shahid! 👋
                                </h4>
                                <p className="text-[0.84rem] text-[var(--color-text-secondary)] leading-[1.65] m-0 mb-3">
                                   I am a full-stack developer specializing in the MERN stack, with a deep passion for building fast, secure, and AI-integrated web applications. Currently an IT undergrad, I believe in "learning in public" and tackling complex challenges—whether that's architecting clean MVC APIs or solving advanced data structures and algorithms in C++.
                                </p>
                                <p className="text-[0.84rem] text-[var(--color-text-secondary)] leading-[1.65] m-0">
                                    Blogiary is one of my largest full-stack projects, built to explore modern web development with React, Node.js, Express, MongoDB, TipTap, Cloudinary, and JWT authentication. Through this project, I focused on creating a clean writing experience, responsive UI design, secure authentication, and scalable backend architecture.
                                </p>

                                <hr className="border-none h-px bg-[var(--color-border)] my-4" />

                                <div className="flex flex-col gap-2">
                                    <h5 className="text-[0.68rem] font-bold tracking-[0.06em] uppercase text-[var(--color-text-muted)] m-0 mb-0.5">
                                        TECHNOLOGIES USED
                                    </h5>
                                    <div className="flex flex-wrap gap-[6px]">
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">React</span>
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">Node.js</span>
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">Express</span>
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">MongoDB</span>
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">JavaScript</span>
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">Tailwind CSS</span>
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">RESTful APIs</span>
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">JWT Auth</span>
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">Cloudinary</span>
                                        <span className="text-[0.72rem] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border border-[var(--color-border)] py-1 px-[10px] rounded-md transition-all duration-150 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">Git & GitHub</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Divider />

                {/* ── CTA ── */}
                <section className="flex flex-col items-center text-center gap-[14px] pt-2">
                    <h2 className="text-[1.4rem] font-bold text-[var(--color-text-primary)] tracking-[-0.02em]">
                        Explore the platform
                    </h2>
                    <p className="text-[0.9rem] text-[var(--color-text-secondary)] max-w-[460px] leading-[1.6]">
                        Dive into the community. Browse existing stories without an account, or sign up for free to start writing, building your audience, and exploring the AI assistant.
                    </p>
                    <div className="flex items-center justify-center flex-wrap gap-[10px] mt-1">
                        <Link to="/register" className="inline-flex items-center gap-[6px] bg-[var(--color-primary)] text-white text-[0.875rem] font-semibold px-5 py-[9px] rounded-[10px] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:text-white hover:-translate-y-[1px]" id="about-cta-register">
                            Create Account
                        </Link>
                        <Link to="/home" className="inline-flex items-center gap-[6px] bg-transparent text-[var(--color-text-secondary)] text-[0.875rem] font-semibold px-[18px] py-2 rounded-[10px] border-[1.5px] border-[var(--color-border)] transition-all duration-200 hover:text-[var(--color-primary)] hover:border-[color-mix(in_srgb,var(--color-primary)_45%,transparent)] hover:bg-[var(--color-primary-light)]" id="about-cta-explore">
                            Explore Posts
                        </Link>
                        <a
                            href="https://github.com/shahidx05/blogiary"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-[6px] bg-transparent text-[var(--color-text-muted)] text-[0.875rem] font-medium px-4 py-2 rounded-[10px] transition-colors duration-200 hover:text-[var(--color-text-secondary)]"
                            id="about-cta-source"
                        >
                            <FaGithub size={14} />
                            View Source
                        </a>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;
