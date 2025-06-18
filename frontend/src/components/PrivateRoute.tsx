import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute() {
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/login" />;

    try {
        const decoded: any = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }

        return <Outlet />;
    } catch {
        localStorage.removeItem('token');
        return <Navigate to='/login' />
    }
}