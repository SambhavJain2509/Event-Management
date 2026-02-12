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

        {/* Dashboard (Admin + User) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/flowchart" element={<Flowchart />} />

        {/*  Add Membership (Admin Only) */}
        <Route
          path="/add-membership"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddMembership />
            </ProtectedRoute>
          }
        />

        {/* Update Membership (Admin Only) */}
        <Route
          path="/update-membership"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UpdateMembership />
            </ProtectedRoute>
          }
        />

        {/* Reports (Admin + User) */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Transactions (Admin + User) */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Transactions />
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
