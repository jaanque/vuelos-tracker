import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Flight Delay Tracker. Todos los derechos reservados (o no).</p>
      {/* Podríamos añadir más enlaces o información aquí si es necesario */}
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center',
    padding: '1rem',
    marginTop: '2rem',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e7e7e7',
    position: 'relative', // O 'fixed' si quieres que esté siempre abajo
    bottom: 0,
    width: '100%',
  }
};

export default Footer;
