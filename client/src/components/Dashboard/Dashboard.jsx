import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'

const Dashboard = () => {
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getUserRole', { withCredentials: true });
                setRole(response.data.role);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                } else {
                    console.error('Error fetching user role:', error);
                }
            }

        };
        fetchUserRole();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/data', { withCredentials: true });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const writeData = async () => {
        try {
            const response = await axios.post('http://localhost:8000/data', {}, { withCredentials: true });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error writing data:', error);
        }
    };

    const modifyData = async () => {
        try {
            const response = await axios.put('http://localhost:8000/data', {}, { withCredentials: true });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error modifying data:', error);
        }
    };

    const deleteData = async () => {
        try {
            const response = await axios.delete('http://localhost:8000/data', { withCredentials: true });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    return (
        <div className='dashboard-container'>
            <h1>Dashboard</h1>
            <p>Role: {role}</p>
            <button onClick={fetchData}>Read Data</button>
            {role === 'manager' || role === 'teamleader' ? (
                <>
                    <button onClick={writeData}>Write Data</button>
                    <button onClick={modifyData}>Modify Data</button>
                </>
            ) : null}
            {role === 'manager' ? (
                <button onClick={deleteData}>Delete Data</button>
            ) : null}
            <p>{message}</p>
        </div>
    );
};

export default Dashboard;
