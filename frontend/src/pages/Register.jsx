import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RegisterUser, STATUS } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const loading = status === STATUS.loading;

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "OPERATOR",
  });

  const onChange = (event) =>
    setForm((prevForm) => ({
      ...prevForm,
      [event.target.name]: event.target.value,
    }));

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(RegisterUser(form)).unwrap();
      toast.success("Contul a fost creat! Te-ai logat automat.");
      nav("/dashboard");
    } catch (err) {
      toast.error(err?.message || "Eroare la inregistrare!");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="card p-4 shadow-sm">
        <h1 className="h4 mb-3">Înregistrare</h1>

        <div className="mb-3">
          <label className="form-label">Prenume</label>
          <input
            className="form-control"
            name="first_name"
            value={form.first_name}
            onChange={onChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nume</label>
          <input
            className="form-control"
            name="last_name"
            value={form.last_name}
            onChange={onChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            name="email"
            value={form.email}
            onChange={onChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Parolă</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={onChange}
          />
        </div>

        <button className="btn btn--primary" disabled={loading}>
          {loading ? "Se încarcă…" : "Creează cont"}
        </button>
      </div>
    </form>
  );
}
