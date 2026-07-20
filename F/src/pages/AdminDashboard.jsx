import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from "../api/axios";
import { CheckCircle, Clock, Users, List } from 'lucide-react';

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error("Erreur chargement reservations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    if (window.confirm("Confirmer cette réservation ? Un email sera envoyé au client.")) {
      try {
        const response = await api.put(`/reservations/${id}`, { statut: 'confirme' });
        setReservations(prev => prev.map(res => 
          res.id === id ? { ...res, statut: 'confirme' } : res
        ));
        alert("Réservation confirmée ! Email envoyé au client.");
      } catch (err) {
        console.error("Erreur confirmation:", err);
        alert("Erreur lors de la confirmation: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleAnnuler = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ? Un email sera envoyé au client.")) {
      try {
        const response = await api.put(`/reservations/${id}`, { statut: 'annule' });
        setReservations(prev => prev.map(res => 
          res.id === id ? { ...res, statut: 'annule' } : res
        ));
        alert("Réservation annulée ! Email envoyé au client.");
      } catch (err) {
        console.error("Erreur annulation:", err);
        alert("Erreur lors de l'annulation: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredReservations = user?.role === 'admin' 
    ? reservations.filter(res => res.statut !== 'annule')
    : reservations.filter(res => res.statut === 'confirme');

  const stats = {
    total: reservations.length,
    enAttente: reservations.filter(r => r.statut === 'en_attente').length,
    confirmes: reservations.filter(r => r.statut === 'confirme').length,
  };

  if (loading) return <div className="loader">Chargement du Dashboard...</div>;

  return (
    <div style={{ padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'Playfair Display', marginBottom: '30px' }}>
        Tableau de Bord <span className="gold-text">{user?.role === 'admin' ? 'Admin' : 'Personnel'}</span>
      </h1>

      {/* Stats Section - Visible to Admin */}
      {user?.role === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <div className="stat-card">
            <List className="gold-text" />
            <h4>Total Réservations</h4>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card">
            <Clock style={{ color: '#e67e22' }} />
            <h4>En Attente</h4>
            <p>{stats.enAttente}</p>
          </div>
          <div className="stat-card">
            <CheckCircle style={{ color: '#27ae60' }} />
            <h4>Confirmées</h4>
            <p>{stats.confirmes}</p>
          </div>
        </div>
      )}

      {/* Reservations Table */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '20px' }}>
          {user?.role === 'admin' ? 'Toutes les Réservations' : 'Réservations à Servir (Confirmées)'}
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '12px' }}>Client</th>
              <th>Personnes</th>
              <th>Date & Heure</th>
              <th>Statut</th>
              {user?.role === 'admin' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map(res => (
              <tr key={res.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>
                  <strong>{res.nom_client}</strong><br/>
                  <small style={{ color: '#666' }}>{res.telephone}</small>
                </td>
                <td><Users size={16} /> {res.nombre_personnes}</td>
                <td>{new Date(res.date_reservation).toLocaleString('fr-FR')}</td>
                <td>
                  <span className={`badge ${res.statut}`}>
                    {res.statut === 'en_attente' ? 'En attente' : res.statut === 'confirme' ? 'Confirmée' : 'Annulée'}
                  </span>
                </td>
                {user?.role === 'admin' && (
                  <td>
                    <div style={{display: 'flex', gap: '10px'}}>
                      {res.statut === 'en_attente' && (
                        <>
                          <button onClick={() => handleConfirm(res.id)} className="btn-confirm">
                            Confirmer
                          </button>
                          <button onClick={() => handleAnnuler(res.id)} className="btn-annuler">
                            Annuler
                          </button>
                        </>
                      )}
                      {res.statut === 'confirme' && (
                        <button onClick={() => handleAnnuler(res.id)} className="btn-annuler">
                          Annuler
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredReservations.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>Aucune réservation trouvée.</p>}
      </div>

      <style>{`
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .stat-card h4 { margin: 10px 0; color: #666; font-size: 0.9rem; }
        .stat-card p { font-size: 1.8rem; font-weight: bold; margin: 0; }
        .badge { padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
        .badge.en_attente { background: #fef9e7; color: #f39c12; }
        .badge.confirme { background: #eafaf1; color: #27ae60; }
        .badge.annule { background: #fee; color: #c00; }
        .btn-confirm { background: var(--primary); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; transition: 0.3s; }
        .btn-confirm:hover { background: #7a040a; }
        .btn-annuler { background: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; transition: 0.3s; }
        .btn-annuler:hover { background: #cc0000; }
      `}</style>
    </div>
  );
}