import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import api from "../api/axios";

// Simple in-memory cache to prevent loading flash
let cachedPlats = null;

export default function Menu() {
  const { t } = useLanguage();
  const [plats, setPlats] = useState(cachedPlats || []);
  const [loading, setLoading] = useState(!cachedPlats);
  const [error, setError] = useState(null);
  const [selectedPlats, setSelectedPlats] = useState(
    JSON.parse(localStorage.getItem('selectedPlats') || '[]')
  );
  const [guestCounts, setGuestCounts] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Always fetch to update, but if we have cache, we don't show loading
    fetchPlats();
    const stored = JSON.parse(localStorage.getItem('selectedPlats') || '[]');
    if (stored.length > 0) {
      const counts = {};
      stored.forEach(plat => {
        counts[plat.id] = plat.quantity || 1;
      });
      setGuestCounts(counts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedPlats', JSON.stringify(selectedPlats));
    const counts = {};
    selectedPlats.forEach(plat => {
      counts[plat.id] = plat.quantity || 1;
    });
    setGuestCounts(prev => ({ ...prev, ...counts }));
  }, [selectedPlats]);

  const fetchPlats = async () => {
    try {
      const res = await api.get('/plats');
      if (res.data && Array.isArray(res.data)) {
        setPlats(res.data);
        cachedPlats = res.data; // Update cache
        setError(null);
      } else {
        setPlats([]);
        setError('Invalid data format');
      }
    } catch (err) {
      console.error("Error fetching menu", err);
      // Only set empty if we don't have data
      if (plats.length === 0) setPlats([]);
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const deletePlat = async (id) => {
    if (window.confirm(t('menu.deleteConfirm'))) {
      try {
        await api.delete(`/plats/${id}`);
        fetchPlats();
      } catch (err) {
        alert(t('menu.deleteError'));
      }
    }
  };

  const togglePlat = (plat, isSelected) => {
    if (isSelected) {
      setSelectedPlats((current) => current.filter((p) => p.id !== plat.id));
      setGuestCounts((prev) => {
        const newCounts = { ...prev };
        delete newCounts[plat.id];
        return newCounts;
      });
      return;
    }

    const quantity = guestCounts[plat.id] || 1;
    if (quantity === 0) {
      setGuestCounts((prev) => ({ ...prev, [plat.id]: 1 }));
    }

    setSelectedPlats((current) => {
      const exists = current.find((p) => p.id === plat.id);
      const finalQuantity = guestCounts[plat.id] || 1;
      if (exists) {
        return current.map((p) =>
          p.id === plat.id ? { ...p, quantity: finalQuantity } : p
        );
      }
      return [
        ...current,
        { id: plat.id, nom: plat.nom, categorie: plat.categorie, quantity: finalQuantity },
      ];
    });
  };

  const incrementGuests = (platId) => {
    setGuestCounts((prev) => {
      const current = prev[platId] || 0;
      return { ...prev, [platId]: current + 1 };
    });
  };

  const decrementGuests = (platId) => {
    setGuestCounts((prev) => {
      const current = prev[platId] || 0;
      const next = Math.max(0, current - 1);
      return { ...prev, [platId]: next };
    });
  };

  const platsByCategorie = plats.reduce(
    (groups, plat) => {
      const cat = plat.categorie || 'Autres';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(plat);
      return groups;
    },
    {}
  );

  const renderCategorie = (catKey, titleKey) => {
    const items = platsByCategorie[catKey] || [];
    if (items.length === 0) return null;

    return (
      <section key={catKey} className="menu-category-section">
        <h2 className="menu-category-title">{t(titleKey)}</h2>
        <div className="menu-grid">
          {items.map((plat) => {
            const isSelected = selectedPlats.some((p) => p.id === plat.id);
            const quantity = guestCounts[plat.id] || 0;
            return (
              <div key={plat.id} className="menu-card">
                {user?.role === 'admin' && (
                  <div className="menu-admin-actions">
                    <Link to={`/admin/plat/edit/${plat.id}`} className="menu-edit-btn">{t('menu.edit')}</Link>
                    <button onClick={() => deletePlat(plat.id)} className="menu-delete-btn">X</button>
                  </div>
                )}
                <div className="menu-card-image-wrapper" onClick={() => navigate(`/menu/${plat.id}`, { state: { plat } })}>
                  <img
                    src={plat.image || 'https://via.placeholder.com/400x300'}
                    alt={plat.nom}
                    className="menu-card-image"
                  />
                </div>
                <div className="menu-card-body">
                  <h3 className="menu-card-name">{plat.nom}</h3>
                  <div className="menu-qty-row">
                    <span className="menu-qty-label">{t('menu.quantity')}</span>
                    <div className="menu-qty-controls">
                      <button
                        type="button"
                        className="menu-qty-btn"
                        onClick={() => decrementGuests(plat.id)}
                        disabled={quantity === 0}
                      >
                        -
                      </button>
                      <span className="menu-qty-value">{quantity}</span>
                      <button
                        type="button"
                        className="menu-qty-btn"
                        onClick={() => incrementGuests(plat.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`menu-add-btn ${isSelected ? 'menu-add-btn-selected' : ''}`}
                    onClick={() => togglePlat(plat, isSelected)}
                    disabled={!isSelected && !quantity}
                  >
                    {isSelected ? t('menu.remove') : t('menu.add')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  if (loading) return <div className="loader">{t('menu.loading')}</div>;

  return (
    <>
      <div className="menu-page">
        <div className="menu-header">
          <h1 className="menu-title">{t('menu.title')}</h1>
          
          {user?.role === 'admin' && (
            <Link to="/admin/plat/add" className="btn-primary">{t('menu.addDish')}</Link>   
          )}
        </div>

        {error && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ff4d4d', backgroundColor: '#ffe6e6', margin: '20px', borderRadius: '8px' }}>
            <p><strong>Error:</strong> {error}</p>
            <button onClick={fetchPlats} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#630308', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {!error && plats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <p>No dishes available at the moment.</p>
          </div>
        ) : (
          <>
            {renderCategorie('Starter', 'menu.categories.starters')}
            {renderCategorie('Main', 'menu.categories.mains')}
            {renderCategorie('Dessert', 'menu.categories.desserts')}
            {renderCategorie('Boissons', 'menu.categories.drinks')}
            {plats.length > 0 && Object.keys(platsByCategorie).filter(cat => ['Starter', 'Main', 'Dessert', 'Boissons'].includes(cat)).length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                <p>No dishes match the current categories. Available categories: {Object.keys(platsByCategorie).join(', ')}</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}