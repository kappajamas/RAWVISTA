import { data } from "react-router-dom";
import api from "./axios";

export const apiMe = () =>
  api.get("/api/auth/me").then((response) => response.data);
export const apiRegister = (data) =>
  api.post("/api/auth/register", data).then((response) => response.data);
export const apiLogin = (email, password) =>
  api
    .post("/api/auth/login", { email, password })
    .then((response) => response.data);
export const apiLogout = () =>
  api.delete("/api/auth/logout").then((response) => response.data);

export const apiAllProducts = () =>
  api.get("/api/products").then((response) => response.data);
export const apiProductsId = (id) =>
  api.get(`/api/products/${id}`).then((response) => response.data);
export const apiCreateProducts = (data) =>
  api.post("/api/products", data).then((response) => response.data);
export const apiUpdateProducts = (id, data) =>
  api.put(`/api/products/${id}`, data).then((response) => response.data);
export const apiDeleteProducts = (id) =>
  api.delete(`/api/products/${id}`).then((response) => response.data);

export const apiAllUsers = () =>
  api.get("/api/users").then((response) => response.data);
export const apiUserById = (id) =>
  api.get(`/api/users/${id}`).then((response) => response.data);
export const apiCreateUser = (data) =>
  api.post("/api/users", data).then((response) => response.data);
export const apiUpdateUser = (id, data) =>
  api.patch(`/api/users/${id}`, data).then((response) => response.data);
export const apiDeleteUser = (id) =>
  api.delete(`/api/users/${id}`).then((response) => response.data);

export const apiAllTransactions = () =>
  api.get("/api/transactions").then((response) => response.data);
export const apiTransactionById = (id) =>
  api.get(`/api/transactions/${id}`).then((response) => response.data);
export const apiTransactionsByProduct = (productId) =>
  api
    .get(`/api/transactions/product/${productId}`)
    .then((response) => response.data);
export const apiCreateTransaction = (data) =>
  api.post("/api/transactions", data).then((response) => response.data);
export const apiUpdateTrxDescription = (id, description) =>
  api.patch(`/api/transactions/${id}/description`, { description })
     .then(r => r.data);

export const apiUpdateTrxFull = (id, data) =>
  api.patch(`/api/transactions/${id}`, data)
     .then(r => r.data);
export const apiDeleteTransaction = (id) =>
  api.delete(`/api/transactions/${id}`).then((response) => response.data);

