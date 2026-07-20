import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguageTo, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`} style={{ borderBottom: location.pathname === '/login' ? '1px solid white' : 'none' }}>
      <Link to="/" className="nav-logo" style={{textDecoration:'none', fontSize: scrolled ? '1.5rem' : '1.8rem', transition: 'font-size 0.3s ease'}}>
        LE PALAIS <span style={{color: 'white'}}>DE MINUIT</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">{t('nav.home')}</Link>
        <Link to="/menu" className="nav-link">{t('nav.menu')}</Link>
        <Link to="/reservation" className="nav-link">{t('nav.reservation')}</Link>
        <Link to="/contact" className="nav-link">{t('nav.contact')}</Link>
        
        <div className="nav-language-toggle">
          <button
            onClick={() => setLanguageTo('fr')}
            className={`lang-btn ${language === 'fr' ? 'lang-btn-active' : ''}`}
          >
            FR
          </button>
          <button
            onClick={() => setLanguageTo('en')}
            className={`lang-btn ${language === 'en' ? 'lang-btn-active' : ''}`}
          >
            EN
          </button>
        </div>
        
        {user ? (
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <Link to="/admin" style={{color: 'white', display: 'flex', alignItems: 'center'}}>
              <LayoutDashboard size={20} />
            </Link>
            <button onClick={handleLogout} style={{background:'none', border:'none', color:'white', cursor:'pointer', display: 'flex', alignItems: 'center'}}>
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-link" style={{color: 'white'}}>{t('nav.login')}</Link>
        )}
      </div>
    </nav>
  );
}