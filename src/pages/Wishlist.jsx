import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { supabase } from '../lib/supabase';
import ListingCard from '../components/cards/ListingCard';

export default function Wishlist() {
  const { user } = useAuth();
  const { savedIds } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      setLoading(true);
      if (savedIds.size === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      try {
        const idList = Array.from(savedIds);
        const { data, error } = await supabase
          .from('listings')
          .select(`
            id,
            title,
            description,
            price,
            images,
            status,
            profiles!listings_seller_id_fkey(full_name, hostel),
            categories(name)
          `)
          .in('id', idList)
          .eq('status', 'active');

        if (!error && data) {
          setWishlistItems(data);
        }
      } catch (err) {
        console.error('Failed to load wishlist items:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlist();
  }, [savedIds]);

  return (
    <main className="wishlist-page section-pad">
      <div className="listings-inner">
        <header className="listings-header">
          <div>
            <h1 className="listings-title">Your Wishlist</h1>
            <span className="new-items-pill">
              {savedIds.size} saved {savedIds.size === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="listings-actions">
            <Link to="/listings" className="view-all">Browse all listings -&gt;</Link>
          </div>
        </header>

        {loading ? (
          <p className="loading-state">Loading your saved listings...</p>
        ) : wishlistItems.length > 0 ? (
          <div className="listings-grid">
            {wishlistItems.map((item, idx) => (
              <ListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                location={item.profiles?.hostel || 'LPU Campus'}
                status={item.categories?.name || 'Saved'}
                image={item.images?.[0]}
                label={item.title}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow)', maxWidth: '600px', margin: '40px auto' }}>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '2.2rem', marginBottom: '12px' }}>
              Your wishlist is empty
            </h2>
            <p style={{ color: 'rgba(20, 0, 31, 0.7)', marginBottom: '24px' }}>
              Tap the heart icon on any product card to save deals and keep track of items you want.
            </p>
            <Link to="/listings" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Explore Listings -&gt;
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
