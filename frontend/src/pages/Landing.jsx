import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import {
    MdAutoAwesome,
    MdPeople,
    MdEdit,
    MdArrowForward,
    MdBookmark,
    MdFavorite,
    MdRocketLaunch,
    MdSecurity,
    MdCloudUpload,
    MdStorage,
    MdKeyboardArrowDown,
    MdComment,
    MdSearch,
} from "react-icons/md";
import { FaReact, FaNodeJs } from "react-icons/fa6";

// Import real product screenshots
import AiEditorScreenshot from "../assets/editor_ai.png";
import editorScreenshot from "../assets/editor.png";
import postDetailsScreenshot from "../assets/post_details.png";
import dashboardFeedScreenshot from "../assets/feed.png";

/* ─── Background orb ─── */
const Orb = ({ className }) => <div className={`landing-orb ${className}`} />;

/* ─── Secondary Feature cards (visual hierarchy) ─── */
const features = [
    {
        icon: <MdAutoAwesome size={26} />,
        title: "AI Writing Assistant",
        description: "Enter a topic and get a complete draft in seconds. Tweak it, add your voice, and hit publish.",
        gradient: "from-indigo-500 to-purple-500",
        glow: "rgba(99,102,241,0.3)",
    },
    {
        icon: <MdPeople size={26} />,
        title: "Follow Writers",
        description: "Follow the writers you like and see their posts in your personal feed. Build your own reading list.",
        gradient: "from-pink-500 to-rose-500",
        glow: "rgba(244,63,94,0.3)",
    },
    {
        icon: <MdEdit size={26} />,
        title: "Rich Text Editor",
        description: "Format your posts with headings, bold, italic, code blocks, and more. Writing here feels natural.",
        gradient: "from-emerald-500 to-teal-500",
        glow: "rgba(16,185,129,0.3)",
    },
    {
        icon: <MdBookmark size={26} />,
        title: "Save for Later",
        description: "Bookmark any post with one click and come back to it whenever you want from your profile.",
        gradient: "from-amber-500 to-orange-500",
        glow: "rgba(245,158,11,0.3)",
    },
    {
        icon: <MdCloudUpload size={26} />,
        title: "Cover Images",
        description: "Make your posts stand out. Upload stunning cover images that load instantly for every reader.",
        gradient: "from-cyan-500 to-blue-500",
        glow: "rgba(6,182,212,0.3)",
    },
    {
        icon: <MdSecurity size={26} />,
        title: "Safe and Private",
        description: "YYour data belongs to you. We use industry-standard security to keep your account and content safe.",
        gradient: "from-purple-500 to-violet-500",
        glow: "rgba(139,92,246,0.3)",
    },
];

/* ─── How it works ─── */
const steps = [
    {
        step: "01",
        icon: <MdPeople size={24} />,
        title: "Create an Account",
        desc: "Sign up in seconds, set up your writer profile, and find topics you love.",
    },
    {
        step: "02",
        icon: <MdEdit size={24} />,
        title: "Write a Post",
        desc: "Draft your story in our clean editor, add a cover image, and hit publish.",
    },
    {
        step: "03",
        icon: <MdFavorite size={24} />,
        title: "Share and Connect",
        desc: "Build your audience as readers discover, like, and comment on your work.",
    },
];

/* ─── Tech stack ─── */
const techStack = [
    { icon: <FaReact size={20} />, name: "React 19", desc: "Frontend Engine", color: "#61DAFB" },
    { icon: <FaNodeJs size={20} />, name: "Node.js + Express", desc: "API Architecture", color: "#68A063" },
    { icon: <MdStorage size={20} />, name: "MongoDB", desc: "Database Storage", color: "#4DB33D" },
    { icon: <MdEdit size={20} />, name: "TipTap", desc: "Rich Text Core", color: "#6366F1" },
    { icon: <MdCloudUpload size={20} />, name: "Cloudinary", desc: "CDN Image Delivery", color: "#3448C5" },
];

