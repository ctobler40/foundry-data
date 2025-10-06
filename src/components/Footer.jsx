import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <Link to="/" className="link-blue">
          ← Back to Home
        </Link>
        <p>© {new Date().getFullYear()} Wrath & Glory Foundry Data</p>
      </div>
    </footer>
  );
}

export default Footer;
