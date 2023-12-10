// Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    const handleUsers = () => {
        navigate('/users');
    };

    const handleFavorites = () => {
        navigate('/favorites');
    };

    const userRoles = () => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.role || '';
        }

        return '';
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Dashboard</h2>
                <div style={styles.buttons}>
                    <button onClick={handleSettings} style={styles.button}>
                        Settings
                    </button>
                    <button onClick={handleLogout} style={styles.button}>
                        Logout
                    </button>

                    {/* Render the "Users" button only if the user has the admin role */}
                    {userRoles() === 'ADMIN' && (
                        <button onClick={handleUsers} style={styles.button}>
                            Users
                        </button>
                    )}

                    {/* Render the "Favorites" button only if the user has the registered user role */}
                    {userRoles() === 'REGISTERED_USER' && (
                        <button onClick={handleFavorites} style={styles.button}>
                            Favorites
                        </button>
                    )}
                </div>
            </div>
            <p>Welcome to the main dashboard!</p>
        </div>
    );
};

const styles = {
    container: {
        width: '50%',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        marginTop: '50px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        textAlign: 'center',
        color: '#333',
    },
    buttons: {
        display: 'flex',
        gap: '10px',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Dashboard;
