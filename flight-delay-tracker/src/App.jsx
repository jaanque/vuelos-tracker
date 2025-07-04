import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; // Importar Navbar
import Footer from './components/Footer'; // Importar Footer

// Placeholder para páginas futuras
const DashboardPage = () => {
  const { user } = useAuth(); // signOut ya no se necesita aquí, está en Navbar
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Dashboard</h2>
      <p>Bienvenido, {user?.email}</p>
      {/* Aquí irá el formulario para registrar vuelo y el historial */}
      <p>Contenido principal del dashboard...</p>
    </div>
  );
};
const LeaderboardPage = () => <div style={{ padding: '1rem' }}><h2>Leaderboard</h2><p>Ranking de usuarios...</p></div>;
const ProfilePage = () => <div style={{ padding: '1rem' }}><h2>Perfil del Usuario</h2><p>Detalles y vuelos registrados...</p></div>;

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando aplicación...</div>; // O un spinner más elaborado
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        <Routes>
          {/* Rutas Públicas */}
          {/* Redirigir a dashboard si el usuario ya está logueado y trata de acceder a login/signup */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <SignupPage />}
          />

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback para rutas no encontradas (opcional pero recomendado) */}
          {/* Podría ser una página 404 dedicada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
