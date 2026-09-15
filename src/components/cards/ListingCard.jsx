import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { MessageCircle, Eye, MapPin, Heart } from 'lucide-react';

const colors = ["#f7d59a", "#f4b8c0", "#c9b5e8", "#c9dfbd", "#f1b986", "#bda7e6", "#dcd5fa", "#cfeee8"];

export default function ListingCard({
  id,
  title,
  price,
  location,
  status,
  image,
  label,
  index = 0,
  onChat
}) {
  const { isSaved, toggleWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);
  const saved = isSaved(id || title);

  const formattedPrice = typeof price === 'number' ? `₹${price}` : price;
  const mediaBg = colors[index % colors.length];

  return (
    <article className="listing-card" data-name={(title || '').toLowerCase()}>
      <div className="listing-media" style={{ background: mediaBg }}>
        {status && <span className="status-badge">{status}</span>}
        <button
          className={`wishlist-btn ${saved ? 'is-saved' : ''}`}
          type="button"
          onClick={() => toggleWishlist(id || title)}
          aria-label={`Save ${title}`}
          aria-pressed={saved}
        >
          {saved ? '♥' : '♡'}
        </button>

        {image && !imgError ? (
          <img
            src={image}
            alt={title}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="illustration" style={{ background: mediaBg }}>
            {label || title}
          </div>
        )}

        <div className="listing-meta">
          <span className="meta-pill">{8 + index} views</span>
          <span className="meta-pill">{(index % 4) + 1} chats</span>
        </div>
      </div>

      <div className="listing-info">
        <h3 className="listing-name">{title}</h3>
        <div className="listing-price">{formattedPrice}</div>
        <div className="listing-location">{location}</div>
        <button
          className="chat-btn"
          type="button"
          onClick={() => onChat?.(title)}
          aria-label={`Chat about ${title}`}
        >
          Chat
        </button>
      </div>
    </article>
  );
}
