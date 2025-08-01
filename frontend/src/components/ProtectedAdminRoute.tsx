import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface TokenPayload {
  userId: number;
  email: string;
  nom: string;
  prenom: string;
  is_admin: boolean;
  iat: number;
  exp: number;
}

const ProtectedAdminRoute = ({ children }: Props) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (!decoded.is_admin) return <Navigate to="/unauthorized" />;
  } catch (e) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
