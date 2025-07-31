import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function AjouterProduit() {
  const [titre, setTitre] = useState('');
  const [prix, setPrix] = useState('');
  const [dateAchat, setDateAchat] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('prix', prix);
    formData.append('date_achat', dateAchat);
    if (image) {
      console.log("📦 Image à envoyer 1 :", image);

      formData.append('image', image);
    }
    console.log("📦 Image à envoyer 2 :", image);


    try {
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/produits/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        //  'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/home');
      console.log("📦 FormData avant envoi :");
      for (const [key, value] of formData.entries()) {
        console.log(`🧾 ${key}:`, value);
      }
    } catch (err) {
      alert("Erreur lors de l'ajout du produit");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3ede1] flex items-center justify-center px-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-background text-forest shadow-md rounded-lg px-8 py-6 max-w-md mx-auto border border-forest"
      >
        <h2 className="text-3xl font-serif text-center text-[#4a6b5a] mb-4">Ajouter un produit</h2>
        <p className="text-center text-[#4a6b5a] text-sm mb-6">
          Remplissez les champs pour enregistrer un nouveau produit 🌱
        </p>

        <input
          type="text"
          value={titre}
          onChange={e => setTitre(e.target.value)}
          required
          placeholder="Titre"
          className="w-full mb-4 px-4 py-2 border border-[#4a6b5a] bg-transparent rounded-sm placeholder-[#4a6b5a] focus:outline-none"
        />

        <input
          type="number"
          value={prix}
          onChange={e => setPrix(e.target.value)}
          required
          placeholder="Prix (€)"
          className="w-full mb-4 px-4 py-2 border bg-[#A8C3A0]  border-[#4a6b5a] bg-transparent rounded-sm placeholder-[#4a6b5a] focus:outline-none"
        />

        <input
          type="date"
          value={dateAchat}
          onChange={e => setDateAchat(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border border-[#4a6b5a] bg-transparent rounded-sm text-[#4a6b5a] focus:outline-none"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0] || null;
            console.log("📸 Fichier sélectionné :", file);
            setImage(file);
          }}
          className="w-full mb-6 text-[#4a6b5a] file:mr-3 file:py-1 file:px-3 file:rounded file:border file:border-[#4a6b5a] file:text-sm file:bg-white file:text-[#4a6b5a] hover:file:bg-[#f0f0f0]"
        />

        <button
          type="submit"
          className="w-full bg-[#4a6b5a] text-white py-2 rounded-full hover:bg-[#3b5548] transition"
        >
          ENVOYER
        </button>
        <div className="mt-6 text-center">
          <Link
            to="/home"
            className="text-[#7D8CA3] hover:underline text-sm"
          >
            Retour à l’accueil
          </Link>
        </div>
      </form>
    </div>
  );
}
