import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import api from '../api/axios';
import { ArrowLeft } from 'lucide-react';

export default function PlatDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [plat, setPlat] = useState(location.state?.plat || null);
  const [loading, setLoading] = useState(!location.state?.plat);
  const [selectedPlats, setSelectedPlats] = useState(
    JSON.parse(localStorage.getItem('selectedPlats') || '[]')
  );
  const [guestCounts, setGuestCounts] = useState({});

  useEffect(() => {
    fetchPlat();
    const stored = JSON.parse(localStorage.getItem('selectedPlats') || '[]');
    if (stored.length > 0) {
      const counts = {};
      stored.forEach(plat => {
        counts[plat.id] = plat.quantity || 1;
      });
      setGuestCounts(counts);
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem('selectedPlats', JSON.stringify(selectedPlats));
    const counts = {};
    selectedPlats.forEach(plat => {
      counts[plat.id] = plat.quantity || 1;
    });
    setGuestCounts(prev => ({ ...prev, ...counts }));
  }, [selectedPlats]);

  const fetchPlat = async () => {
    try {
      const res = await api.get(`/plats/${id}`);
      setPlat(res.data);
    } catch (err) {
      console.error("Error fetching plat", err);
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const togglePlat = (plat) => {
    const isSelected = selectedPlats.some((p) => p.id === plat.id);

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
      const finalQuantity = guestCounts[plat.id] || 1;
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

  if (loading) return <div className="loader">{t('dishDetail.loading')}</div>;
  if (!plat) return <div className="loader">{t('dishDetail.notFound')}</div>;

  const isSelected = selectedPlats.some((p) => p.id === plat.id);
  const quantity = guestCounts[plat.id] || 0;

  return (
    <>
      <div className="dish-detail-page">
        <button onClick={() => navigate('/menu')} className="dish-back-btn">
          <ArrowLeft size={24} />
        </button>

        <div className="dish-detail-container">
          <div className="dish-image-section">
            <img 
              src={plat.image || 'https://via.placeholder.com/600x400'} 
              alt={plat.nom} 
              className="dish-detail-image"
            />
          </div>
          
          <div className="dish-info-section">
            <h1 className="dish-detail-name">{plat.nom}</h1>
            
            {plat.description && (
              <div className="dish-section">
                <h3 className="dish-section-title">{t('dishDetail.description')}</h3>
                <p className="dish-description">{plat.description}</p>
              </div>
            )}
            
            {plat.composition && (
              <div className="dish-section">
                <h3 className="dish-section-title">{t('dishDetail.composition')}</h3>
                <p className="dish-composition">{plat.composition}</p>
              </div>
            )}
            
            <div className="dish-price-section">
              <span className="dish-price">{plat.prix} MAD</span>
            </div>

            <div className="dish-quantity-section">
              <div className="menu-qty-row">
                <span className="menu-qty-label">{t('dishDetail.quantity')}</span>
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
                onClick={() => togglePlat(plat)}
                disabled={!isSelected && !quantity}
                style={{ marginTop: '15px', width: '100%' }}
              >
                {isSelected ? t('dishDetail.remove') : t('dishDetail.add')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

