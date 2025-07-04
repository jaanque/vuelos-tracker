import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthForm = ({ isSignUp = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({ email, password });
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
      }

      if (response.error) {
        throw response.error;
      }

      if (isSignUp && response.data.user && response.data.user.identities && response.data.user.identities.length === 0) {
        // This case might indicate a user exists but is unconfirmed, Supabase sometimes returns a user object without error.
        // Or, if email confirmation is required, this is the expected behavior.
        setMessage('Revisa tu correo electrónico para confirmar tu cuenta.');
      } else if (isSignUp && response.data.user) {
         setMessage('¡Registro exitoso! Revisa tu correo para confirmar la cuenta.');
      } else if (!isSignUp && response.data.user) {
        setMessage('¡Inicio de sesión exitoso!');
        // Aquí podrías redirigir al usuario o actualizar el estado de la app
        // Por ejemplo: navigate('/dashboard');
      } else if (!isSignUp && !response.data.user && !response.error) {
        // signInWithPassword can return no user and no error if credentials are wrong
        setError('Email o contraseña incorrectos.');
      }

    } catch (error) {
      console.error('Error en la autenticación:', error);
      setError(error.message || 'Ocurrió un error durante la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: 'auto' }}>
      <h2>{isSignUp ? 'Crear cuenta' : 'Iniciar Sesión'}</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <button type="submit" disabled={loading} style={{ padding: '0.75rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Procesando...' : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AuthForm;
