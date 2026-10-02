import { Navigate, Route, Routes } from "react-router-dom";
import { isAuthenticated } from "./services/authService";
import LoginView from "./views/auth/LoginView";
import DashboardView from "./views/dashboard/DashboardView";
import AcademicDirectoryView from "./views/academic/AcademicDirectoryView";

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facultes"
        element={
          <ProtectedRoute>
            <AcademicDirectoryView resource="facultes" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/departements"
        element={
          <ProtectedRoute>
            <AcademicDirectoryView resource="departements" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/promotions"
        element={
          <ProtectedRoute>
            <AcademicDirectoryView resource="promotions" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/filieres"
        element={
          <ProtectedRoute>
            <AcademicDirectoryView resource="filieres" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/etudiants"
        element={
          <ProtectedRoute>
            <AcademicDirectoryView resource="etudiants" />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
