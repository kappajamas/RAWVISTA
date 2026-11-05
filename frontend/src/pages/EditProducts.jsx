// src/pages/EditProduct.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiProductsId, apiUpdateProducts } from "../libs/api";

export default function EditProduct() {
  const { id } = useParams();
  const nav = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [item, setItem] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await apiProductsId(id);
        const isAdmin = user?.role === "ADMINISTRATOR";
        const isOwner = user?.id === p.user_id;
        if (!isAdmin && !isOwner) {
          toast.error("Nu ai voie să editezi acest produs.");
          nav("/products", { replace: true });
          return;
        }
        setItem({
          name: p.name || "",
          sku: p.sku || "",
          unit: p.unit || "buc",
          stock: p.stock ?? 0,
          stock_min: p.stock_min ?? 0,
          rack: p.rack || "",
          description: p.description || "",
          price: p.price ?? 0,
          image_url: p.image_url || "", 
        });
      } catch (e) {
        toast.error("Produsul nu există.");
        nav("/products", { replace: true });
      }
    })();
  }, [id, nav, user]);

  if (!item) return <p>Se încarcă…</p>;

  const change = (e) =>
    setItem((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiUpdateProducts(id, {
        name: item.name.trim(),
        sku: item.sku.trim(),
        unit: item.unit || "buc",
        stock: Number(item.stock) || 0,
        stock_min: Number(item.stock_min) || 0,
        rack: item.rack?.trim() || null,
        description: item.description?.trim() || null,
        price: Number(item.price) || 0,
        image_url: item.image_url?.trim() || null, 
      });
      toast.success("Produs actualizat.");
      nav("/products");
    } catch (err) {
      toast.error(err?.message || "Eroare la actualizare.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h1 className="h5 mb-3">Editează produs #{id}</h1>

      <form className="form card p-3" onSubmit={submit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Denumire</label>
            <input
              name="name"
              className="form-control"
              value={item.name}
              onChange={change}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">SKU</label>
            <input
              name="sku"
              className="form-control"
              value={item.sku}
              onChange={change}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Unit</label>
            <input
              name="unit"
              className="form-control"
              value={item.unit}
              onChange={change}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Stoc</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={item.stock}
              onChange={change}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Stoc min</label>
            <input
              type="number"
              name="stock_min"
              className="form-control"
              value={item.stock_min}
              onChange={change}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Rack</label>
            <input
              name="rack"
              className="form-control"
              value={item.rack}
              onChange={change}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Descriere</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={item.description}
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
              value={item.price}
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
              value={item.image_url}
              onChange={change}
            />
            <div className="form-text">Folosește un URL accesibil public.</div>
          </div>

          {/* Preview mic (opțional) */}
          {item.image_url?.trim() && (
            <div className="col-12">
              <img
                src={item.image_url}
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
