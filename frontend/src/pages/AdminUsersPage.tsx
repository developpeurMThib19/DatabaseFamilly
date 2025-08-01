import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  last_login: string | null;
  is_online: boolean;
  login_time?: string;
  session_duration: string | null;
  avatar_url?: string | null;
  login_count: number;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ "Bearer " + token
      },
    })
      .then((res) => {
        console.log("DATA REÇUE :", res.data); // 👈 important
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setError("⛔ Erreur serveur ou accès refusé");
      });
  }, []);
  

  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f6f1e7] flex items-center justify-center py-10 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-6xl">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          👩‍💼 Liste des utilisateurs
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left border">Email</th>
                <th className="px-4 py-3 text-left border">Nom</th>
                <th className="px-4 py-3 text-left border">Statut</th>
                <th className="px-4 py-3 text-left border">Dernière connexion</th>
                <th className="px-4 py-3 text-left border">Durée session</th>
                <th className="px-4 py-3 text-left border">Numbre de connexions</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-600 text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#fff4ed] transition">
                  <td className="px-4 py-3 border">{u.email}</td>
                  <td className="px-4 py-3 border">{u.nom} {u.prenom}</td>
                  <td className="px-4 py-3 border">
                    <span className={`font-bold ${u.is_online ? 'text-green-600' : 'text-gray-400'}`}>
                      <td>{u.is_online ? '🟢 En ligne' : '❌ Hors ligne'}</td>
                    </span>
                  </td>
                  <td className="px-4 py-3 border">
                    {u.last_login ? new Date(u.last_login).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3 border">
                    {u.session_duration ?? '—'}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    {u.login_count ?? 0}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Aucun utilisateur à afficher.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;