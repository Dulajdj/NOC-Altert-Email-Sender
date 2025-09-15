import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Username and password are required');
      return;
    }
    try {
      const res = await axios.post('/api/auth/login', credentials);
      const token = res.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      window.location.href = '/';
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      {error && <p style={{ color: '#dc3545', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', borderRadius: '4px', border: 'none' }}
        >
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don’t have an account? <a href="/register" style={{ color: '#007bff' }}>Register</a>
      </p>
    </div>
  );
};

export default Login;
//hansa