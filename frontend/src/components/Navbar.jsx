import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut } from "../features/authSlice";

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  return (
    <header className="nav app-navigation">
      <div className="container nav__row">
        <Link to="/" className="nav__brand">
          RAWVISTA
        </Link>

        {!user ? (
          <nav className="nav__menu">
            <Link to="/register" className="btn btn--primary">
              Înregistrează-te
            </Link>
            <Link to="/login" className="btn">
              Loghează-te
            </Link>
          </nav>
        ) : (
          <nav className="nav__menu" style={{ gap: 10 }}>
            <NavLink to="/dashboard" className="nav__link">
              Dashboard
            </NavLink>
            <NavLink to="/products" className="nav__link">
              Produse
            </NavLink>
            <NavLink to="/transactions" className="nav__link">
              Tranzacții
            </NavLink>
            {user.role === "ADMINISTRATOR" && (
              <NavLink to="/users" className="nav__link">
                Utilizatori
              </NavLink>
            )}
            <button className="btn" onClick={() => dispatch(LogOut())}>
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
