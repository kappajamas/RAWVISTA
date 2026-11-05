import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  apiAllProducts,
  apiTransactionById,
  apiUpdateTrxDescription,
  apiUpdateTrxFull,
} from "../libs/api";

export default function EditTransactionModal({ open, id, onClose, onUpdated }) {
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user?.role === "ADMINISTRATOR";

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const trx = await apiTransactionById(id);
        setForm({
          product_id: trx.product_id,
          type: trx.type,
          quantity: trx.quantity,
          description: trx.description || "",
        });
        if (isAdmin) {
          const prods = await apiAllProducts("");
          setProducts(prods);
        }
      } catch {
        toast.error("Nu pot încărca tranzacția.");
        onClose();
      }
    })();
  }, [open, id, isAdmin, onClose]);

  if (!open || !form) return null;

  const stop = (e) => e.stopPropagation();
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let updated;
      if (isAdmin) {
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
          setSaving(false);
          return;
        }
        updated = await apiUpdateTrxFull(id, {
          product_id: pid,
          type,
          quantity: qty,
          description: form.description?.trim() || null,
        });
      } else {
        updated = await apiUpdateTrxDescription(id, form.description ?? "");
      }
      toast.success("Tranzacție actualizată.");
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      toast.error(
        err?.message || err?.response?.data?.message || "Eroare la actualizare."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={stop}>
        <div className="modal-head">
          <h3 className="h6 m-0">Editează tranzacția #{id}</h3>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Închide"
          />
        </div>
        <form className="modal-body" onSubmit={submit}>
          {isAdmin ? (
            <div className="row g-3">
              <div className="col-md-7">
                <label className="form-label">Produs</label>
                <select
                  name="product_id"
                  className="form-select"
                  value={form.product_id}
                  onChange={change}
                >
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
                  rows="3"
                  className="form-control"
                  value={form.description}
                  onChange={change}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="mb-2">
                <em>Ca operator poți edita doar descrierea tranzacției.</em>
              </p>
              <label className="form-label">Descriere</label>
              <textarea
                name="description"
                rows="3"
                className="form-control"
                value={form.description}
                onChange={change}
              />
            </>
          )}

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
