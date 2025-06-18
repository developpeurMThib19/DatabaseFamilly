import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from '../api/axios';

type JwtPayload = {
  userId: number;
  nom: string;
  prenom: string;
  email: string;
};

type Produit = {
  id: number;
  titre: string;
  prix: string;
  image_url: string;
  date_achat: string;
  vendu: boolean;
};

export default function Home() {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  const [prixRevente, setPrixRevent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

   // 👉 FONCTION DECONNEXION
   const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/connexion');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      setUser(decoded);

      axios.get('http://localhost:3001/api/produits', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data.map((p: any) => ({
          ...p,
          vendu: p.vendu === true || p.vendu === 'true'
        }));
        setProduits(data);
      })
      .catch(err => console.error('Erreur produits :', err));
    }
  }, []);

  const produitsNonVendus = produits.filter(p => !p.vendu);

  return (
    <div className="bg-background min-h-screen text-primary px-6 py-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#324B3A]">
            Bienvenue, {user?.prenom} {user?.nom} 👋
          </h1>

          <button
            onClick={handleLogout}
            className="bg-[#D99C83] hover:bg-[#c58973] text-white font-semibold py-2 px-4 rounded transition-all"
          >
            Se déconnecter
          </button>
        </div>

        <div className="flex gap-4 mt-4 mb-8">
          <Link to="/ajouter-produit">
            <button className="bg-[#324B3A] text-white py-2 px-4 rounded-full hover:bg-[#2a3f31] transition">
              ➕ Ajouter un produit
            </button>
          </Link>
          <Link to="/historique">
            <button className="bg-[#324B3A] text-white py-2 px-4 rounded-full hover:bg-[#2a3f31] transition">
              📜 Historique
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produitsNonVendus.map(p => (
            <div
            key={p.id}
            className="bg-[#f3ede1] text-[#324B3A] border border-[#e1d7c3] shadow-md rounded-xl p-4 w-[240px] transition-transform hover:scale-105"
          >
            <img
              src={p.image_url}
              alt={p.titre}
              className="w-full h-40 object-cover rounded-md mb-3"
          />
          
            <h3 className="text-lg font-semibold">{p.titre}</h3>
          
            <p className="text-sm">💰 {parseFloat(p.prix).toFixed(2)} €</p>
            <p className="text-sm">🗓️ {new Date(p.date_achat).toLocaleDateString()}</p>
            <p className="text-sm">🛒 {p.vendu ? "Vendu" : "Disponible"}</p>
          
            <button
              onClick={() => {
                setSelectedProduit(p);
                setShowModal(true);
              }}
              className="mt-4 w-full bg-[#324B3A] text-white py-2 rounded-full hover:bg-[#2a3f31] transition-colors"
            >
              📦 Vendre ce produit
            </button>
          </div>
          
          ))}
        </div>

        {showModal && selectedProduit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#f3ede1] text-[#324B3A] p-6 rounded-2xl shadow-2xl w-full max-w-md border border-[#D99C83]">
            <h2 className="text-2xl font-bold mb-4 text-[#324B3A]">
              🧾 Revente de <span className="italic">{selectedProduit.titre}</span>
            </h2>

            <input
              type="number"
              value={prixRevente}
              onChange={e => setPrixRevent(e.target.value)}
              className="w-full border border-[#A8C3A0] bg-white text-[#324B3A] placeholder-[#7D8CA3] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D99C83] mb-4"
              placeholder="Entrez le prix de revente (€)"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-[#7D8CA3] text-[#7D8CA3] hover:bg-[#e9e4d9] transition"
              >
                Annuler
              </button>

              <button
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (!token || !selectedProduit) return;

                  await axios.put(
                    `http://localhost:3001/api/produits/${selectedProduit.id}/vendu`,
                    { prix_revente: prixRevente },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );

                  const res = await axios.get('http://localhost:3001/api/produits', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setProduits(res.data);
                  setShowModal(false);
                  setPrixRevent('');
                  setSelectedProduit(null);
                }}
                className="bg-[#D99C83] hover:bg-[#c9856b] text-white px-4 py-2 text-sm rounded-lg transition"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
