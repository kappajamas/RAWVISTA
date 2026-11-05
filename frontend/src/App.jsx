import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";

import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users"; 
import Footer from "./components/Footer";
import AddProduct from "./pages/AddProducts";
import EditProduct from "./pages/EditProducts";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="section">
        <div className="container">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/products"
              element={
                <RequireAuth>
                  <Products />
                </RequireAuth>
              }
            />
            <Route
              path="/transactions"
              element={
                <RequireAuth>
                  <Transactions />
                </RequireAuth>
              }
            />

            <Route
              path="/users"
              element={
                <RequireAuth>
                  <RequireRole allowed={["ADMINISTRATOR"]}>
                    <Users />
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
            <Route
              path="/products"
              element={
                <RequireAuth>
                  <Products />
                </RequireAuth>
              }
            />
            <Route
              path="/products/add"
              element={
                <RequireAuth>
                  <AddProduct />
                </RequireAuth>
              }
            />
            <Route
              path="/products/edit/:id"
              element={
                <RequireAuth>
                  <EditProduct />
                </RequireAuth>
              }
            />
            <Route
              path="/transactions"
              element={
                <RequireAuth>
                  <Transactions />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
        <Footer />
      </main>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}
