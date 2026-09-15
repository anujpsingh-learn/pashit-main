import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar() {
  const { user, profile } = useAuth();
  const { wishCount } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationText, setLocationText] = useState('Enable location');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/listings');
    }
  }

  function handleLocation() {
    if (!navigator.geolocation) {
      setLocationText('Location unavailable');
      return;
    }
    setLocationText('Detecting...');
    navigator.geolocation.getCurrentPosition(
      () => setLocationText('Current location'),
      () => setLocationText('Enable location')
    );
  }

  const displayName = profile?.full_name || user?.email || '';
  const initials = displayName
    ? displayName
        .trim()
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="site-header">
      <div className="header-shell">
        <Link className="header-brand" to="/" aria-label="PASH.IT home">
          <span className="brand-mark">P</span>
          <span>PASH.IT</span>
        </Link>

        <button className="location-btn" type="button" onClick={handleLocation}>
          <span aria-hidden="true">LOC</span>
          <strong>{locationText}</strong>
        </button>

        <form className="search-form" onSubmit={handleSearch} role="search">
          <input
            type="search"
            placeholder="Search books, bikes, lamps..."
            aria-label="Search products"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">Search</button>
        </form>

        <nav className="header-actions" aria-label="Account actions">
          <Link to="/listings">Orders & Products</Link>
          <Link to="/sell" className="sell-nav-btn">+ Sell</Link>
          <Link to="/wishlist">
            Wishlists <span id="wishCount">{wishCount}</span>
          </Link>
          {user ? (
            <Link
              to="/profile"
              id="authLink"
              title={displayName}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                flexShrink: 0,
                width: '36px',
                height: '36px',
                minWidth: '36px',
                minHeight: '36px',
                borderRadius: '50%',
                background: '#5c0a1f',
                color: '#fff',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                initials
              )}
            </Link>
          ) : (
            <Link to="/login" id="authLink">
              Login / Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
