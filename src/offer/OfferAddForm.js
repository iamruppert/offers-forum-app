import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Modal, Form } from 'react-bootstrap';
import {FaPlus, FaUserPlus} from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode library

function OfferAddForm() {
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        keywords: [],
        salary: '',
        currency: 'PLN',
        email: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [show, setShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const navigate = useNavigate();
    const [showButton, setShowButton] = useState(false); // Added state for the button

    useEffect(() => {
        // Fetch the user's email from the token
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setFormData((prevFormData) => ({
                ...prevFormData,
                email: decodedToken.sub,
            }));
            if (decodedToken.role === 'ADMIN' || decodedToken.role === 'RECRUITER') {
                setShowButton(true);
            }
        }
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'keywords') {
            setFormData({
                ...formData,
                [name]: value.split(',').map((keyword) => keyword.trim()),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name can't be blank";
        }

        if (!formData.position.trim()) {
            newErrors.position = "Position can't be blank";
        }

        if (!formData.keywords.length) {
            newErrors.keywords = "Keywords can't be empty";
        }

        if (!formData.salary.trim() || !/^\d+$/.test(formData.salary.trim())) {
            newErrors.salary = 'Salary must be a valid number';
        }

        if (!formData.currency) {
            newErrors.currency = "Currency can't be null";
        }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Enter a valid email address';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const autoCloseAlerts = (isSuccess) => {
        setTimeout(() => {
            setShow(true);
            setAlertMessage(
                isSuccess ? 'Offer created successfully!' : 'Offer creation failed! '
            );
            setAlertVariant(isSuccess ? 'success' : 'danger');
            setSuccessMessage('');
            setFormData({
                name: '',
                position: '',
                keywords: [],
                salary: '',
                currency: 'PLN',
                email: '',
            });
            setIsCheckboxChecked(false);
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isCheckboxChecked) {
            setErrors({
                checkbox: 'You must agree to the terms to proceed',
            });
            return;
        }

        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8080/api/recruiter/addOffer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    autoCloseAlerts(true);
                } else {
                    autoCloseAlerts(false);
                }
            } catch (error) {
                autoCloseAlerts(false);
            }
        }
    };

    return (
        <>

            {showButton && (
                <Button className="btn btn-primary" onClick={handleShow}>
                    Add Offer <FaPlus />
                </Button>
            )}

            <Modal key={show} show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Register new recruiter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form style={styles.form} onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.name && <span style={styles.error}>{errors.name}</span>}
                        </Form.Group>

                        <Form.Group controlId="formPosition">
                            <Form.Label>Position:</Form.Label>
                            <Form.Control
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.position && <span style={styles.error}>{errors.position}</span>}
                        </Form.Group>

                        <Form.Group controlId="formKeywords">
                            <Form.Label>Keywords:</Form.Label>
                            <Form.Control
                                type="text"
                                name="keywords"
                                value={formData.keywords.join(', ')}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.keywords && <span style={styles.error}>{errors.keywords}</span>}
                        </Form.Group>

                        <Form.Group controlId="formSalary">
                            <Form.Label>Salary:</Form.Label>
                            <Form.Control
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.salary && <span style={styles.error}>{errors.salary}</span>}
                        </Form.Group>

                        <Form.Group controlId="formCurrency">
                            <Form.Label>Currency:</Form.Label>
                            <Form.Control
                                as="select"
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="PLN">PLN</option>
                                <option value="USD">USD</option>
                                <option value="EURO">EURO</option>
                            </Form.Control>
                            {errors.currency && <span style={styles.error}>{errors.currency}</span>}
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                readOnly
                                required
                            />
                            {errors.email && <span style={styles.error}>{errors.email}</span>}
                        </Form.Group>

                        <Form.Group controlId="formCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="I agree to the terms"
                                onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
                                checked={isCheckboxChecked}
                            />
                            {errors.checkbox && <span style={styles.error}>{errors.checkbox}</span>}
                        </Form.Group>

                        <Button type="submit" style={styles.button}>
                            Register
                        </Button>
                        {successMessage && (
                            <p
                                style={{
                                    ...styles.successMessage,
                                    color: alertVariant === 'success' ? 'green' : 'red',
                                }}
                            >
                                {successMessage}
                            </p>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
                <Alert variant={alertVariant} show={!!alertMessage} dismissible={false} style={{ textAlign: 'center' }}>
                    {alertMessage}
                </Alert>
            </Modal>
        </>
    );
}

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

export default OfferAddForm;
