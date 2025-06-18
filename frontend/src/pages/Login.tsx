import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { email, password }, {
        withCredentials: true,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (err) {
      alert('Erreur de connexion');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3ede1] text-[#324B3A]">
      <div className="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-md border border-[#a8c3a0]">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#324B3A]">Connexion 🔐</h2>
        <input
          type="email"
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
          onClick={handleLogin}
          className="w-full bg-[#324B3A] text-white rounded py-3 font-semibold hover:bg-[#2b3e30] transition-all"
        >
          Se connecter
        </button>

        <p className="mt-4 text-sm text-center text-[#324B3A]">
          Pas encore inscrit ?{" "}
          <Link to="/inscription" className="text-[#D99C83] hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
