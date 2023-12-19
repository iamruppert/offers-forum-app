// OfferEditModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function OfferEditModal({ show, handleClose, selectedOffer, handleUpdateOffer }) {
    const [editedOffer, setEditedOffer] = useState({
        name: selectedOffer.name,
        position: selectedOffer.position,
        keywords: selectedOffer.keywords.join(', '),
        salary: selectedOffer.salary,
        currency: selectedOffer.currency,
        email: selectedOffer.recruiter.email,
    });

    useEffect(() => {
        setEditedOffer({
            name: selectedOffer.name,
            position: selectedOffer.position,
            keywords: selectedOffer.keywords.join(', '),
            salary: selectedOffer.salary,
            currency: selectedOffer.currency,
            email: selectedOffer.recruiter.email,
        });
    }, [selectedOffer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setEditedOffer({
            ...editedOffer,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert keywords to an array
        const keywordsArray = editedOffer.keywords.split(',').map((keyword) => keyword.trim());

        // Create an updated offer object
        const updatedOffer = {
            ...selectedOffer,
            ...editedOffer,
            keywords: keywordsArray,
        };

        // Pass the updated offer to the parent component
        handleUpdateOffer(updatedOffer);
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Edit Offer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="editFormName">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={editedOffer.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="editFormPosition">
                        <Form.Label>Position:</Form.Label>
                        <Form.Control
                            type="text"
                            name="position"
                            value={editedOffer.position}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="editFormKeywords">
                        <Form.Label>Keywords:</Form.Label>
                        <Form.Control
                            type="text"
                            name="keywords"
                            value={editedOffer.keywords}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="editFormSalary">
                        <Form.Label>Salary:</Form.Label>
                        <Form.Control
                            type="text"
                            name="salary"
                            value={editedOffer.salary}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="editFormCurrency">
                        <Form.Label>Currency:</Form.Label>
                        <Form.Control
                            as="select"
                            name="currency"
                            value={editedOffer.currency}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="PLN">PLN</option>
                            <option value="USD">USD</option>
                            <option value="EURO">EURO</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="editFormEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={editedOffer.email}
                            readOnly
                            plaintext
                            className="form-control-plaintext"
                        />
                    </Form.Group>

                    <Button type="submit">Save Changes</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default OfferEditModal;
