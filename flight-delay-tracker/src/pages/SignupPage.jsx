import React from 'react';
import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importar useAuth

const SignupPage = () => {
  const { signInWithGoogle } = useAuth(); // Obtener la función de useAuth

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Error al registrarse con Google:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
      // Supabase se encargará de la redirección
    } catch (error) {
      console.error('Error inesperado al registrarse con Google:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <AuthForm isSignUp={true} />
      <button
        onClick={handleGoogleSignIn}
        style={{ padding: '0.75rem', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: 'calc(100% - 2rem)', maxWidth: '300px' }}
      >
        Continuar con Google
      </button>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default SignupPage;
