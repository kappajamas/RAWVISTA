import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getMe, STATUS } from "../features/authSlice";

export default function RequireAuth({ children }) {
  const { user, status } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const loc = useLocation();

  useEffect(() => {
    if (!user && status === STATUS.idle) dispatch(getMe());
  }, [user, status, dispatch]);

  if (status === STATUS.loading) return <div>Se încarcă…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}
