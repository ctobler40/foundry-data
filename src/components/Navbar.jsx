import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-title">
          Wrath & Glory Database
        </Link>

        <Link to="/campaign" className="navbar-subtitle">
          Chalnath Expanse
        </Link>

        <Link to="/archives" className="navbar-subtitle">
          Archives
        </Link>

        <form onSubmit={handleSearch} className="navbar-search">
          <input
            type="text"
            placeholder="Search Keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="navbar-search-input"
          />
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
