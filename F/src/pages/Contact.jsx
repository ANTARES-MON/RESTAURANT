import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import api from '../api/axios';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
    } catch (err) {
      alert(t('contact.error'));
    }
  };

  if (submitted) {
    return (
      <>
        <div className="contact-success">
          <h2>{t('contact.success')}</h2>
          <p>{t('contact.successMessage')}</p>
          <button onClick={() => setSubmitted(false)} className="btn-gold">{t('contact.sendAnother')}</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-info">
            <h1>{t('contact.title')}</h1>
            <div className="contact-details">
              <div className="contact-detail-item">
                <h4>{t('contact.address')}</h4>
                <p>{t('contact.addressValue').split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                ))}</p>
              </div>
              <div className="contact-detail-item">
                <h4>{t('contact.email')}</h4>
                <p>{t('contact.emailValue')}</p>
              </div>
              <div className="contact-detail-item">
                <h4>{t('contact.phone')}</h4>
                <p>{t('contact.phoneValue')}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>{t('contact.name')}</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={t('contact.namePlaceholder')} 
                value={formData.nom}
                onChange={e => setFormData({...formData, nom: e.target.value})} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>{t('contact.email')}</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder={t('contact.emailPlaceholder')} 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label>{t('contact.phone')}</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder={t('contact.phonePlaceholder')} 
                value={formData.telephone}
                onChange={e => setFormData({...formData, telephone: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label>{t('contact.subject')}</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={t('contact.subjectPlaceholder')} 
                value={formData.sujet}
                onChange={e => setFormData({...formData, sujet: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label>{t('contact.message')}</label>
              <textarea 
                className="form-input form-textarea" 
                placeholder={t('contact.messagePlaceholder')} 
                rows="6"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})} 
                required 
              />
            </div>

            <button type="submit" className="btn-gold btn-contact">{t('contact.submit')}</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}