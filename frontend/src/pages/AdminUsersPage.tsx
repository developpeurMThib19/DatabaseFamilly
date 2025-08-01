import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  last_login: string | null;
  is_online: boolean;
  session_duration: string | null;
  avatar_url?: string | null;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    axios
      .get('https://ton-backend.onrender.com/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
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
  

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">👨‍💻 Liste des utilisateurs</h1>
      <table className="w-full table-auto border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Email</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Dernière connexion</th>
            <th className="border p-2">Durée session</th>
            <th className="border p-2">Avatar</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">
                {u.nom} {u.prenom}
              </td>
              <td className="border p-2">{u.is_online ? '✅' : '❌'}</td>
              <td className="border p-2">
                {u.last_login ? new Date(u.last_login).toLocaleString() : '—'}
              </td>
              <td className="border p-2">{u.session_duration ?? '—'}</td>
              <td className="border p-2">
                {u.avatar_url ? (
                  <img
                    src={u.avatar_url}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
