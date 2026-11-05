import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const resp = err?.response;
    const msg =
      resp?.data?.message ||
      resp?.data?.error ||
      (resp?.status === 404
        ? "Resursa nu a fost găsită."
        : resp?.status === 401
        ? "Nu ești autentificat."
        : resp?.status === 403
        ? "Nu ai permisiuni pentru acțiunea asta."
        : "Eroare de server.");

    err.message = msg;
    err.status = resp?.status;
    return Promise.reject(err);
  }
);

export default api;
