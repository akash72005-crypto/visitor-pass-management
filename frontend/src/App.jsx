import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import VisitorForm from "./pages/VisitorForm";
import VisitorPass from "./pages/VisitorPass";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import VisitorSearch from "./pages/VisitorSearch";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* RECEPTIONIST */}
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute role="receptionist">
            <ReceptionistDashboard />
          </ProtectedRoute>
        }
      />

      {/* EMPLOYEE */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute role="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* VISITOR REGISTRATION */}
      <Route
        path="/visitor"
        element={
          <ProtectedRoute role="receptionist">
            <VisitorForm />
          </ProtectedRoute>
        }
      />

      {/* SEARCH */}
      <Route
        path="/search"
        element={
          <ProtectedRoute role="admin">
            <VisitorSearch />
          </ProtectedRoute>
        }
      />

      {/* REPORTS */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute role="admin">
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* VISITOR PASS */}
      <Route
        path="/pass/:id"
        element={
          <ProtectedRoute>
            <VisitorPass />
          </ProtectedRoute>
        }
      />

    <Route
  path="/users"
  element={
    <ProtectedRoute role="admin">
      <UserManagement />
    </ProtectedRoute>
  }
/>
<Route
  path="/visitor-pass/:id"
  element={<VisitorPass />}
/>
      {/* INVALID URL */}
      <Route
        path="*"
        element={
          <div
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >
            <h1>404</h1>
            <p>Page not found</p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;