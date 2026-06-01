import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { MdRssFeed } from "react-icons/md";
import Logo from "../components/Logo";

const Footer = () => {
    const year = new Date().getFullYear();

    const navLinks = [
        { label: "Home", to: "/home" },
        { label: "About", to: "/about" },
        { label: "Create Post", to: "/create-post" },
        { label: "Login", to: "/login" },
        { label: "Register", to: "/register" },
    ];

    const socials = [
        {
            label: "GitHub",
            href: "https://github.com/shahidx05",
            icon: <FaGithub size={18} />,
        },
        {
            label: "LinkedIn",
            href: "https://linkedin.com/in/shahidx05",
            icon: <FaLinkedin size={18} />,
        },
        {
            label: "X",
            href: "https://x.com/shahidx_05",
            icon: <FaXTwitter size={18} />,
        },
    ];

    return (
        <footer className="w-full border-t mt-auto bg-[var(--color-nav-bg)] border-[var(--color-border)]">
            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Main row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

                    {/* Left — Branding */}
                    <div className="space-y-3">
                        <Logo size={48} />
                        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                            Write, share, and discover stories. A modern blogging platform with AI-powered writing assistance.
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                            <MdRssFeed size={14} />
                            <span>Built by{" "}
                                <a
                                    href="https://github.com/shahidx05"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                >
                                    Shahid Khan
                                </a>
                            </span>
                        </div>
                    </div>

                    {/* Center — Navigation */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                            Navigation
                        </p>
                        <ul className="space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm transition-colors hover:underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right — Socials */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                            Connect
                        </p>
                        <div className="flex flex-col gap-3">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 text-sm transition-colors hover:text-[var(--color-primary)] text-[var(--color-text-secondary)]"
                                >
                                    {s.icon}
                                    {s.label}
                                </a>
                            ))}

                            <a
                                href="https://github.com/shahidx05/blogiary"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border w-fit transition-opacity hover:opacity-75 border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-bg-input)]"
                            >
                                <FaGithub size={13} />
                                View Source
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-[var(--color-text-muted)]">
                        &copy; {year} Blogiary. All rights reserved.
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Built with React, Node.js &amp; MongoDB
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;