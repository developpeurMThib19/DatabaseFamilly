// src/pages/ProduitDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function ProduitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produit, setProduit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    axios.get(`http://localhost:3001/api/produits/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setProduit(res.data);
      setLoading(false);
    })
    .catch(() => {
      alert("Erreur lors du chargement du produit.");
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token || !produit) return;
  
    const formData = new FormData();
    formData.append("titre", produit.titre);
    formData.append("prix", produit.prix);
    formData.append("date_achat", produit.date_achat);
    if (newImage) formData.append("image", newImage);
  
    try {
      await axios.put(`http://localhost:3001/api/produits/${id}/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setShowToast(true); // animation (voir étape 2)
      setTimeout(() => navigate('/home'), 2000);
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  if (loading) return <p className="text-center mt-8">Chargement...</p>;

  return (
    <div className="min-h-screen bg-[#f3ede1] text-forest px-4 py-10 flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Modifier le produit</h1>

        <label className="block mb-2 font-semibold">Image actuelle</label>
        <img src={produit.image_url} className="mb-4 w-full max-h-48 object-cover rounded" />

        <label className="block mb-2 font-semibold">Modifier l’image</label>
        <input
        type="file"
        accept="image/*"
        onChange={e => setNewImage(e.target.files?.[0] || null)}
        className="w-full mb-6 text-[#4a6b5a] file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-[#4a6b5a] file:text-sm file:bg-white file:text-[#4a6b5a] hover:file:bg-[#f0f0f0]"
        />


        <label className="block mb-2 font-semibold">Titre</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={produit.titre}
          onChange={(e) => setProduit({ ...produit, titre: e.target.value })}
        />

        <label className="block mb-2 font-semibold">Prix (€)</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={produit.prix}
          type="number"
          onChange={(e) => setProduit({ ...produit, prix: e.target.value })}
        />

        <label className="block mb-2 font-semibold">Date d'achat</label>
        <input
          className="w-full border p-2 rounded mb-6"
          type="date"
          value={produit.date_achat?.substring(0, 10)}
          onChange={(e) => setProduit({ ...produit, date_achat: e.target.value })}
        />

        <div className="text-center">
          <button
            onClick={handleUpdate}
            className="bg-forest text-white px-6 py-2 rounded hover:bg-[#3b5548]"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
      {showToast && (
        <div className="fixed top-4 right-4 bg-[#A8C3A0] text-forest px-4 py-2 rounded shadow-lg animate-fade-in">
        ✅ Modifications enregistrées !
        </div>
    )}
    </div>
  );
}
