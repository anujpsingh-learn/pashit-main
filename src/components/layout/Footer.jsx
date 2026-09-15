import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-panel">
        <div className="footer-top">
          <div>
            <div className="footer-kicker">Built for campus</div>
            <p>
              Buy, sell, and swap with verified students. No outsiders, no middleman, just useful
              things finding new homes.
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/listings">Listings</Link>
            <Link to="/#categories">Categories</Link>
            <Link to="/sell">Sell an item</Link>
            <Link to="/#faq">FAQs</Link>
            <Link to="/#about">About us</Link>
            <a href="mailto:hello@pash.it">Contact</a>
          </nav>
        </div>
        <div className="footer-brand">PASH.IT</div>
        <div className="footer-bottom">
          <p>© 2026 PASH.IT. By students, for students.</p>
          <p>
            <a href="#privacy">Privacy</a> · <a href="#terms">Terms</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
