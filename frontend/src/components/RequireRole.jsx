import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireRole({ allowed = [], children }) {
  const user = useSelector(s => s.auth.user);
  if (!user) return null; 
  return allowed.includes(user.role) ? children : <Navigate to="/dashboard" replace />;
}
