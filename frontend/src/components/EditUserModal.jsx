// src/components/EditUserModal.jsx
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiUserById, apiUpdateUser } from "../libs/api";

export default function EditUserModal({ open, id, onClose, onUpdated }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !id) return;
    (async () => {
      try {
        const u = await apiUserById(id);
        setForm({
          first_name: u.first_name || "",
          last_name: u.last_name || "",
          email: u.email || "",
          role: u.role || "OPERATOR",
        });
      } catch (e) {
        toast.error(e?.message || "Nu pot încărca utilizatorul.");
        onClose?.();
      }
    })();
  }, [open, id, onClose]);

  if (!open || !form) return null;

  const stop = (e) => e.stopPropagation();
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim()
    ) {
      toast.error("Prenume, nume și email sunt obligatorii.");
      return;
    }
    setSaving(true);
    try {
      const updated = await apiUpdateUser(id, {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        role: form.role, // "ADMINISTRATOR" | "OPERATOR"
      });
      toast.success("Utilizator actualizat.");
      onUpdated?.(updated);
      onClose?.();
    } catch (err) {
      toast.error(err?.message || "Eroare la actualizare.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={stop}>
        <div className="modal-head">
          <h3 className="h6 m-0">Editează utilizator #{id}</h3>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Închide"
          />
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
              {saving ? "Salvez…" : "Salvează"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
