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
                // If your API returns success=false or similar
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            // Works if your Login() in AuthContext rethrows the error
            // Make sure your AuthContext does: throw error  (see note below)
            const msg =
                err?.response?.data?.message ||  // axios error
                err?.message ||                   // generic error
                'Invalid email or password.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            <div
                className="w-full max-w-md rounded-2xl p-8 border"
                style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderColor: 'var(--color-border)',
                    boxShadow: 'var(--shadow-card)',
                }}
            >
                {/* Header */}
                <div className="mb-7">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        Sign in
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        Welcome back to your blog
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg mb-5"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-error) 10%, transparent)',
                            color: 'var(--color-error)',
                            border: '1px solid color-mix(in srgb, var(--color-error) 25%, transparent)',
                        }}
                    >
                        <MdErrorOutline size={16} />
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-4" onSubmit={submitHandler}>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            Email
                        </label>
                        <div className="relative">
                            <MdEmail
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ color: 'var(--color-text-muted)' }}
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
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <MdLock
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ color: 'var(--color-text-muted)' }}
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
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {showPassword
                                    ? <MdVisibilityOff size={16} />
                                    : <MdVisibility size={16} />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg font-semibold text-sm mt-1"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-text-inverse)',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-sm text-center mt-6" style={{ color: 'var(--color-text-secondary)' }}>
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-semibold hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;