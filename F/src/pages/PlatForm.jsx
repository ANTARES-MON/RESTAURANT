import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api/axios";
import Footer from '../components/Footer';

export default function PlatForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    nom: '', 
    description: '', 
    composition: '',
    prix: '', 
    categorie: '', 
    image: '' 
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/plats/${id}`).then(res => {
        setFormData(res.data);
        if (res.data.image) {
          setImagePreview(res.data.image);
        }
      });
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop grande. Taille maximale: 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        prix: parseFloat(formData.prix)
      };

      if (id) {
        await api.put(`/plats/${id}`, submitData);
      } else {
        await api.post('/plats', submitData);
      }
      navigate('/menu');
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de l'enregistrement: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="plat-form-page">
        <div className="plat-form-container">
          <h1 className="plat-form-title">
            {id ? 'Modifier' : 'Ajouter'} un <span className="gold-text">Plat</span>
          </h1>

          <form onSubmit={handleSubmit} className="plat-form">
            <div className="form-group">
              <label>Nom du plat *</label>
              <input 
                type="text" 
                placeholder="Ex: MÉCHOUI: TRADITIONAL ROAST LAMB" 
                value={formData.nom} 
                className="form-input" 
                onChange={e => setFormData({...formData, nom: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea 
                placeholder="Décrivez le plat en détail..." 
                value={formData.description} 
                className="form-input form-textarea" 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows="4"
                required 
              />
            </div>

            <div className="form-group">
              <label>Composition</label>
              <textarea 
                placeholder="Liste des ingrédients (séparés par des virgules)" 
                value={formData.composition || ''} 
                className="form-input form-textarea" 
                onChange={e => setFormData({...formData, composition: e.target.value})} 
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prix (MAD) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  placeholder="Ex: 450.00" 
                  value={formData.prix} 
                  className="form-input" 
                  onChange={e => setFormData({...formData, prix: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Catégorie *</label>
                <select 
                  value={formData.categorie} 
                  className="form-input" 
                  onChange={e => setFormData({...formData, categorie: e.target.value})} 
                  required
                  style={{ height: '50px' }}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="Starter">ENTRÉES</option>
                  <option value="Main">PLATS RÉSISTANCE</option>
                  <option value="Dessert">DESSERTS</option>
                  <option value="Boissons">BOISSONS</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Image</label>
              <div className="image-upload-section">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-input"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  {imagePreview ? 'Changer l\'image' : 'Choisir une image'}
                </label>
                {imagePreview && (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="image-remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <small style={{ color: '#666', marginTop: '8px', display: 'block' }}>
                Ou entrez une URL d'image
              </small>
              <input 
                type="url" 
                placeholder="https://example.com/image.jpg" 
                value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''} 
                className="form-input" 
                style={{ marginTop: '8px' }}
                onChange={e => {
                  setFormData({...formData, image: e.target.value});
                  if (e.target.value) {
                    setImagePreview(e.target.value);
                  }
                }}
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/menu')} 
                className="btn-cancel"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn-gold"
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : (id ? 'Mettre à jour' : 'Créer')}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
