import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import api from "../api/axios";

export default function Login() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); 

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await api.post('/login', { email, password });
      login(res.data.user, res.data.access_token);
      navigate(from, { replace: true }); 
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || { email: ['Invalid email or password.'] });
      } else {
        alert(t('login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-icon-wrapper">
              <UtensilsCrossed size={48} />
            </div>
            <h1 className="login-welcome">Welcome Back</h1>
            <p className="login-welcome-text">Experience the finest Moroccan cuisine at Le Palais de Minuit</p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-svg-decoration"></div>
          <div className="login-form-wrapper">
            <div className="login-header">
              <h2 className="login-title">{t('login.title')}</h2>
              <p className="login-subtitle">{t('login.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-input-group">
                <label className="login-label">{t('login.email')}</label>
                <div className={`login-input-wrapper ${errors.email ? 'login-input-error' : ''}`}>
                  <svg className="login-input-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input 
                    type="email" 
                    placeholder={t('login.emailPlaceholder')} 
                    className="login-input" 
                    onChange={e => setEmail(e.target.value)} 
                    required
                  />
                </div>
                {errors.email && <p className="login-error-text">{errors.email[0]}</p>}
              </div>

              <div className="login-input-group">
                <label className="login-label">{t('login.password')}</label>
                <div className={`login-input-wrapper ${errors.password ? 'login-input-error' : ''}`}>
                  <svg className="login-input-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input 
                    type="password" 
                    placeholder={t('login.passwordPlaceholder')} 
                    className="login-input" 
                    onChange={e => setPassword(e.target.value)} 
                    required
                  />
                </div>
                {errors.password && <p className="login-error-text">{errors.password[0]}</p>}
              </div>

              <button 
                disabled={loading}
                className="login-button"
              >
                {loading ? t('login.signingIn') : t('login.signIn')}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}