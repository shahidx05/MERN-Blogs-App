import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
    const year = new Date().getFullYear();

    const socials = [
        {
            label: "GitHub",
            href: "https://github.com/shahidx05",
            icon: <FaGithub size={17} />,
        },
        {
            label: "LinkedIn",
            href: "https://linkedin.com/in/shahidx05",
            icon: <FaLinkedin size={17} />,
        },
        {
            label: "X",
            href: "https://x.com/shahidx_05",
            icon: <FaXTwitter size={17} />,
        },
    ];

    return (
        <footer
            className="w-full border-t mt-auto"
            style={{
                backgroundColor: 'var(--color-nav-bg)',
                borderColor: 'var(--color-border)',
            }}
        >
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                    {/* Left — branding */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="text-base font-bold tracking-tight"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Blogs App
                        </Link>
                        <span
                            className="h-4 w-px hidden sm:block"
                            style={{ backgroundColor: 'var(--color-border)' }}
                        />
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Built by{' '}
                            <a
                                href="https://github.com/your-username"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline"
                                style={{ color: 'var(--color-text-secondary)' }}
                            >
                                Shahid Khan
                            </a>
                        </span>
                    </div>

                    {/* Right — socials + repo */}
                    <div className="flex items-center gap-1.5">

                        {socials.map(s => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={s.label}
                                className="p-2 rounded-lg transition-opacity hover:opacity-70"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {s.icon}
                            </a>
                        ))}

                        <span
                            className="h-4 w-px mx-1"
                            style={{ backgroundColor: 'var(--color-border)' }}
                        />

                        {/* Repo link */}
                        <a
                            href="https://github.com/shahidx05/MERN-Blogs-App"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-opacity hover:opacity-75"
                            style={{
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text-secondary)',
                                backgroundColor: 'var(--color-bg-input)',
                            }}
                        >
                            <FaGithub size={13} />
                            View Source
                        </a>
                    </div>

                </div>

                {/* Bottom */}
                <div
                    className="mt-4 pt-4 border-t text-center"
                    style={{ borderColor: 'var(--color-border)' }}
                >
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        © {year} Blog App. Made with ❤️ using React, Node.js & MongoDB.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;