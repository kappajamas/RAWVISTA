// src/pages/Transactions.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiAllTransactions, apiDeleteTransaction } from "../libs/api";
import TransactionDetailsModal from "../components/TransactionDetailsModal";
import CreateTransactionModal from "../components/CreateTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import { filterByQuery, exportXLSX } from "../libs/utils";

// ---- CONST: câmpuri/coloane/export ----
const TRX_SEARCH_FIELDS = [
  "id",
  "product_name",
  "product_sku",
  "product_rack",
  "type",
  "quantity",
  "before_stock",
  "after_stock",
  "created_by",
  "description",
];

const TRX_COLUMNS = [
  { key: "id", label: "#" },
  { key: "product_id", label: "Produs ID" },
  { key: "product_name", label: "Produs" },
  { key: "product_sku", label: "SKU" },
  { key: "product_rack", label: "Raft" },
  { key: "type", label: "Tip" },
  { key: "quantity", label: "Cantitate" },
  { key: "delta", label: "Δ" },
  { key: "before_stock", label: "Stoc înainte" },
  { key: "after_stock", label: "Stoc după" },
  { key: "created_by", label: "Creat de" },
  {
    key: "created_at",
    label: "Data",
    format: (v) => (v ? new Date(v).toLocaleString() : ""),
  },
  { key: "description", label: "Descriere" },
];
const TRX_XLSX_FILE = "tranzactii.xlsx";

export default function Transactions() {
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user?.role === "ADMINISTRATOR";
  const canManage = (t) => isAdmin || user?.id === t.user_id;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDetails, setOpenDetails] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  
  const [q, setQ] = useState("");
  const decorate = (t) => ({
    ...t,
    product_name: t.product_name ?? `#${t.product_id}`,
    created_by: t.created_by ?? `user#${t.user_id}`,
  });
  const filtered = filterByQuery(rows, TRX_SEARCH_FIELDS, q);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiAllTransactions();
        setRows(data.map(decorate));
      } catch {
        toast.error("Nu pot încărca tranzacțiile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Sigur vrei să ștergi tranzacția?")) return;
    try {
      await apiDeleteTransaction(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("Tranzacție ștearsă.");
    } catch (e) {
      toast.error(e?.message || "Ștergerea a eșuat.");
    }
  };

  const onCreated = (trx) => setRows((prev) => [decorate(trx), ...prev]);
  const onUpdated = (trx) =>
    setRows((prev) => prev.map((r) => (r.id === trx.id ? decorate(trx) : r)));

  if (loading) return <p>Se încarcă…</p>;

  return (
    <div>
      {/* Toolbar: titlu + căutare + export + creare */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="h5 m-0">Tranzacții</h2>

        <div className="d-flex flex-wrap gap-2">
          <input
            className="form-control"
            style={{ maxWidth: 420 }}
            placeholder="Caută (produs, SKU, tip, utilizator, descriere)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => exportXLSX(TRX_XLSX_FILE, filtered, TRX_COLUMNS)}
          >
            Export XLSX
          </button>

          {user && ["ADMINISTRATOR", "OPERATOR"].includes(user.role) && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setOpenCreate(true)}
            >
              + Creează tranzacție
            </button>
          )}
        </div>
      </div>

      <div className="table-scroll">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Produs</th>
              <th>Tip</th>
              <th>Cant.</th>
              <th>Δ</th>
              <th>Stoc (înainte → după)</th>
              <th>Creat de</th>
              <th>Data</th>
              <th style={{ width: 260 }}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Nu există tranzacții.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>
                    {t.product_name}{" "}
                    <small className="text-body-secondary">
                      ({t.product_sku})
                    </small>
                    {t.product_rack && (
                      <div className="small text-body-secondary">
                        rack: {t.product_rack}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        t.type === "IN" ? "text-bg-success" : "text-bg-danger"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td>{t.quantity}</td>
                  <td>{t.delta}</td>
                  <td>
                    {t.before_stock} → {t.after_stock}
                  </td>
                  <td>{t.created_by ?? "-"}</td>
                  <td>
                    {t.created_at
                      ? new Date(t.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          setDetailRow(t);
                          setOpenDetails(true);
                        }}
                      >
                        Detalii
                      </button>

                      {canManage(t) && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setEditId(t.id);
                              setOpenEdit(true);
                            }}
                          >
                            Editează
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(t.id)}
                          >
                            Șterge
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modaluri */}
      <TransactionDetailsModal
        open={openDetails}
        item={detailRow}
        onClose={() => {
          setOpenDetails(false);
          setDetailRow(null);
        }}
      />

      <CreateTransactionModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={onCreated}
      />

      <EditTransactionModal
        open={openEdit}
        id={editId}
        onClose={() => {
          setOpenEdit(false);
          setEditId(null);
        }}
        onUpdated={onUpdated}
      />
    </div>
  );
}
