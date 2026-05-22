import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [query, setQuery] = useState("");
  const [showTabletop, setShowTabletop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "=") {
        setShowTabletop(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "=") {
        setShowTabletop(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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

        <Link to="/timeline/map" className="navbar-subtitle">
          Timeline
        </Link>

        <Link to="/character-builds" className="navbar-subtitle">
          Character Builds
        </Link>

        {showTabletop && (
          <Link to="/tabletop" className="navbar-subtitle">
            Tabletop
          </Link>
        )}

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