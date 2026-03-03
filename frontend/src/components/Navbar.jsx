import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { MdHome, MdAdd, MdPerson, MdLogout, MdLogin, MdAppRegistration, MdLightMode, MdDarkMode, MdMenu, MdClose } from "react-icons/md";

const Navbar = () => {
  const { isLoggedIn, Logout, user } = useAuth();
  const navigate = useNavigate();

  // ── Mobile menu ──
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 ${
      isActive ? '' : ''
    }`;

  const navLinkStyle = (isActive) => ({
    color: isActive ? 'var(--color-nav-active)' : 'var(--color-nav-text)',
  });

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--color-nav-bg)',
        borderColor: 'var(--color-nav-border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight"
          style={{ color: 'var(--color-primary)' }}
        >
          Blogs
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-5">

          <NavLink to="/" className={navLinkClass} style={({ isActive }) => navLinkStyle(isActive)}>
            <MdHome size={18} /> Home
          </NavLink>

          {isLoggedIn && user ? (
            <>
              <NavLink to="/create-post" className={navLinkClass} style={({ isActive }) => navLinkStyle(isActive)}>
                <MdAdd size={18} /> Create
              </NavLink>

              <NavLink to="/profile" className={navLinkClass} style={({ isActive }) => navLinkStyle(isActive)}>
                <MdPerson size={18} /> Profile
              </NavLink>

              {/* Divider */}
              <span className="h-5 w-px" style={{ backgroundColor: 'var(--color-border)' }} />

              {/* Dark mode toggle */}
              <button
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                title="Toggle theme"
              >
                {/* {dark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />} */}
              </button>

              {/* Logout */}
              <button
                onClick={() => { Logout(); navigate("/login"); }}
                className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: 'var(--color-error)' }}
              >
                <MdLogout size={16} /> Logout
              </button>

              {/* Avatar */}
              <NavLink to="/profile">
                <img
                  src={user.profile_img}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 cursor-pointer"
                  style={{ borderColor: 'var(--color-primary)' }}
                />
              </NavLink>
            </>
          ) : (
            <>
              {/* Dark mode toggle */}
              <button
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                title="Toggle theme"
              >
              </button>

              <NavLink to="/login" className={navLinkClass} style={({ isActive }) => navLinkStyle(isActive)}>
                <MdLogin size={18} /> Login
              </NavLink>

              <NavLink to="/register">
                <span
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-inverse)',
                  }}
                >
                  Register
                </span>
              </NavLink>
            </>
          )}
        </div>

        {/* ── Mobile: right side ── */}
        <div className="flex md:hidden items-center gap-3">
          <button
            className="p-1.5 rounded-lg"
            style={{ color: 'var(--color-text-muted)' }}
          >
          </button>

          {isLoggedIn && user && (
            <img
              src={user.profile_img}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border-2"
              style={{ borderColor: 'var(--color-primary)' }}
            />
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--color-nav-text)' }}
          >
            {menuOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-3"
          style={{
            backgroundColor: 'var(--color-nav-bg)',
            borderColor: 'var(--color-nav-border)',
          }}
        >
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-sm font-medium py-1"
            style={({ isActive }) => navLinkStyle(isActive)}
          >
            <MdHome size={18} /> Home
          </NavLink>

          {isLoggedIn && user ? (
            <>
              <NavLink
                to="/create-post"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium py-1"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                <MdAdd size={18} /> Create
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium py-1"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                <MdPerson size={18} /> Profile
              </NavLink>

              <div className="h-px" style={{ backgroundColor: 'var(--color-border)' }} />

              <button
                onClick={() => { Logout(); navigate("/login"); setMenuOpen(false); }}
                className="flex items-center gap-2 text-sm font-medium py-1"
                style={{ color: 'var(--color-error)' }}
              >
                <MdLogout size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium py-1"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                <MdLogin size={18} /> Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium py-1"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                <MdAppRegistration size={18} /> Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;