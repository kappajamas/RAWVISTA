import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, STATUS } from "../features/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/dashboard";
  const loading = useSelector((s) => s.auth.status) === STATUS.loading;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    const next = { email: "", password: "", general: "" };
    if (!email.trim()) next.email = "Emailul este obligatoriu.";
    if (!password) next.password = "Parola este obligatorie.";

    if (next.email || next.password) {
      setErrors(next);
      toast.error("Te rugăm să completezi câmpurile.");
      return;
    }

    setErrors({ email: "", password: "", general: "" });

    try {
      await dispatch(LoginUser({ email: email.trim(), password })).unwrap();
      toast.success("Autentificat!");
      nav(from, { replace: true });
    } catch (err) {
      const msg =
        err?.message || err?.payload?.message || "Email sau parolă incorecte.";
      setErrors((p) => ({ ...p, general: msg }));
      toast.error(msg);
    }
  };

  return (
    <section>
      <h1 className="title">Logare</h1>

      <form className="form card" onSubmit={onSubmit} noValidate>
        {errors.general && (
          <div className="form__error" style={{ marginBottom: 10 }}>
            {errors.general}
          </div>
        )}

        <div className="form__group">
          <label className="label">Email</label>
          <input
            className={`input ${errors.email ? "input--invalid" : ""}`}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="form__error">{errors.email}</p>}
        </div>

        <div className="form__group">
          <label className="label">Parolă</label>
          <input
            type="password"
            className={`input ${errors.password ? "input--invalid" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="form__error">{errors.password}</p>}
        </div>

        <button className="btn btn--primary" disabled={loading}>
          {loading ? "Se încarcă…" : "Login"}
        </button>
      </form>
    </section>
  );
}
