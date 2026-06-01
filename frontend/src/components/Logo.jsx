import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Logo = ({ size = 40 }) => (
  <Link to="/" className="flex items-center gap-2">
    <img src={logo} alt="Blogiary" style={{ width: size, height: size }} className="object-contain" />
    <span className="text-2xl font-bold text-[var(--color-primary)]">
      Blogiary
    </span>
  </Link>
);

export default Logo;
