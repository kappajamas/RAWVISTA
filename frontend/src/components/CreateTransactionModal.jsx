import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { apiAllProducts, apiCreateTransaction } from "../libs/api";

export default function CreateTransactionModal({ open, onClose, onCreated }) {
  const user = useSelector((s) => s.auth.user);
  const canCreate = !!user && ["ADMINISTRATOR", "OPERATOR"].includes(user.role);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    type: "IN",
    quantity: 1,
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const data = await apiAllProducts("");
        setProducts(data);
      } catch {
        toast.error("Nu se pot încărca produsele.");
      }
    })();
  }, [open]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!canCreate) {
      toast.error("Nu ai voie să creezi tranzacții.");
      return;
    }

    const pid = Number(form.product_id);
    const qty = Number(form.quantity);
    const type = String(form.type || "").toUpperCase();

    if (
      !pid ||
      !["IN", "OUT"].includes(type) ||
      !Number.isInteger(qty) ||
      qty <= 0
    ) {
      toast.error("Completează corect produsul, tipul și cantitatea (>0).");
      return;
    }

    setSaving(true);
    try {
      const trx = await apiCreateTransaction({
        product_id: pid,
        type,
        quantity: qty,
        description: form.description?.trim() || null,
      });
      toast.success("Tranzacție creată.");
      onCreated?.(trx);
      onClose();
      setForm({ product_id: "", type: "IN", quantity: 1, description: "" });
    } catch (err) {
      toast.error(err?.message || "Eroare la creare.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={stop}>
        <div className="modal-head">
          <h3 className="h6 m-0">Creează tranzacție</h3>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Închide"
          />
        </div>
        <form className="modal-body" onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-7">
              <label className="form-label">Produs</label>
              <select
                name="product_id"
                className="form-select"
                value={form.product_id}
                onChange={change}
              >
                <option value="">— alege produs —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} · {p.name} · {p.sku}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label">Tip</label>
              <select
                name="type"
                className="form-select"
                value={form.type}
                onChange={change}
              >
                <option value="IN">IN (intrare)</option>
                <option value="OUT">OUT (ieșire)</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Cantitate</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={form.quantity}
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
