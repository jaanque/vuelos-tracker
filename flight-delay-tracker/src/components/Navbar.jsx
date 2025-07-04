import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      // La redirección se maneja automáticamente por ProtectedRoute y App.jsx al cambiar el estado de `user`
      // Opcionalmente, puedes forzar una redirección aquí si es necesario:
      // navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>Flight Delay Tracker</div>
        <div style={styles.navLinks}>Cargando...</div>
      </nav>
    );
  }

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.navBrand}>Flight Delay Tracker</Link>
      <div style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>Inicio</Link>
        <Link to="/leaderboard" style={styles.navLink}>Leaderboard</Link>
        {user ? (
          <>
            <Link to="/profile" style={styles.navLink}>Perfil</Link>
            <button onClick={handleLogout} style={styles.navButton}>Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/signup" style={styles.navLink}>Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#333',
    color: 'white',
  },
  navBrand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '1.5rem',
  },
  navButton: {
    marginLeft: '1.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default Navbar;
