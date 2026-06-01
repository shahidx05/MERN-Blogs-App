import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from "react-router-dom";
import { MdPerson, MdAlternateEmail, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdErrorOutline } from "react-icons/md";

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { Register } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await Register(name, username, email, password);
      if (res?.token) {
        navigate("/profile");
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      if (err.status === 429) {
        setError('Registration failed. Please check your credentials.');
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong. Please try again.';
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
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Create account</h2>
          <p className="text-sm mt-1 text-[var(--color-text-muted)]">Join Blogiary and start sharing your stories</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg mb-5 error-surface">
            <MdErrorOutline size={16} />
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={submitHandler}>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Full Name</label>
            <div className="relative">
              <MdPerson size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
              <input type="text" placeholder="Your full name" className="input-field pl-9" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Username</label>
            <div className="relative">
              <MdAlternateEmail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
              <input type="text" placeholder="your_username" className="input-field pl-9" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
            <div className="relative">
              <MdEmail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
              <input type="email" placeholder="you@example.com" className="input-field pl-9" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
            <div className="relative">
              <MdLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className="input-field pl-9 pr-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline text-[var(--color-primary)]">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;