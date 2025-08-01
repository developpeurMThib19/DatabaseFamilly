import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AjouterProduit from "./pages/AjouterProduit";
import Historique from './pages/Historique';
import PrivateRoute from "./components/PrivateRoute";
import ProduitDetail from "./pages/ProduitDetail";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminUsersPage from "./pages/AdminUsersPage";

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/connexion" replace />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/ajouter-produit" element={<AjouterProduit />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/produit/:id" element={<ProduitDetail />} />
        </Route>
        <Route path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminUsersPage />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;