import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./pages/Login";
import Flowchart from "./pages/Flowchart";
import Dashboard from "./pages/Dashboard";
import AddMembership from "./pages/AddMembership";
import UpdateMembership from "./pages/UpdateMembership";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import MyServices from "./pages/MyServices";      // ✅ NEW
import AddService from "./pages/AddService";      // ✅ NEW
import ProtectedRoute from "./components/ProtectedRoute";

/* 🔹 Layout Wrapper to control Navbar visibility */
function Layout() {
  const location = useLocation();

  // Hide Navbar on login & register pages
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROTECTED ROUTES ================= */}

        {/* ✅ Dashboard (Admin + User + Vendor) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "user", "vendor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Flowchart (Public if needed) */}
        <Route path="/flowchart" element={<Flowchart />} />

        {/* ================= ADMIN ONLY ================= */}

        <Route
          path="/add-membership"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddMembership />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-membership"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UpdateMembership />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN + USER ================= */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* ================= VENDOR ONLY ================= */}

        <Route
          path="/my-services"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <MyServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-service"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <AddService />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ROUTE ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;