import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ListingCard from '../components/cards/ListingCard';

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('category') || '';

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [listingsRes, categoriesRes] = await Promise.all([
          supabase
            .from('listings')
            .select(`
              id,
              title,
              description,
              price,
              images,
              created_at,
              status,
              profiles!listings_seller_id_fkey (full_name, hostel),
              categories (id, name)
            `)
            .eq('status', 'active')
            .order('created_at', { ascending: false }),
          supabase.from('categories').select('id, name').order('name')
        ]);

        if (listingsRes.data) setListings(listingsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Failed to load listings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const filteredListings = listings.filter(item => {
    const title = item.title?.toLowerCase() || '';
    const desc = item.description?.toLowerCase() || '';
    const hostel = item.profiles?.hostel?.toLowerCase() || '';
    const catName = item.categories?.name || '';
    const q = searchQuery.toLowerCase().trim();

    const matchesQuery = !q || title.includes(q) || desc.includes(q) || hostel.includes(q) || catName.toLowerCase().includes(q);
    const matchesCat = !selectedCategory || catName.toLowerCase() === selectedCategory.toLowerCase();

    return matchesQuery && matchesCat;
  });

  return (
    <main className="listings-page section-pad">
      <div className="listings-inner">
        <header className="listings-header">
          <div>
            <h1 className="listings-title">All Listings</h1>
            <span className="new-items-pill">
              {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'} available
            </span>
          </div>
          <div className="listings-actions">
            <Link to="/sell" className="btn btn-primary" style={{ height: '42px', minWidth: '120px', fontSize: '0.9rem' }}>
              + Sell Item
            </Link>
            {(searchQuery || selectedCategory) && (
              <button
                className="listing-nav"
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSearchParams({});
                }}
              >
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Category Pills */}
        <div className="category-pills-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '20px 0 30px' }}>
          <button
            type="button"
            className={`pill-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory('');
              const next = new URLSearchParams(searchParams);
              next.delete('category');
              setSearchParams(next);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: '2px solid #212529',
              background: !selectedCategory ? '#212529' : 'white',
              color: !selectedCategory ? 'white' : '#212529',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`pill-btn ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => {
                const nextVal = selectedCategory === cat.name ? '' : cat.name;
                setSelectedCategory(nextVal);
                const next = new URLSearchParams(searchParams);
                if (nextVal) next.set('category', nextVal);
                else next.delete('category');
                setSearchParams(next);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: '2px solid #212529',
                background: selectedCategory === cat.name ? '#212529' : 'white',
                color: selectedCategory === cat.name ? 'white' : '#212529',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="loading-state">Loading campus listings...</p>
        ) : filteredListings.length ? (
          <div className="listings-grid">
            {filteredListings.map((item, idx) => (
              <ListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                location={item.profiles?.hostel || 'LPU Campus'}
                status={item.categories?.name || 'Item'}
                image={item.images?.[0]}
                label={item.title}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2>No listings found</h2>
            <p>Try clearing your search or explore other categories.</p>
          </div>
        )}
      </div>
    </main>
  );
}
