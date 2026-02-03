import { Link, NavLink, useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, Logout, user } = useAuth();
  const navigate = useNavigate()

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold">
            Blogs
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${isActive ? "text-blue-900" : "text-gray-600"} 
               hover:text-black font-semibold`
            }
          >
            Home
          </NavLink>

          {isLoggedIn && user ? (
            <>
              <NavLink
                to="/create-post"
                className={({ isActive }) =>
                  `${isActive ? "text-blue-900" : "text-gray-600"} 
                   hover:text-black font-semibold`
                }
              >
                Create
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${isActive ? "text-blue-900" : "text-gray-600"} 
                   hover:text-black font-semibold`
                }
              >
                Profile
              </NavLink>

              {/* Divider */}
              <span className="h-6 w-px bg-gray-300" />

              {/* Logout Button (UI only) */}
              <button className="text-sm text-red-600 font-semibold hover:underline"
                onClick={() => {
                  Logout()
                  navigate("/login")
                }}
              >
                Logout
              </button>

              {/* Avatar */}
              <img
                src={user.profile_img}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border cursor-pointer"
              />
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${isActive ? "text-blue-900" : "text-gray-600"} 
                   hover:text-black font-semibold`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${isActive ? "text-blue-900" : "text-gray-600"} 
                   hover:text-black font-semibold`
                }
              >
                Register
              </NavLink>
            </>
          )}


        </div>
      </div>
    </nav>
  );
};

export default Navbar;
