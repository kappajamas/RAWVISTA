// src/pages/Users.jsx
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiAllUsers, apiDeleteUser } from "../libs/api";
import { filterByQuery, exportXLSX } from "../libs/utils";
import CreateUserModal from "../components/CreateUserModal";
import EditUserModal from "../components/EditUserModal";

// --- setări pentru search/export ---
const USER_SEARCH_FIELDS = ["id", "first_name", "last_name", "email", "role"];
const USER_COLUMNS = [
  { key: "id", label: "#" },
  { key: "first_name", label: "Prenume" },
  { key: "last_name", label: "Nume" },
  { key: "email", label: "Email" },
  { key: "role", label: "Rol" },
];
const USER_XLSX_FILE = "utilizatori.xlsx";

export default function Users() {
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user?.role === "ADMINISTRATOR";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [openCreate, setOpenCreate] = useState(false);

  // NEW: starea pentru modalul de editare
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const filtered = useMemo(
    () => filterByQuery(rows, USER_SEARCH_FIELDS, q),
    [rows, q]
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await apiAllUsers();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        toast.error(e?.message || "Nu pot încărca utilizatorii.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Sigur vrei să ștergi acest utilizator?")) return;
    try {
      await apiDeleteUser(id);
      setRows((prev) => prev.filter((r) => String(r.id) !== String(id)));
      toast.success("Utilizator șters.");
    } catch (e) {
      toast.error(e?.message || "Ștergerea a eșuat.");
    }
  };

  const onUpdated = (u) =>
    setRows((prev) => prev.map((r) => (r.id === u.id ? u : r)));

  if (!isAdmin) {
    return (
      <p className="text-danger">
        Doar administratorii pot vedea lista utilizatorilor.
      </p>
    );
  }
  if (loading) return <p>Se încarcă…</p>;

  return (
    <section>
      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
        <h2 className="h5 m-0">Utilizatori</h2>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <input
            className="form-control"
            style={{ maxWidth: 380 }}
            placeholder="Caută (nume, email, rol)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => exportXLSX(USER_XLSX_FILE, filtered, USER_COLUMNS)}
          >
            Export XLSX
          </button>

          <button
            className="btn btn-sm btn-primary"
            onClick={() => setOpenCreate(true)}
          >
            + Creează utilizator
          </button>
        </div>
      </div>

      {/* Tabel cu scroll (ai deja .table-scroll în CSS) */}
      <div className="table-scroll">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Prenume</th>
              <th>Nume</th>
              <th>Email</th>
              <th>Rol</th>
              <th style={{ width: 220 }}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Nu există utilizatori.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.first_name}</td>
                  <td>{u.last_name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setEditId(u.id);
                          setOpenEdit(true);
                        }}
                      >
                        Editează
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(u.id)}
                      >
                        Șterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal creare */}
      <CreateUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={(u) => setRows((prev) => [u, ...prev])}
      />

      {/* Modal editare */}
      <EditUserModal
        open={openEdit}
        id={editId}
        onClose={() => {
          setOpenEdit(false);
          setEditId(null);
        }}
        onUpdated={onUpdated}
      />
    </section>
  );
}
