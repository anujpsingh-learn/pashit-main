import React from 'react';

export default function TeamCard({ name, role, avatar, initials, color }) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <article className="team-card" style={{ background: color }}>
      <div className="avatar">
        {avatar && !imgError ? (
          <img
            src={avatar}
            alt={name}
            onError={() => setImgError(true)}
          />
        ) : (
          initials
        )}
      </div>
      <h3 className="member-name">{name}</h3>
      <p className="member-role">{role}</p>
      <div className="social-row">
        <a href="#" aria-label={`${name} X`}>X</a>
        <a href="#" aria-label={`${name} LinkedIn`}>in</a>
      </div>
    </article>
  );
}
