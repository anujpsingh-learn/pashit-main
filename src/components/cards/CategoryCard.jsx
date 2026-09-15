import React from 'react';
import { Link } from 'react-router-dom';

const colors = ["#f7d59a", "#f4b8c0", "#c9b5e8", "#c9dfbd", "#f1b986", "#bda7e6", "#dcd5fa", "#cfeee8"];

export default function CategoryCard({ name, description, label, size, index }) {
  const bgColor = colors[(index + 3) % colors.length];

  return (
    <article className={`category-card ${size || ''}`} style={{ background: bgColor }}>
      <h3 className="category-name">{name}</h3>
      <p className="category-description">{description}</p>
      <Link className="category-btn" to={`/listings?category=${encodeURIComponent(name)}`}>
        Explore -&gt;
      </Link>
      <div className="illustration" style={{ background: colors[(index + 2) % colors.length] }}>
        {label}
      </div>
    </article>
  );
}