/* ─── Intersection observer hook ─── */
const useInView = (threshold = 0.05) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView];
};

/* ══════════════════════════════════════════ */
const Landing = () => {
    const { isLoggedIn } = useAuth();
    const [heroRef, heroInView] = useInView();
    const [showcase1Ref, showcase1InView] = useInView();
    const [showcase2Ref, showcase2InView] = useInView();
    const [featRef, featInView] = useInView();
    const [stepsRef, stepsInView] = useInView();
    const [techRef, techInView] = useInView();
    const [ctaRef, ctaInView] = useInView();

    return (
        <div className="min-h-screen bg-[var(--color-bg)] relative overflow-x-hidden">

            {/* Background ambient orbs */}
            <Orb className="top-[-100px] left-[-80px] w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_70%)]" />
            <Orb className="top-[35%] right-[-120px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(244,63,94,0.12)_0%,transparent_70%)]" />
            <Orb className="bottom-[15%] left-[8%] w-[320px] h-[320px] bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)]" />

            {/* ① HERO */}
            <section
                ref={heroRef}
                className={`relative z-10 max-w-[860px] mx-auto px-6 pt-[100px] pb-20 text-center max-sm:px-5 max-sm:pt-[64px] max-sm:pb-[56px] landing-fade-up ${heroInView ? "landing-visible" : ""}`}
            >
                <div className="inline-flex items-center gap-[6px] text-[0.72rem] font-bold tracking-[0.05em] text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] px-[14px] py-[5px] rounded-full mb-7">
                    <MdAutoAwesome size={13} />
                    <span>AI Powered Social Blogging Platform</span>
                </div>

                <h1 className="text-[clamp(2.4rem,7vw,4.2rem)] font-black leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)] mb-6">
                    Write.{" "}
                    <span className="bg-[linear-gradient(135deg,#6366F1_0%,#8B5CF6_40%,#F43F5E_100%)] bg-clip-text text-transparent">Publish. Grow.</span>
                </h1>

                <p className="text-[clamp(1rem,2.5vw,1.18rem)] text-[var(--color-text-secondary)] max-w-[580px] mx-auto mb-10 leading-[1.75]">
                    Create beautiful blog posts with AI assistance, connect with readers, and build your audience — all in one place.
                </p>

                <div className="flex items-center justify-center gap-[14px] flex-wrap">
                    <Link
                        to={isLoggedIn ? "/create-post" : "/register"}
                        className="inline-flex items-center gap-2 bg-[linear-gradient(135deg,#6366F1,#8B5CF6)] text-white text-[0.95rem] font-bold px-7 py-[13px] rounded-[14px] shadow-[0_4px_24px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(99,102,241,0.48)] hover:text-white active:scale-95"
                        id="landing-cta-primary"
                    >
                        <MdRocketLaunch size={17} />
                        {isLoggedIn ? "Start Writing" : "Get Started — It's Free"}
                    </Link>
                    <Link
                        to="/home"
                        className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] bg-transparent border-[1.5px] border-[var(--color-border)] text-[0.95rem] font-semibold px-6 py-3 rounded-[14px] transition-all duration-200 hover:text-[var(--color-primary)] hover:border-[color-mix(in_srgb,var(--color-primary)_50%,transparent)] hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--color-primary-light)]"
                        id="landing-cta-browse"
                    >
                        Browse Feed
                        <MdArrowForward size={16} />
                    </Link>
                </div>

                {/* Hero Screenshot */}
                <div className="mt-14 relative rounded-2xl border border-slate-200/90 bg-white shadow-[0_30px_70px_rgba(0,0,0,0.16),0_0_30px_rgba(99,102,241,0.05)] overflow-hidden max-w-[900px] mx-auto transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_45px_90px_rgba(0,0,0,0.22),0_0_40px_rgba(99,102,241,0.1)]">
                    {/* Browser Header Bar */}
                    <div className="flex items-center px-4 py-3 bg-[#F4F4F9] border-b border-slate-200/80 gap-3 select-none">
                        {/* Red, Yellow, Green Mac window control dots */}
                        <div className="flex gap-1.5 flex-shrink-0">
                            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        {/* Address Bar */}
                        <div className="flex-1 max-w-[360px] mx-auto bg-[#F3F4F6] border border-slate-200/50 py-[4px] px-3 rounded-md text-center text-[0.72rem] font-medium text-slate-500 select-all font-mono tracking-wide truncate">
                            blogiary.app/create-post
                        </div>
                        {/* Spacing box on the right to match the left dots size for perfect visual balance */}
                        <div className="w-[54px] flex-shrink-0 max-sm:hidden" />
                    </div>
                    {/* Browser Content */}
                    <div className="relative bg-white overflow-hidden">
                        <img
                            src={AiEditorScreenshot}
                            alt="Blogiary feed and reader dashboard"
                            className="w-full h-auto block object-cover border-none"
                        />
                    </div>
                </div>

                <div className="mt-[60px] text-[var(--color-text-muted)] flex justify-center animate-[landing-bounce_2s_ease-in-out_infinite]">
                    <MdKeyboardArrowDown size={22} />
                </div>
            </section>

            {/* ② SHOWCASE 1: WRITING STUDIO */}
            <section
                ref={showcase1Ref}
                className={`relative z-10 max-w-[1100px] mx-auto px-6 py-[60px] text-left landing-fade-up ${showcase1InView ? "landing-visible" : ""}`}
            >
                <div className="grid grid-cols-[1.15fr_0.85fr] gap-12 items-center max-md:grid-cols-1 max-md:gap-8">
                    <div className="flex flex-col justify-center max-md:order-1">
                        <div className="inline-block text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] px-[14px] py-1 rounded-full mb-4 self-start">Writing Studio</div>
                        <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-extrabold text-[var(--color-text-primary)] leading-[1.25] mb-4 tracking-[-0.025em]">
                            A clean writing space with smart AI built-in
                        </h2>
                        <p className="text-[0.975rem] text-[var(--color-text-secondary)] leading-[1.75] mb-6">
                            Writing should feel effortless. We've built a beautiful, easy-to-use editor that gets out of your way, complete with an AI assistant to help you when you get stuck.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <MdAutoAwesome size={16} />
                                </div>
                                <div className="text-[0.925rem] leading-[1.5] text-[var(--color-text-secondary)] [&>strong]:text-[var(--color-text-primary)] [&>strong]:block [&>strong]:mb-0.5">
                                    <strong>Your Personal AI Co-Writer</strong>
                                    Generate full drafts from just a title, rewrite paragraphs, improve your tone, or fix grammar instantly.
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <MdEdit size={16} />
                                </div>
                                <div className="text-[0.925rem] leading-[1.5] text-[var(--color-text-secondary)] [&>strong]:text-[var(--color-text-primary)] [&>strong]:block [&>strong]:mb-0.5">
                                    <strong>Rich Media Formatting</strong>
                                    Easily add headings, lists, quotes, links, and code blocks to make your articles look professional.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative rounded-2xl border border-slate-200/90 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.14),0_0_20px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(0,0,0,0.2)] max-md:order-2">
                        {/* Browser Header Bar */}
                        <div className="flex items-center px-4 py-3 bg-[#F4F4F9] border-b border-slate-200/80 gap-3 select-none">
                            {/* Red, Yellow, Green Mac window control dots */}
                            <div className="flex gap-1.5 flex-shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                            </div>
                            {/* Address Bar */}
                            <div className="flex-1 max-w-[260px] mx-auto bg-[#F3F4F6] border border-slate-200/50 py-[3px] px-2.5 rounded-md text-center text-[0.68rem] font-medium text-slate-500 font-mono tracking-wide truncate">
                                blogiary.app/create-post
                            </div>
                            {/* Spacing box on the right to match the left dots size for perfect visual balance */}
                            <div className="w-[48px] flex-shrink-0 max-sm:hidden" />
                        </div>
                        {/* Browser Content */}
                        <div className="relative bg-white overflow-hidden">
                            <img
                                src={editorScreenshot}
                                alt="TipTap Editor with AI Assist dropdown"
                                className="w-full h-auto block object-cover border-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ③ SHOWCASE 2: READER EXPERIENCE */}
            <section
                ref={showcase2Ref}
                className={`relative z-10 max-w-[1100px] mx-auto px-6 py-[60px] text-left landing-fade-up ${showcase2InView ? "landing-visible" : ""}`}
            >
                <div className="grid grid-cols-[0.85fr_1.15fr] gap-12 items-center max-md:grid-cols-1 max-md:gap-8">
                    <div className="relative rounded-2xl border border-slate-200/90 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.14),0_0_20px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(0,0,0,0.2)] max-md:order-2">
                        {/* Browser Header Bar */}
                        <div className="flex items-center px-4 py-3 bg-[#F4F4F9] border-b border-slate-200/80 gap-3 select-none">
                            {/* Red, Yellow, Green Mac window control dots */}
                            <div className="flex gap-1.5 flex-shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                            </div>
                            {/* Address Bar */}
                            <div className="flex-1 max-w-[260px] mx-auto bg-[#F3F4F6] border border-slate-200/50 py-[3px] px-2.5 rounded-md text-center text-[0.68rem] font-medium text-slate-500 font-mono tracking-wide truncate">
                                blogiary.app/post/mastering-dp
                            </div>
                            {/* Spacing box on the right to match the left dots size for perfect visual balance */}
                            <div className="w-[48px] flex-shrink-0 max-sm:hidden" />
                        </div>
                        {/* Browser Content */}
                        <div className="relative bg-white overflow-hidden">
                            <img
                                src={postDetailsScreenshot}
                                alt="Blog post reading layout"
                                className="w-full h-auto block object-cover border-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center max-md:order-1">
                        <div className="inline-block text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] px-[14px] py-1 rounded-full mb-4 self-start">Reader Experience</div>
                        <h2 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-extrabold text-[var(--color-text-primary)] leading-[1.25] mb-4 tracking-[-0.025em]">
                            A beautiful reading experience for your audience
                        </h2>
                        <p className="text-[0.975rem] text-[var(--color-text-secondary)] leading-[1.75] mb-6">
                            Your words deserve to look great. Blogiary ensures every post is perfectly formatted and easy to read, with built-in tools to help your community connect.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <MdFavorite size={16} />
                                </div>
                                <div className="text-[0.925rem] leading-[1.5] text-[var(--color-text-secondary)] [&>strong]:text-[var(--color-text-primary)] [&>strong]:block [&>strong]:mb-0.5">
                                    <strong>Likes &amp; Bookmarks</strong>
                                   Readers can show their support with a single click and save your articles to read later.
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <MdComment size={16} />
                                </div>
                                <div className="text-[0.925rem] leading-[1.5] text-[var(--color-text-secondary)] [&>strong]:text-[var(--color-text-primary)] [&>strong]:block [&>strong]:mb-0.5">
                                    <strong>Leave Comments</strong>
                                    Build a community by sharing thoughts, answering questions, and replying to comments on your posts.
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                                    <MdSearch size={16} />
                                </div>
                                <div className="text-[0.925rem] leading-[1.5] text-[var(--color-text-secondary)] [&>strong]:text-[var(--color-text-primary)] [&>strong]:block [&>strong]:mb-0.5">
                                    <strong>Tags &amp; Discovery</strong>
                                    Use tags to help new readers find your work, and explore clean writer profiles to discover fresh content.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ④ OTHER FEATURES */}
            <section
                ref={featRef}
                className={`relative z-10 max-w-[1100px] mx-auto px-6 py-20 text-center isolate max-sm:px-5 max-sm:py-[60px] landing-fade-up ${featInView ? "landing-visible" : ""}`}
            >
                {/* Gradient mesh background accent */}
                <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_60%_40%_at_15%_50%,rgba(99,102,241,0.07)_0%,transparent_70%),radial-gradient(ellipse_50%_35%_at_85%_30%,rgba(244,63,94,0.05)_0%,transparent_70%),radial-gradient(ellipse_40%_30%_at_50%_90%,rgba(139,92,246,0.06)_0%,transparent_70%)]" />

                <div className="inline-block text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] px-[14px] py-1 rounded-full mb-4">Platform Core</div>
                <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-[var(--color-text-primary)] leading-[1.2] mb-[14px] tracking-[-0.02em]">Packed with publishing essentials</h2>
                <p className="text-base text-[var(--color-text-secondary)] max-w-[600px] mx-auto mb-14 leading-[1.7]">
                    Everything you need to write and publish, organized into a unified, secure platform.
                </p>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-5 text-left max-sm:grid-cols-1">
                    {features.map((f, i) => (
                        <div
                            key={f.title}
                            className="relative overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-2xl before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:shadow-[0_0_30px_var(--glow)] before:rounded-[18px]"
                            style={{ "--glow": f.glow }}
                        >
                            <div className={`w-[50px] h-[50px] rounded-[14px] flex items-center justify-center text-white mb-[18px] flex-shrink-0 bg-gradient-to-br ${f.gradient}`}>
                                {f.icon}
                            </div>
                            <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2">{f.title}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-[1.7]">{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ⑤ HOW IT WORKS */}
            <section
                ref={stepsRef}
                className={`relative z-10 max-w-[1100px] mx-auto px-6 py-20 text-center isolate max-sm:px-5 max-sm:py-[60px] max-w-full bg-[var(--color-bg-card)] border-y border-[var(--color-border)] [&>*]:max-w-[1100px] [&>*]:mx-auto landing-fade-up ${stepsInView ? "landing-visible" : ""}`}
            >
                <div className="inline-block text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] px-[14px] py-1 rounded-full mb-4">Simple steps</div>
                <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-[var(--color-text-primary)] leading-[1.2] mb-[14px] tracking-[-0.02em]">How it works</h2>
                <p className="text-base text-[var(--color-text-secondary)] max-w-[600px] mx-auto mb-14 leading-[1.7]">
                    You can go from sign-up to your first published post in just a few minutes.
                </p>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-0 relative max-w-[1100px] mx-auto px-6 max-sm:grid-cols-1 max-sm:gap-1">
                    {steps.map((s, i) => (
                        <div key={s.step} className="relative p-[36px_28px] text-center">
                            <div className="text-[3rem] font-black text-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] leading-none mb-3 tracking-[-0.05em]">{s.step}</div>
                            <div className="w-[52px] h-[52px] rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),#8B5CF6)] flex items-center justify-center text-white mx-auto mb-[18px] shadow-[0_4px_20px_rgba(99,102,241,0.3)]">{s.icon}</div>
                            <h3 className="text-[1.05rem] font-bold text-[var(--color-text-primary)] mb-[10px]">{s.title}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-[1.7] max-w-[260px] mx-auto">{s.desc}</p>
                            {i < steps.length - 1 && (
                                <div className="hidden sm:flex absolute top-[56px] right-[-12px] text-[var(--color-primary)] z-[2]">
                                    <MdArrowForward size={16} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ⑥ TECH STACK */}
            <section
                ref={techRef}
                className={`relative z-10 max-w-[1100px] mx-auto px-6 py-20 text-center isolate max-sm:px-5 max-sm:py-[60px] landing-fade-up ${techInView ? "landing-visible" : ""}`}
            >
                <div className="inline-block text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] px-[14px] py-1 rounded-full mb-4">Under the hood</div>
                <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-[var(--color-text-primary)] leading-[1.2] mb-[14px] tracking-[-0.02em]">A fast, modern blogging engine</h2>
                <p className="text-base text-[var(--color-text-secondary)] max-w-[600px] mx-auto mb-14 leading-[1.7]">
                    Blogiary uses a modern, optimized stack to ensure your pages load instantly and render perfectly.
                </p>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[14px] text-left max-sm:grid-cols-2">
                    {techStack.map((t) => (
                        <div key={t.name} className="flex items-center gap-[14px] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[14px] px-[18px] py-4 transition-all duration-200 hover:-translate-y-[3px] hover:border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ color: t.color, background: `${t.color}18` }}>
                                {t.icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[var(--color-text-primary)]">{t.name}</p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ⑦ CTA BANNER */}
            <section
                ref={ctaRef}
                className={`relative z-10 max-w-[1100px] mx-auto px-6 py-20 text-center isolate max-sm:px-5 max-sm:py-[60px] landing-fade-up ${ctaInView ? "landing-visible" : ""}`}
            >
                <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_50%,#9333ea_100%)] px-8 py-14 text-center max-sm:px-6 max-sm:py-[52px]">
                    <div className="relative z-[1]">
                        <div className="inline-flex items-center gap-[6px] text-[0.72rem] font-bold tracking-[0.05em] px-[14px] py-[5px] rounded-full mb-5 text-[rgba(255,255,255,0.95)] bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.25)]">
                            <MdRocketLaunch size={13} />
                            <span>Free to join</span>
                        </div>
                        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black text-white leading-[1.15] mb-4 tracking-[-0.025em]">
                            Start sharing your ideas today
                        </h2>
                        <p className="text-base text-white/80 max-w-[480px] mx-auto mb-9 leading-[1.7]">
                            Create your own space, publish your stories, and grow your audience. No complex setup—just start writing.
                        </p>
                        <div className="flex items-center justify-center gap-[14px] flex-wrap">
                            <Link
                                to={isLoggedIn ? "/create-post" : "/register"}
                                className="inline-flex items-center gap-2 bg-white text-[#6366F1] text-[0.95rem] font-bold px-7 py-[13px] rounded-[14px] transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.22)]"
                                id="landing-cta-footer-primary"
                            >
                                {isLoggedIn ? "Write a Post" : "Create a Free Account"}
                                <MdArrowForward size={17} />
                            </Link>
                            <Link
                                to="/home"
                                className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.88)] bg-[rgba(255,255,255,0.15)] border-[1.5px] border-[rgba(255,255,255,0.35)] text-[0.95rem] font-semibold px-6 py-3 rounded-[14px] transition-all duration-200 backdrop-blur-sm hover:bg-[rgba(255,255,255,0.22)] hover:text-white"
                                id="landing-cta-footer-browse"
                            >
                                Browse Feed
                            </Link>
                        </div>

                        {/* Compact screenshot preview inside CTA */}
                        <div className="mt-9 max-w-[600px] mx-auto rounded-2xl border border-slate-200 bg-white shadow-[0_35px_80px_rgba(0,0,0,0.28)] overflow-hidden">
                            {/* Browser Header Bar */}
                            <div className="flex items-center px-4 py-2.5 bg-[#F4F4F9] border-b border-slate-200 gap-3 select-none">
                                {/* Red, Yellow, Green Mac window control dots */}
                                <div className="flex gap-1.5 flex-shrink-0">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                                </div>
                                {/* Address Bar */}
                                <div className="flex-1 max-w-[200px] mx-auto bg-[#F3F4F6] border border-slate-200/50 py-[3px] px-2 rounded text-center text-[0.6rem] font-medium text-slate-500 font-mono tracking-wide truncate">
                                    blogiary.app/home
                                </div>
                                {/* Spacing box on the right to match the left dots size for perfect visual balance */}
                                <div className="w-[48px] flex-shrink-0 max-sm:hidden" />
                            </div>
                            {/* Browser Content */}
                            <div className="relative bg-white overflow-hidden">
                                <img
                                    src={dashboardFeedScreenshot}
                                    alt="Blogiary interface preview"
                                    className="w-full h-auto block object-cover border-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
