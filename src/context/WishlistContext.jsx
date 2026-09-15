import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
const LOCAL_STORAGE_KEY = 'pashItWishlist';

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'));
    } catch {
      return new Set();
    }
  });

  // When user logs in, fetch from Supabase favorites table
  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        try {
          const local = new Set(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'));
          setSavedIds(local);
        } catch {
          setSavedIds(new Set());
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id);

        if (!error && data) {
          const ids = new Set(data.map(f => String(f.listing_id)));
          setSavedIds(ids);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...ids]));
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    }

    loadFavorites();
  }, [user]);

  async function toggleWishlist(listingId) {
    const idStr = String(listingId);
    const newSet = new Set(savedIds);
    const wasSaved = newSet.has(idStr);

    if (wasSaved) {
      newSet.delete(idStr);
    } else {
      newSet.add(idStr);
    }

    setSavedIds(newSet);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...newSet]));

    if (user) {
      try {
        if (wasSaved) {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('listing_id', listingId);
        } else {
          await supabase
            .from('favorites')
            .insert({
              user_id: user.id,
              listing_id: listingId
            });
        }
      } catch (err) {
        console.error('Failed to sync favorite with server:', err);
      }
    }
  }

  function isSaved(listingId) {
    return savedIds.has(String(listingId));
  }

  const value = {
    savedIds,
    wishCount: savedIds.size,
    toggleWishlist,
    isSaved
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
