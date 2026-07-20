import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const titleLines = t('home.title').split('\n');

  return (
    <div className="home-page">
      <section className="hero">
        <p className="hero-opening">{t('home.opening')}</p>
        <h1 className="hero-title">
          {titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 && <br/>}
            </span>
          ))}
        </h1>
      </section>

      <section className="about-section">
        <h2>{t('home.aboutTitle')}</h2>
        <div className="about-content">
          <p>
            {t('home.aboutText1')}
          </p>
          <p>
            {t('home.aboutText2')}
          </p>
        </div>
      </section>

      <section className="menu-section">
        <h2>{t('home.menuTitle')}</h2>
        <div className="menu-content">
          <p>
            {t('home.menuText1')}
          </p>
          <p>
            {t('home.menuText2')}
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}