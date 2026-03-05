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
import MyServices from "./pages/MyServices";
import AddService from "./pages/AddService";
import ViewServices from "./pages/ViewServices";          
import MyBookings from "./pages/MyBookings";     
import ProtectedRoute from "./components/ProtectedRoute";

/* 🔹 Layout Wrapper to control Navbar visibility */
function Layout() {
  const location = useLocation();

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

        {/* Dashboard (Admin + User + Vendor) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "user", "vendor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

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

        {/* ================= USER ONLY ================= */}

        {/* View Vendor Services */}
        <Route
          path="/services"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ViewServices />
            </ProtectedRoute>
          }
        />

        {/* View My Bookings */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyBookings />
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

        {/* ================= FALLBACK ================= */}

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