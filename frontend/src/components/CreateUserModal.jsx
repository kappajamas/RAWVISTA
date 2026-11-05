// src/components/CreateUserModal.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import { apiCreateUser } from "../libs/api";

export default function CreateUserModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "OPERATOR",
  });
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Completează prenume, nume, email și parolă.");
      return;
    }
    setSaving(true);
    try {
      const created = await apiCreateUser({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password, 
        role: form.role,
      });
      toast.success("Utilizator creat.");
      onCreated?.(created);
      onClose();
    } catch (err) {
      toast.error(err?.message || "Crearea a eșuat.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={stop}>
        <div className="modal-head">
          <h3 className="h6 m-0">Creează utilizator</h3>
          <button className="btn-close" onClick={onClose} aria-label="Închide" />
        </div>

        <form className="modal-body" onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Prenume</label>
              <input
                name="first_name"
                className="form-control"
                value={form.first_name}
                onChange={change}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Nume</label>
              <input
                name="last_name"
                className="form-control"
                value={form.last_name}
                onChange={change}
              />
            </div>

            <div className="col-md-7">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={change}
              />
            </div>
            <div className="col-md-5">
              <label className="form-label">Rol</label>
              <select
                name="role"
                className="form-select"
                value={form.role}
                onChange={change}
              >
                <option value="OPERATOR">OPERATOR</option>
                <option value="ADMINISTRATOR">ADMINISTRATOR</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Parolă</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={change}
              />
            </div>
          </div>

          <div className="modal-foot d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Renunță
            </button>
            <button className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? "Salvez…" : "Creează"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
