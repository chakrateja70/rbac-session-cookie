import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import './Register.css'

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/register', { username, email, password, role }, {withCredentials: true});
            alert('User registered successfully');
            navigate('/login')
        } catch (err) {
            if (err.code === 11000) {
                alert('Username already exists. Please choose a different username.');
            } else {
                alert('An error occurred during registration.');
                setUsername('');
                setEmail('');   
                setPassword('');    
            }
        }
    };

    return (
        <div className='register-container'>
            <form onSubmit={handleSubmit} className='register-form'>
                <h2>Register</h2>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <select value={role} onChange={(e) => setRole(e.target.value)} className='register-dropdown'>
                    <option value="user">User</option>
                    <option value="teamleader">Team Leader</option>
                    <option value="manager">Manager</option>
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register
