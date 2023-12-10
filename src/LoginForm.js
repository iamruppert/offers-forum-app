// LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate each form field
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Enter a valid email address';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);

        // Check if there are no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8080/api/auth/authenticate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    console.log('Login successful');

                    const { token } = await response.json();
                    console.log('Received token:', token);
                    localStorage.setItem('token', token);

                    // Navigate to the main dashboard after successful login
                    navigate('/dashboard');
                } else {
                    const errorMessage = await response.text();
                    console.error('Login failed:', errorMessage);
                }
            } catch (error) {
                console.error('Error during login:', error.message);
            }
        }
    };


    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login Form</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
                <label style={styles.label}>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                    />
                    {errors.email && <span style={styles.error}>{errors.email}</span>}
                </label>

                <label style={styles.label}>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                    />
                    {errors.password && <span style={styles.error}>{errors.password}</span>}
                </label>

                <button type="submit" style={styles.button}>
                    Login
                </button>
                <button type="button" onClick={handleGoBack} style={styles.button}>
                    Go back to Home
                </button>
            </form>
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
    },
    title: {
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '20px',
    },
    label: {
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '8px',
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginTop: '4px',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    error: {
        color: 'red',
        marginTop: '4px',
    },
};

export default LoginForm;
