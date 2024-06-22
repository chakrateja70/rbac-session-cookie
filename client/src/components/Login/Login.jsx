import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionId = getCookie('connect.sid');
    console.log(sessionId)
    
    try {
      await axios.post(
        'http://localhost:8000/login', 
        { email, password },
        {
          headers: { 'sessionid': sessionId },
          withCredentials: true
        }
      );

      navigate('/dashboard');
    } catch (err) {
      alert('Invalid Login credentials');
      setEmail('');
      setPassword('');
      console.error(err);
    }
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit} className='login-form'>
        <h2>Login</h2>
        <div>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
