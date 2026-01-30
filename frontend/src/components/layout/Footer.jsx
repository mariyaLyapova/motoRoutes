export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MotoRoutes</h3>
            <p>Share and discover amazing motorcycle routes around the world.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/routes">Browse Routes</a></li>
              <li><a href="/locations">Locations</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li><a href="/help">Help</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/terms">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} MotoRoutes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
