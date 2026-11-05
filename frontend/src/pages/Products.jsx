import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiAllProducts, apiDeleteProducts } from "../libs/api";
import ProductDetailsModal from "../components/ProductDetailsModal";
import { filterByQuery, exportXLSX } from "../libs/utils";


const PRODUCT_SEARCH_FIELDS = [
  "id",
  "name",
  "sku",
  "unit",
  "rack",
  "created_by",
  "description",
];

const PRODUCT_COLUMNS = [
  { key: "id", label: "#" },
  { key: "name", label: "Denumire" },
  { key: "sku", label: "SKU" },
  { key: "unit", label: "Unitate" },
  { key: "stock", label: "Stoc" },
  { key: "stock_min", label: "Stoc Min" },
  { key: "rack", label: "Raft" },
  { key: "price", label: "Preț (Lei)", format: (v) => Number(v).toFixed(2) },
  { key: "created_by", label: "Creat de" },
  {
    key: "updated_at",
    label: "Actualizat",
    format: (v) => (v ? new Date(v).toLocaleString() : ""),
  },
  { key: "description", label: "Descriere" },
];
const PRODUCT_XLSX_FILE = "produse.xlsx";

export default function Products() {
  const nav = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user?.role === "ADMINISTRATOR";
  const canManage = (p) => isAdmin || user?.id === p.user_id;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);

  const [q, setQ] = useState("");
  const filtered = filterByQuery(rows, PRODUCT_SEARCH_FIELDS, q);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiAllProducts();
        setRows(data);
      } catch {
        toast.error("Nu se pot încărca produsele.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Sigur vrei să ștergi produsul?")) return;
    try {
      await apiDeleteProducts(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("Produs șters.");
    } catch (e) {
      toast.error(e?.message || "Ștergerea a eșuat.");
    }
  };

  const openDetails = (p) => {
    setSel(p);
    setOpen(true);
  };
  const closeDetails = () => {
    setOpen(false);
    setSel(null);
  };

  if (loading) return <p>Se încarcă…</p>;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="h5 m-0">Produse</h2>

        <div className="d-flex flex-wrap gap-2">
          <input
            className="form-control"
            style={{ maxWidth: 380 }}
            placeholder="Caută (nume, SKU, raft, autor, descriere)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() =>
              exportXLSX(PRODUCT_XLSX_FILE, filtered, PRODUCT_COLUMNS)
            }
          >
            Export XLSX
          </button>

          {isAdmin && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => nav("/products/add")}
            >
              + Creează produs
            </button>
          )}
        </div>
      </div>

      <div className="table-scroll">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Denumire</th>
              <th>SKU</th>
              <th>Unit</th>
              <th>Stoc</th>
              <th>Min</th>
              <th>Raft</th>
              <th>Preț (Lei)</th>
              <th>Creat de</th>
              <th>Actualizat</th>
              <th style={{ width: 240 }}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center">
                  Nu există produse.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.unit}</td>
                  <td
                    className={
                      p.stock < p.stock_min ? "text-danger fw-semibold" : ""
                    }
                  >
                    {p.stock}
                  </td>
                  <td>{p.stock_min}</td>
                  <td>{p.rack ?? "-"}</td>
                  <td>{Number(p.price).toFixed(2)}</td>
                  <td>{p.created_by ?? "-"}</td>
                  <td>
                    {p.updated_at
                      ? new Date(p.updated_at).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openDetails(p)}
                      >
                        Detalii
                      </button>

                      {canManage(p) && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => nav(`/products/edit/${p.id}`)}
                          >
                            Editează
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(p.id)}
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

      <ProductDetailsModal open={open} item={sel} onClose={closeDetails} />
    </div>
  );
}
