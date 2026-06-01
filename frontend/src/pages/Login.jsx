import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdErrorOutline } from "react-icons/md";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { Login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    if (isLoggedIn) return <Navigate to="/profile" replace />;

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await Login(email, password);
            if (data?.token) {
                navigate('/profile');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            if (err.status === 429) {
                setError('Login failed. Please check your credentials.');
            } else {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Invalid email or password.';
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg)]">
            <div className="w-full max-w-md rounded-2xl p-8 border bg-[var(--color-bg-card)] border-[var(--color-border)] shadow-[var(--shadow-card)]">

                {/* Header */}
                <div className="mb-7">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Sign in</h2>
                    <p className="text-sm mt-1 text-[var(--color-text-muted)]">Welcome back to Blogiary</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg mb-5 error-surface">
                        <MdErrorOutline size={16} />
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-4" onSubmit={submitHandler}>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
                        <div className="relative">
                            <MdEmail
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]"
                            />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="input-field pl-9"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
                        <div className="relative">
                            <MdLock
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]"
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="input-field pl-9 pr-9"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                            >
                                {showPassword ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-2.5 justify-center text-sm mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-sm text-center mt-6 text-[var(--color-text-secondary)]">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold hover:underline text-[var(--color-primary)]">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;