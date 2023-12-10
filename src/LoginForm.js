import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(''); // Dodaj nowy stan na komunikat błędu
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

                    // Extract role from the token
                    const decodedToken = jwtDecode(token);
                    const userRole = decodedToken.role;

                    // Navigate based on the user's role
                    switch (userRole) {
                        case 'ADMIN':
                            navigate('/adminDashboard');
                            break;
                        case 'RECRUITER':
                            navigate('/recruiterDashboard');
                            break;
                        case 'REGISTERED_USER':
                            navigate('/userDashboard');
                            break;
                        default:
                            console.error('Unknown user role');
                            break;
                    }
                } else if (response.status === 404) {
                    setErrorMessage('Invalid email or password');
                    console.error('Invalid email or password');
                } else {
                    const errorData = await response.json();

                    // Check if the response contains error details
                    if (errorData.message) {
                        setErrors({
                            email: errorData.message,
                            password: '',
                        });
                        console.error('Login failed:', errorData.message);
                    } else {
                        console.error('Login failed. No error details provided.');
                    }
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

                {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
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
    errorMessage: {
        color: 'red',
        marginTop: '10px',
        textAlign: 'center',
    },
};

export default LoginForm;
