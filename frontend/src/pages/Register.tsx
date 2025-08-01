import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from '../api/axios';

export default function Register() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { nom, prenom, email, password });
      navigate('/connexion');
    } catch (err) {
      alert("Erreur d'inscription");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3ede1] text-[#324B3A]">
      <div className="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-md border border-[#a8c3a0]">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#324B3A]">Inscription 🪷</h2>

        <input
          value={nom}
          onChange={e => setNom(e.target.value)}
          placeholder="Nom"
          className="w-full border border-[#a8c3a0] bg-[#f3ede1] text-[#324B3A] placeholder-[#7D8CA3] p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#A8C3A0]"
        />

        <input
          value={prenom}
          onChange={e => setPrenom(e.target.value)}
          placeholder="Prénom"
          className="w-full border border-[#a8c3a0] bg-[#f3ede1] text-[#324B3A] placeholder-[#7D8CA3] p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#A8C3A0]"
        />

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-[#a8c3a0] bg-[#f3ede1] text-[#324B3A] placeholder-[#7D8CA3] p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#A8C3A0]"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full border border-[#a8c3a0] bg-[#f3ede1] text-[#324B3A] placeholder-[#7D8CA3] p-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-[#A8C3A0]"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-[#324B3A] text-white rounded py-3 font-semibold hover:bg-[#2b3e30] transition-all"
        >
          S'inscrire
        </button>

        <p className="mt-4 text-sm text-center">
          Déjà inscrit ?{" "}
          <Link to="/connexion" className="text-[#7D8CA3] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}