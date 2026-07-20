import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import api from '../api/axios';

export default function Reservation() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nom_client: '',
    email: '',
    telephone: '',
    date_reservation: '',
    heure: '',
    nombre_personnes: 2,
    selected_plats: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const timeSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('selectedPlats') || '[]');
    if (stored.length > 0) {
      setFormData((prev) => ({
        ...prev,
        selected_plats: stored,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hasMainDish = formData.selected_plats.some(plat => 
        plat.categorie === 'Main' || plat.categorie === 'Plat Principal'
      );

      if (!hasMainDish) {
        alert(t('reservation.noMainDish'));
        return;
      }

      const dateTime = `${formData.date_reservation} ${formData.heure}:00`;
      const selectedDate = new Date(dateTime);
      const now = new Date();

      if (selectedDate <= now) {
        alert(t('reservation.pastDateTime'));
        return;
      }

      const submitData = {
        ...formData,
        date_reservation: dateTime,
        selected_plats: JSON.stringify(formData.selected_plats),
      };
      await api.post('/reservations', submitData);
      localStorage.removeItem('selectedPlats');
      setSubmitted(true);
    } catch (err) {
      alert(t('reservation.error') || "Error during reservation.");
    }
  };

  if (submitted) {
    return (
      <>
        <div className="reservation-success">
          <h2>{t('reservation.success')}</h2>
          <p>{t('reservation.successMessage')}</p>
          <Link to="/" className="btn-gold">{t('reservation.back')}</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="reservation-page">
        <div className="reservation-container">
          <h1>{t('reservation.title')}</h1>
          <p className="reservation-subtitle">{t('reservation.subtitle')}</p>

          {formData.selected_plats.length > 0 && (
            <div className="reservation-selected-plats">
              <h2 className="reservation-selected-title">{t('reservation.selectedDishes')}</h2>
              <ul className="reservation-selected-list">
                {formData.selected_plats.map((plat) => (
                  <li key={plat.id} className="reservation-selected-item">
                    {plat.nom}{plat.quantity ? ` (x${plat.quantity})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-row" style={{ marginBottom: '25px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>{t('reservation.date')}</label>
              <input 
                type="date" 
                className="form-input" 
                required 
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setFormData({...formData, date_reservation: e.target.value})} 
              />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>{t('reservation.time')}</label>
                <select 
                  className="form-input" 
                  value={formData.heure} 
                  onChange={e => setFormData({...formData, heure: e.target.value})}
                  required
                  style={{ height: '54px' }}
                >
                  <option value="">{t('reservation.selectTime')}</option>
                  {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '25px' }}>
              <label>{t('reservation.guests')}</label>
              <input 
                type="number" 
                min="1" 
                max="6" 
                className="form-input" 
                value={formData.nombre_personnes} 
                onChange={e => setFormData({...formData, nombre_personnes: e.target.value})} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>{t('reservation.fullName')}</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={t('reservation.fullNamePlaceholder')} 
                onChange={e => setFormData({...formData, nom_client: e.target.value})} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>{t('reservation.email')}</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder={t('reservation.emailPlaceholder')} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>{t('reservation.phone')}</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder={t('reservation.phonePlaceholder')} 
                onChange={e => setFormData({...formData, telephone: e.target.value})} 
                required 
              />
            </div>
            
            <button type="submit" className="btn-gold btn-reserve">{t('reservation.submit')}</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}