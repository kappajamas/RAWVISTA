export default function TransactionDetailsModal({ open, item, onClose }) {
  if (!open || !item) return null;
  const stop = (e) => e.stopPropagation();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={stop}>
        <div className="modal-head">
          <h3 className="h6 m-0">Detalii tranzacție #{item.id}</h3>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Închide"
          />
        </div>
        <div className="modal-body">
          <p>
            <strong>Produs:</strong> {item.product_name} (SKU:{" "}
            {item.product_sku})
          </p>
          <p>
            <strong>Tip:</strong> {item.type}
          </p>
          <p>
            <strong>Cantitate:</strong> {item.quantity} (delta: {item.delta})
          </p>
          <p>
            <strong>Stoc înainte:</strong> {item.before_stock} •{" "}
            <strong>după:</strong> {item.after_stock}
          </p>
          <p>
            <strong>Rack:</strong> {item.product_rack ?? "-"}
          </p>
          <p>
            <strong>Creat de:</strong> {item.created_by ?? "-"}
          </p>
          <p>
            <strong>La:</strong> {new Date(item.created_at).toLocaleString()}
          </p>

          <p className="mt-3">
            <strong>Descriere:</strong>
            <br />
            {item.description?.trim() ? (
              item.description
            ) : (
              <em>Fără descriere</em>
            )}
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}
