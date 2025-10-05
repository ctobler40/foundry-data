import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-title">
          Wrath & Glory Database
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
