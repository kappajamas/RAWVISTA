export default function ProductDetailsModal({ open, item, onClose }) {
  if (!open || !item) return null;

  const stop = (e) => e.stopPropagation();
  const hasDescription = (item.description ?? "").toString().trim().length > 0; 

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal--narrow" onClick={stop}>
        <div className="modal-head">
          <h3 className="h6 m-0">Detalii produs #{item.id}</h3>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Închide"
          />
        </div>

        <div className="modal-body">
          {/* Imagine (dacă există) */}
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.name}
              className="pd-img"
              loading="lazy"
            />
          )}

          <p>
            <strong>Denumire:</strong> {item.name}
          </p>
          <p>
            <strong>SKU:</strong> {item.sku}
          </p>
          <p>
            <strong>Unit:</strong> {item.unit}
          </p>
          <p>
            <strong>Stoc:</strong> {item.stock} (min: {item.stock_min})
          </p>
          <p>
            <strong>Raft (rack):</strong> {item.rack ?? "-"}
          </p>
          <p>
            <strong>Preț:</strong> {Number(item.price).toFixed(2)} <strong>Lei</strong>
          </p>
          <p>
            <strong>Creat de:</strong> {item.created_by ?? "-"}
          </p>
          <p>
            <strong>Actualizat:</strong>{" "}
            {item.updated_at ? new Date(item.updated_at).toLocaleString() : "-"}
          </p>

          <p className="mt-3">
            <strong>Descriere:</strong>
            <br />
            {hasDescription ? item.description : <em>Fără descriere</em>}
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
