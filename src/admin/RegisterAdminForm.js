import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert, Button, Modal} from "react-bootstrap";
import {FaUserPlus} from "react-icons/fa";

function RegisterRecruiterForm() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        pesel: '',
        country: '',
        email: '',
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const validateForm = () => {
        const newErrors = {};

        // Validate each form field
        if (!formData.name.trim() || !/^[A-Za-z]+$/.test(formData.name.trim())) {
            newErrors.name = 'Name is required and should contain only letters';
        }

        if (!formData.surname.trim() || !/^[A-Za-z]+$/.test(formData.surname.trim())) {
            newErrors.surname = 'Surname is required and should contain only letters';
        }
        if (!formData.pesel.trim() || !/^\d{11}$/.test(formData.pesel.trim())) {
            newErrors.pesel = 'Pesel must be 11 digits';
        }
        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Enter a valid email address';
        }
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.password.trim() || formData.password.trim().length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);

        // Check if there are no errors
        return Object.keys(newErrors).length === 0;
    };

    const autoCloseAlerts = (isSuccess) => {
        setTimeout(() => {
            setShow(true);
            setAlertMessage(isSuccess ? 'Admin registered successfully!' : 'Admin registered failed! ');
            setAlertVariant(isSuccess ? 'success' : 'danger');
            setSuccessMessage('');
            setFormData({
                name: '',
                surname: '',
                pesel: '',
                country: '',
                email: '',
                username: '',
                password: '',
            });
        }, 2000); // Adjust the timeout value as needed (2s in this case)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8080/api/admin/createAdmin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    autoCloseAlerts(true); // Auto close success alert
                }
                else {
                    autoCloseAlerts(false); // Auto close error alert
                }
            } catch (error) {
                autoCloseAlerts(false); // Auto close error alert
            }
        }
    };

    return (
        <>
            <li className="list-group-item" style={{ fontSize: '40px', cursor: 'pointer' }} onClick={handleShow}>
                <FaUserPlus style={{ marginRight: '10px' }} />
                Add admin
            </li>

            <Modal
                key={show}
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Register new admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form style={styles.form} onSubmit={handleSubmit}>
                        <label style={styles.label}>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            {errors.name && <span style={styles.error}>{errors.name}</span>}
                        </label>

                        <label style={styles.label}>
                            Surname:
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            {errors.surname && <span style={styles.error}>{errors.surname}</span>}
                        </label>

                        <label style={styles.label}>
                            Pesel:
                            <input
                                type="text"
                                name="pesel"
                                value={formData.pesel}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            {errors.pesel && <span style={styles.error}>{errors.pesel}</span>}
                        </label>

                        <label style={styles.label}>
                            Country:
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            >
                                <option value="" disabled>
                                    Select your country
                                </option>
                                <option value="Poland">Poland</option>
                                <option value="USA">USA</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                            </select>
                            {errors.country && <span style={styles.error}>{errors.country}</span>}
                        </label>

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
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            {errors.username && <span style={styles.error}>{errors.username}</span>}
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
                            Register
                        </button>
                        {successMessage && (
                            <p style={{ ...styles.successMessage, color: alertVariant === 'success' ? 'green' : 'red' }}>
                                {successMessage}
                            </p>
                        )}
                    </form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
                <Alert variant={alertVariant} show={!!alertMessage} dismissible={false} style={{ textAlign: 'center' }}>
                    {alertMessage}
                </Alert>
            </Modal>


        </>
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
    successMessage: {
        color: 'green',
        marginTop: '10px',
        textAlign: 'center',
    },
};
export default RegisterRecruiterForm;