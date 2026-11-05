// src/pages/AddProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiCreateProducts } from "../libs/api";

export default function AddProduct() {
  const nav = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user?.role === "ADMINISTRATOR";

  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "buc",
    stock: 0,
    stock_min: 0,
    rack: "",
    description: "",
    price: 0,
    image_url: "", 
  });
  const [saving, setSaving] = useState(false);

  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Doar administratorul poate crea produse.");
      return;
    }
    if (!form.name.trim() || !form.sku.trim()) {
      toast.error("Numele și SKU sunt obligatorii.");
      return;
    }
    setSaving(true);
    try {
      await apiCreateProducts({
        name: form.name.trim(),
        sku: form.sku.trim(),
        unit: form.unit || "buc",
        stock: Number(form.stock) || 0,
        stock_min: Number(form.stock_min) || 0,
        rack: form.rack?.trim() || null,
        description: form.description?.trim() || null,
        price: Number(form.price) || 0,
        image_url: form.image_url?.trim() || null, // 👈 nou
      });
      toast.success("Produs creat.");
      nav("/products");
    } catch (err) {
      toast.error(err?.message || "Eroare la creare.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h1 className="h5 mb-3">Creează produs</h1>
      {!isAdmin && (
        <p className="text-danger">Nu ai permisiunea de a crea produse.</p>
      )}

      <form className="form card p-3" onSubmit={submit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Denumire</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={change}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">SKU</label>
            <input
              name="sku"
              className="form-control"
              value={form.sku}
              onChange={change}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Unit</label>
            <input
              name="unit"
              className="form-control"
              value={form.unit}
              onChange={change}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Stoc</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={form.stock}
              onChange={change}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Stoc min</label>
            <input
              type="number"
              name="stock_min"
              className="form-control"
              value={form.stock_min}
              onChange={change}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Raft</label>
            <input
              name="rack"
              className="form-control"
              value={form.rack}
              onChange={change}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Descriere</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={form.description}
              onChange={change}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Preț (Lei)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              className="form-control"
              value={form.price}
              onChange={change}
            />
          </div>

          {/* Link imagine */}
          <div className="col-md-9">
            <label className="form-label">Link imagine (URL)</label>
            <input
              type="url"
              name="image_url"
              className="form-control"
              placeholder="https://exemplu/poza.jpg"
              value={form.image_url}
              onChange={change}
            />
            <div className="form-text">Folosește un URL accesibil public.</div>
          </div>

          {/* Preview mic (opțional) */}
          {form.image_url?.trim() && (
            <div className="col-12">
              <img
                src={form.image_url}
                alt="preview"
                style={{ maxHeight: 140, borderRadius: 6 }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Salvez…" : "Salvează"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => nav(-1)}
          >
            Renunță
          </button>
        </div>
      </form>
    </section>
  );
}
