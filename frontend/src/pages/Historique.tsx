import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Types
interface JwtPayload {
  userId: number;
  nom: string;
  prenom: string;
  email: string;
}

interface Produit {
  id: number;
  titre: string;
  prix: string;
  prix_revente?: string;
  image_url: string;
  date_achat: string;
  vendu: boolean;
}

export default function Historique() {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      setUser(decoded);

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/produits`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data.map((p: any) => ({
            ...p,
            vendu: p.vendu === true || p.vendu === "true",
          }));
          setProduits(data);
        })
        .catch((err) => console.error("Erreur produits :", err));
    }
  }, []);

  const produitsVendus = produits.filter((p) => p.vendu);
  const produitsDisponibles = produits.filter((p) => !p.vendu);
  //const totalDisponibles = produitsDisponibles.reduce((sum, p) => sum + parseFloat(p.prix), 0);


  const totalVendus = produitsVendus.reduce(
    (sum, p) => sum + parseFloat(p.prix),
    0
  );
  const totalVentes = produitsVendus.reduce(
    (sum, p) => sum + (p.prix_revente ? parseFloat(p.prix_revente) : 0),
    0
  );
  const pourcentage =
    totalVendus === 0 ? 0 : ((totalVentes - totalVendus) / totalVendus) * 100;

  const totalAchatsDisponibles = produitsDisponibles.reduce((total, produits) => {
    return total + parseFloat(produits.prix);
  }, 0);

  return (
    <div className="min-h-screen bg-[#f3ede1] text-[#324B3A] px-8 py-10 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6">
        Historique des produits
      </h1>

      {user && (
        <p className="text-center text-lg mb-4">
          Bienvenue, <strong>{user.nom} {user.prenom}</strong>
        </p>
      )}

      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/home")}
          className="bg-[#324B3A] hover:bg-[#2a3f31] text-white font-semibold py-2 px-5 rounded-full transition"
        >
          ← Retour à l’accueil
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Produits disponibles */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            🛒 Produits disponibles
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-separate border-spacing-y-2">
              <thead className="text-[#324B3A] font-semibold">
                <tr>
                  <th>Image</th>
                  <th>Titre</th>
                  <th>Prix</th>
                  <th>Date d'achat</th>
                </tr>
              </thead>
              <tbody>
                {produitsDisponibles.map((p) => (
                  <tr
                    key={p.id}
                    className="bg-[#f3ede1] rounded hover:scale-105 transition-transform"
                  >
                    <td>
                      <img
                        src={p.image_url || '/default-image.jpg'}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </td>
                    <td>{p.titre}</td>
                    <td>{parseFloat(p.prix).toFixed(2)} €</td>
                    <td>{new Date(p.date_achat).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 space-y-2 font-semibold text-[#D99C83]">
              💸 Total achat : -{totalAchatsDisponibles.toFixed(2)} €
          </p>
        </div>

        {/* Produits vendus */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            ✅ Produits vendus
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-separate border-spacing-y-2">
              <thead className="text-[#324B3A] font-semibold">
                <tr>
                  <th>Image</th>
                  <th>Titre</th>
                  <th>Prix achat</th>
                  <th>Prix vente</th>
                  <th>Date achat</th>
                  <th>Date vente</th>
                </tr>
              </thead>
              <tbody>
                {produitsVendus.map((p) => (
                  <tr
                    key={p.id}
                    className="bg-[#f3ede1] rounded hover:scale-105 transition-transform"
                  >
                    <td>
                      <img
                        src={p.image_url || '/default-image.jpg'}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </td>
                    <td>{p.titre}</td>
                    <td>{parseFloat(p.prix).toFixed(2)} €</td>
                    <td>
                      {p.prix_revente
                        ? `${parseFloat(p.prix_revente).toFixed(2)} €`
                        : "—"}
                    </td>
                    <td>{new Date(p.date_achat).toLocaleDateString()}</td>
                    <td>{new Date(p.date_achat).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => navigate(`/produit/${p.id}`)} 
                        className="text-sm text-blue-600 hover:underline">
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Résumé */}
          <div className="mt-6 space-y-2 font-semibold">
            <p className="text-[#D99C83]">
              💸 Total achat : -{totalVendus.toFixed(2)} €
            </p>
            <p className="text-[#A8C3A0]">
              💰 Total ventes : +{totalVentes.toFixed(2)} €
            </p>
            <p className={pourcentage >= 0 ? "text-[#A8C3A0]" : "text-[#D99C83]"}>
              🧱 Profit : {(totalVentes - totalVendus).toFixed(2)} €
            </p>
            <p className="text-[#324B3A]">
              🔁 Rendement :
              <span
                className={
                  pourcentage >= 0 ? "text-[#A8C3A0] ml-1" : "text-[#D99C83] ml-1"
                }
              >
                {totalVendus === 0 ? "—" : `${pourcentage.toFixed(2)} %`}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
