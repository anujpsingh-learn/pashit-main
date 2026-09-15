import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { UploadCloud, X } from 'lucide-react';

export default function Sell() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from('categories').select('id, name').order('name');
      if (data) setCategories(data);
    }
    loadCategories();
  }, []);

  function handleFileChange(e) {
    const files = Array.from(e.target.files).slice(0, 5);
    setSelectedFiles(files);
  }

  function removeFile(index) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!title || !categoryId || !price) {
      setErrorMsg('Please fill in title, category, and price.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setMessage('Uploading photos and posting your listing...');

    try {
      const imageUrls = [];
      for (const file of selectedFiles) {
        const path = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(path, file);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(path);

        imageUrls.push(publicUrl);
      }

      const { error: insertError } = await supabase.from('listings').insert({
        seller_id: user.id,
        category_id: Number(categoryId),
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        images: imageUrls,
        status: 'active'
      });

      if (insertError) throw insertError;

      setMessage('Listing posted successfully! Redirecting...');
      setTimeout(() => navigate('/listings'), 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to post listing.');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <main className="section-pad">
        <p className="loading-state">Checking authorization...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="section-pad" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '2rem', marginBottom: '12px' }}>
            Login required to sell
          </h2>
          <p style={{ color: 'rgba(20, 0, 31, 0.7)', marginBottom: '24px' }}>
            Only verified LPU students can create listings on Pash.it.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Login / Sign Up
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="sell-page section-pad">
      <div style={{ maxWidth: '640px', margin: '0 auto', background: 'white', padding: '36px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
        <div style={{ marginBottom: '28px' }}>
          <span className="live-burst" style={{ display: 'inline-block', marginBottom: '8px' }}>SELL</span>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '2.4rem', margin: 0 }}>Create a Listing</h1>
          <p style={{ color: 'rgba(20,0,31,0.6)', marginTop: '6px' }}>List your item in seconds for campus buyers.</p>
        </div>

        {errorMsg && (
          <div style={{ background: '#ffe3ee', color: '#d42d70', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', marginBottom: '18px' }}>
            {errorMsg}
          </div>
        )}

        {message && (
          <div style={{ background: '#e8f8d8', color: '#2b8a3e', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', marginBottom: '18px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '6px' }}>Item Title *</label>
            <input
              type="text"
              placeholder="e.g. Study Lamp, Cycle, Sony Headphones"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e9ecef', fontSize: '1rem', fontWeight: '600' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '6px' }}>Category *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e9ecef', fontSize: '1rem', fontWeight: '600', background: 'white' }}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '6px' }}>Price (₹) *</label>
              <input
                type="number"
                placeholder="₹ Amount"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                min="0"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e9ecef', fontSize: '1rem', fontWeight: '600' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '6px' }}>Description</label>
            <textarea
              placeholder="Mention condition, hostel block, reasons for selling, negotiation details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="4"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e9ecef', fontSize: '1rem', fontWeight: '600', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '6px' }}>Photos (Up to 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              id="fileInput"
              style={{ display: 'none' }}
            />
            <label
              htmlFor="fileInput"
              style={{
                border: '2px dashed #ced4da',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                background: '#f8f9fa'
              }}
            >
              <UploadCloud size={32} color="#8d66e8" />
              <span style={{ fontWeight: '800' }}>Click to upload photos</span>
              <span style={{ fontSize: '0.8rem', color: '#868e96' }}>PNG, JPG, WEBP up to 5MB each</span>
            </label>

            {selectedFiles.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                {selectedFiles.map((file, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden' }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', height: '54px', marginTop: '10px' }}
          >
            {submitting ? 'Posting...' : 'Post Listing ->'}
          </button>
        </form>
      </div>
    </main>
  );
}
