import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Camera, LogOut, Edit3, Check, X, Package } from 'lucide-react';
import ListingCard from '../components/cards/ListingCard';

export default function Profile() {
  const { user, profile, refreshProfile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [hostelInput, setHostelInput] = useState('');
  const [userListings, setUserListings] = useState([]);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setNameInput(profile.full_name || '');
      setHostelInput(profile.hostel || '');
    }
  }, [profile]);

  useEffect(() => {
    async function loadUserListings() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*, categories(name)')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) setUserListings(data);
      } catch (err) {
        console.error('Error loading user listings:', err);
      }
    }

    loadUserListings();
  }, [user]);

  function showStatus(msg) {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3500);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!nameInput.trim() || !hostelInput.trim()) {
      showStatus('Please provide your name and hostel block.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: nameInput.trim(),
          hostel: hostelInput.trim()
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      showStatus('Profile updated successfully!');
    } catch (err) {
      showStatus(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(file, column) {
    if (!file || !file.type.startsWith('image/')) {
      showStatus('Please upload an image file (PNG/JPG).');
      return;
    }

    try {
      const path = `${user.id}/${column}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(path);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [column]: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      showStatus(column === 'avatar_url' ? 'Profile picture updated!' : 'Banner updated!');
    } catch (err) {
      showStatus(err.message || 'Image upload failed.');
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  if (authLoading) {
    return <main className="section-pad"><p className="loading-state">Loading your profile...</p></main>;
  }

  if (!user) {
    return (
      <main className="section-pad" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '2rem', marginBottom: '12px' }}>
            Login required
          </h2>
          <p style={{ color: 'rgba(20, 0, 31, 0.7)', marginBottom: '24px' }}>
            Please log in to view and manage your student profile and listings.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Login / Sign Up
          </Link>
        </div>
      </main>
    );
  }

  const name = profile?.full_name || 'LPU Student';
  const initials = name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="profile-page section-pad">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {statusMsg && (
          <div style={{ background: '#e8f8d8', color: '#2b8a3e', padding: '12px 20px', borderRadius: '14px', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>
            {statusMsg}
          </div>
        )}

        {/* Profile Card Header */}
        <div style={{ background: 'white', borderRadius: '28px', overflow: 'hidden', boxShadow: 'var(--shadow)', marginBottom: '36px' }}>
          {/* Banner */}
          <div
            style={{
              position: 'relative',
              height: '180px',
              background: profile?.banner_url
                ? `url(${profile.banner_url}) center/cover no-repeat`
                : 'linear-gradient(135deg, #c9b5e8 0%, #f4b8c0 100%)'
            }}
          >
            <label
              htmlFor="banner-upload"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                padding: '8px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Camera size={14} /> Change Banner
            </label>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => handleImageUpload(e.target.files[0], 'banner_url')}
            />
          </div>

          {/* User Details */}
          <div style={{ padding: '0 32px 32px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginTop: '-50px', marginBottom: '20px' }}>
              {/* Avatar */}
              <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', border: '5px solid white', background: '#f7d59a', display: 'grid', placeItems: 'center', boxShadow: '0 8px 18px rgba(0,0,0,0.1)' }}>
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '2.2rem', color: '#180022' }}>{initials}</span>
                )}
                <label
                  htmlFor="avatar-upload"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    background: '#8d66e8',
                    color: 'white',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  <Camera size={15} />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleImageUpload(e.target.files[0], 'avatar_url')}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="listing-nav"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '44px', padding: '0 18px' }}
                  >
                    <Edit3 size={15} /> Edit Profile
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="listing-nav"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '44px', padding: '0 18px', color: '#d42d70' }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>

            {/* Profile Info / Form */}
            {!isEditing ? (
              <div>
                <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '2.4rem', margin: '0 0 4px' }}>{name}</h1>
                <p style={{ color: 'rgba(20,0,31,0.6)', fontWeight: '700', margin: '0 0 16px' }}>{profile?.email || user.email}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '16px' }}>
                  <div style={{ background: '#fffdf8', border: '2px solid #f1f3f5', padding: '14px 18px', borderRadius: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#868e96', textTransform: 'uppercase' }}>Registration No.</span>
                    <p style={{ fontWeight: '900', fontSize: '1.1rem', margin: '4px 0 0' }}>{profile?.reg_no || '—'}</p>
                  </div>
                  <div style={{ background: '#fffdf8', border: '2px solid #f1f3f5', padding: '14px 18px', borderRadius: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#868e96', textTransform: 'uppercase' }}>Hostel / Block</span>
                    <p style={{ fontWeight: '900', fontSize: '1.1rem', margin: '4px 0 0' }}>{profile?.hostel || '—'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'grid', gap: '14px', marginTop: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Full Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #dee2e6', fontWeight: '700' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Hostel / Room / Block</label>
                  <input
                    type="text"
                    value={hostelInput}
                    onChange={e => setHostelInput(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #dee2e6', fontWeight: '700' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ height: '44px', minWidth: '120px' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="listing-nav" style={{ height: '44px', padding: '0 20px' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* User Listings Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.8rem', margin: 0 }}>Your Listed Items ({userListings.length})</h2>
            <Link to="/sell" className="btn btn-primary" style={{ height: '40px', minWidth: '110px', fontSize: '0.85rem' }}>+ Post New</Link>
          </div>

          {userListings.length > 0 ? (
            <div className="listings-grid">
              {userListings.map((item, idx) => (
                <ListingCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  location={profile?.hostel || 'Your listing'}
                  status={item.status}
                  image={item.images?.[0]}
                  label={item.title}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow)' }}>
              <Package size={40} color="#adb5bd" style={{ marginBottom: '10px' }} />
              <p style={{ fontWeight: '800', color: 'rgba(20,0,31,0.6)' }}>You haven't posted any listings yet.</p>
              <Link to="/sell" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '12px' }}>
                Sell your first item
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
