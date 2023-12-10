// UserDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    const handleFavorites = () => {
        navigate('/favorites');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>User Dashboard</h2>
                <div style={styles.buttons}>
                    <button onClick={handleSettings} style={styles.button}>
                        Settings
                    </button>
                    <button onClick={handleLogout} style={styles.button}>
                        Logout
                    </button>
                    <button onClick={handleFavorites} style={styles.button}>
                        Favorites
                    </button>
                </div>
            </div>
            <p>Welcome to the user dashboard!</p>
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
};export default UserDashboard;
