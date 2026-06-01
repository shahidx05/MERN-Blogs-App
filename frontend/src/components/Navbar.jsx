import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import {
  MdHome, MdAdd, MdPerson, MdLogout, MdLogin,
  MdAppRegistration, MdLightMode, MdDarkMode,
  MdMenu, MdClose, MdSearch, MdInfo,
} from "react-icons/md";
import { searchUsers } from "../services/api";
import Logo from "../components/Logo";

// SearchBar defined OUTSIDE Navbar so React does not recreate it on every render
const SearchBar = ({
  mobile = false,
  searchRef,
  searchMode,
  q,
  setQ,
  handleSearch,
  handleModeChange,
  peopleResults,
  showDropdown,
  searchLoading,
  setShowDropdown,
}) => (
  <div
    ref={mobile ? null : searchRef}
    className={`relative ${mobile ? "w-full" : "flex-1 max-w-lg"}`}
  >
    <div className="flex items-center gap-2">
      {/* Mode toggle pills */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {["posts", "people"].map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-150 capitalize border border-[var(--color-border)] ${searchMode === mode
                ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                : "bg-[var(--color-bg-input)] text-[var(--color-text-muted)]"
              }`}
          >
            {mode === "posts" ? "Posts" : "People"}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative flex-1">
        <MdSearch
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]"
        />
        <input
          type="text"
          placeholder={searchMode === "people" ? "Search people..." : "Search articles..."}
          className="input-field pl-9 py-1.5 text-sm w-full"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleSearch}
          onFocus={() => {
            if (searchMode === "people" && peopleResults.length > 0) setShowDropdown(true);
          }}
        />
      </div>
    </div>

    {/* People results dropdown */}
    {searchMode === "people" && showDropdown && (
      <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-[var(--shadow-dropdown)]">
        {searchLoading ? (
          <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
            Searching...
          </div>
        ) : peopleResults.length === 0 ? (
          <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
            No users found
          </div>
        ) : (
          peopleResults.slice(0, 6).map((u) => (
            <Link
              key={u._id}
              to={`/user/${u.username}`}
              onClick={() => { setShowDropdown(false); setQ(""); }}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-hover)]"
            >
              <img
                src={u.profile_img}
                alt={u.username}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-[var(--color-text-primary)]">
                  {u.name}
                </p>
                <p className="text-xs truncate text-[var(--color-text-muted)]">
                  @{u.username}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    )}
  </div>
);

const Navbar = () => {
  const { isLoggedIn, Logout, user } = useAuth();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [searchMode, setSearchMode] = useState("posts");
  const [peopleResults, setPeopleResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setDark(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchMode !== "people" || !q.trim()) {
      setPeopleResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const data = await searchUsers(q.trim());
        setPeopleResults(data.users || []);
        setShowDropdown(true);
      } catch {
        setPeopleResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [q, searchMode]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!q.trim()) return;
      if (searchMode === "posts") {
        navigate(`/home?q=${q}`);
        setShowDropdown(false);
      }
    }
  };

  const handleModeChange = (mode) => {
    setSearchMode(mode);
    setQ("");
    setPeopleResults([]);
    setShowDropdown(false);
  };

  const searchBarProps = {
    searchRef,
    searchMode,
    q,
    setQ,
    handleSearch,
    handleModeChange,
    peopleResults,
    showDropdown,
    searchLoading,
    setShowDropdown,
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-[var(--color-nav-bg)] border-[var(--color-nav-border)] shadow-[var(--shadow-card)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Logo />

        {/* Search bar (desktop) */}
        <div className="hidden md:block flex-1 max-w-lg" ref={searchRef}>
          <SearchBar {...searchBarProps} />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5">

          <NavLink to="/home" className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
            <MdHome size={18} /> Home
          </NavLink>

          <NavLink to="/about" className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
            <MdInfo size={18} /> About
          </NavLink>

          {isLoggedIn && user ? (
            <>
              <NavLink to="/create-post" className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
                <MdAdd size={18} /> Create
              </NavLink>

              <NavLink to="/profile" className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
                <MdPerson size={18} /> Profile
              </NavLink>

              <span className="h-5 w-px bg-[var(--color-border)]" />

              <button onClick={toggleDark} className="p-1.5 rounded-lg transition-colors cursor-pointer text-[var(--color-text-muted)] hover:bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]" title="Toggle theme">
                {dark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
              </button>

              <button
                onClick={() => { Logout(); navigate("/login"); }}
                className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] -mx-3"
              >
                <MdLogout size={16} /> Logout
              </button>

              <NavLink to="/profile">
                <img
                  src={user.profile_img}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-primary)] cursor-pointer"
                />
              </NavLink>
            </>
          ) : (
            <>
              <button onClick={toggleDark} className="p-1.5 rounded-lg transition-colors cursor-pointer text-[var(--color-text-muted)] hover:bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]" title="Toggle theme">
                {dark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
              </button>

              <NavLink to="/login" className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
                <MdLogin size={18} /> Login
              </NavLink>

              <NavLink to="/register">
                <span className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
                  Register
                </span>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile: right side */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggleDark} className="p-1.5 rounded-lg transition-colors cursor-pointer text-[var(--color-text-muted)] hover:bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]">
            {dark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
          </button>

          {isLoggedIn && user && (
            <NavLink to="/profile">
              <img
                src={user.profile_img}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-[var(--color-primary)]"
              />
            </NavLink>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer text-[var(--color-text-muted)] hover:bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] -m-1.5"
          >
            {menuOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search bar */}
      <div className="md:hidden px-4 py-2 border-t border-[var(--color-nav-border)] bg-[var(--color-nav-bg)]">
        <SearchBar {...searchBarProps} mobile />
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 bg-[var(--color-nav-bg)] border-[var(--color-nav-border)]">
          <NavLink to="/home" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
            <MdHome size={18} /> Home
          </NavLink>

          <NavLink to="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
            <MdInfo size={18} /> About
          </NavLink>

          {isLoggedIn && user ? (
            <>
              <NavLink to="/create-post" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
                <MdAdd size={18} /> Create
              </NavLink>

              <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
                <MdPerson size={18} /> Profile
              </NavLink>

              <div className="h-px bg-[var(--color-border)]" />

              <button
                onClick={() => { Logout(); navigate("/login"); setMenuOpen(false); }}
                className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] -mx-3"
              >
                <MdLogout size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
                <MdLogin size={18} /> Login
              </NavLink>

              <NavLink to="/register" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-1.5 rounded-lg text-[var(--color-nav-text)] hover:text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] aria-[current=page]:text-[var(--color-nav-active)] -mx-3">
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