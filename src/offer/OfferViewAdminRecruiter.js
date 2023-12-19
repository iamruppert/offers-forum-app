import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { jwtDecode } from 'jwt-decode';
import OfferAddForm from '../offer/OfferAddForm';
import { Modal, Button, Form } from 'react-bootstrap';
import OfferEditModal from './OfferEditModal'; // Importuj komponent modal edycji

class AdminOffers extends Component {
    state = {
        offers: {
            content: [],
            totalPages: 0,
        },
        currentPage: 0,
        itemsPerPage: 4,
        sortOption: 'name', // Default sorting option
        selectedOffer: null,
        userEmail: '',
        userRole: '',
        searchPhrase: '',
        showEditModal: false, // Dodano stan do zarządzania widocznością modalu edytowania
    };

    componentDidMount() {
        this.fetchAdminOffers();
        this.loadUserInfoFromToken();
    }

    loadUserInfoFromToken() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userEmail = decodedToken.sub;
                const userRole = decodedToken.role;

                this.setState({ userEmail, userRole });
            } catch (error) {
                console.error('Error decoding token:', error.message);
            }
        }
    }

    fetchAdminOffers = async () => {
        const { currentPage, itemsPerPage, sortOption, searchPhrase } = this.state;
        try {
            const response = await fetch(
                `http://localhost:8080/api/searchOffers?page=${currentPage}&size=${itemsPerPage}&sortBy=${sortOption}&searchPhrase=${searchPhrase}`
            );
            if (response.ok) {
                const { content, totalPages } = await response.json();

                // Zmiana stanu ofert, dodając isFavorite do każdej oferty
                const updatedContent = content.map((offer) => ({
                    ...offer,
                    isFavorite: false, // Domyślnie ustawione na false
                }));

                this.setState({ offers: { content: updatedContent, totalPages } });
            } else {
                console.error('Failed to fetch admin offers:', response.statusText);
            }
        } catch (error) {
            console.error('Error during admin offer fetch:', error.message);
        }
    };

    handleDeleteOffer = async (offerId, offerEmail) => {
        const { userEmail, userRole } = this.state;

        try {
            if (userRole === 'ADMIN' || userEmail === offerEmail) {
                const response = await fetch(`http://localhost:8080/api/recruiter/deleteOffer/${offerId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    this.fetchAdminOffers();
                    this.handleModalClose();
                } else {
                    console.error('Failed to delete offer:', response.statusText);
                }
            } else {
                console.error('Unauthorized to delete offer');
            }
        } catch (error) {
            console.error('Error during offer deletion:', error.message);
        }
    };

    handlePageChange = (newPage) => {
        this.setState({ currentPage: newPage }, () => this.fetchAdminOffers());
    };

    handleSortChange = (newSortOption) => {
        this.setState({ sortOption: newSortOption }, () => this.fetchAdminOffers());
    };

    handleOfferClick = (offer) => {
        this.setState({ selectedOffer: offer });
    };

    handleModalClose = () => {
        this.setState({ selectedOffer: null, showEditModal: false });
    };

    handleSearchChange = (event) => {
        this.setState({ searchPhrase: event.target.value });
    };

    handleSearchSubmit = (event) => {
        event.preventDefault();
        this.fetchAdminOffers();
    };

    // Dodano funkcję do obsługi pokazywania modalu edytowania
    handleShowEditModal = () => {
        this.setState({ showEditModal: true });
    };

    // Dodano funkcję do obsługi aktualizacji oferty
    // Dodano argument showEditModal
    handleUpdateOffer = async (updatedOffer) => {
        const { selectedOffer, showEditModal } = this.state;

        try {
            const response = await fetch(`http://localhost:8080/api/recruiter/updateOffer/${selectedOffer.offerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOffer),
            });

            console.log(updatedOffer)
            console.log('Response:', response);

            if (response.ok || response.status === 201) {
                this.fetchAdminOffers();

                // Zaktualizowano stan showEditModal
                this.setState({ selectedOffer: null, showEditModal: false });
            } else {
                console.error('Failed to update offer:', response.statusText);
            }
        } catch (error) {
            console.error('Error during offer update:', error.message);
        }
    };

    handleToggleFavorite = async () => {
        const { selectedOffer, offers } = this.state;

        if (!selectedOffer) {
            console.error('No selected offer to add to favorites');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:8080/api/registeredUser/addToFavourite/${selectedOffer.offerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedOffers = offers.content.map((offer) => {
                    if (offer.offerId === selectedOffer.offerId) {
                        const updatedOffer = { ...offer, isFavorite: !offer.isFavorite };
                        console.log('Updated Offer:', updatedOffer);
                        return updatedOffer;
                    }
                    return offer;
                });

                console.log('Updated Offers:', updatedOffers);

                this.setState((prevState) => ({
                    offers: { ...prevState.offers, content: updatedOffers },
                }));
            } else {
                console.error('Failed to add offer to favorites:', response.statusText);
            }
        } catch (error) {
            console.error('Error during adding offer to favorites:', error.message);
        }
    };




    render() {
        const { offers, currentPage, itemsPerPage, sortOption, selectedOffer, userEmail, userRole, searchPhrase, showEditModal } = this.state;
        const { content, totalPages } = offers;
        const { isFavorite } = this.state;

        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-end mb-4">
                    <div className="d-flex gap-2">
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort By
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                                <li>
                                    <button className="dropdown-item" onClick={() => this.handleSortChange('name')}>
                                        Name <i className="fas fa-sort-alpha-down"></i>
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => this.handleSortChange('salary_asc')}>
                                        Salary Ascending <i className="fas fa-dollar-sign"></i><i className="fas fa-sort-amount-up"></i>
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => this.handleSortChange('salary_desc')}>
                                        Salary Descending <i className="fas fa-dollar-sign"></i><i className="fas fa-sort-amount-down"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <OfferAddForm />
                        <Form onSubmit={this.handleSearchSubmit} className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Search"
                                value={searchPhrase}
                                onChange={this.handleSearchChange}
                            />
                            <Button type="submit" variant="outline-secondary">
                                <i className="fas fa-search"></i>
                            </Button>
                        </Form>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {content.map((offer, index) => (
                        <div
                            key={index}
                            className="col"
                            style={{ cursor: 'pointer' }}
                            onClick={() => this.handleOfferClick(offer)}
                        >
                            <div className="card">
                                <div className="card-body d-flex align-items-center">
                                    <img
                                        src="https://www.worldsbestcatlitter.com/wp-content/uploads/2016/09/cat-affection-blog-image-1.jpg"
                                        alt={`Offer ${index}`}
                                        className="mr-2"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                    <div style={{ flex: '1', textAlign: 'center' }}>
                                        <h5 className="card-title">{offer.name}</h5>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p className="card-text">
                                            {offer.salary} {offer.currency}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedOffer && (
                    <Modal show={!showEditModal} onHide={this.handleModalClose} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedOffer.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Position: {selectedOffer.position}</p>
                            <p>Keywords: {selectedOffer.keywords.join(', ')}</p>
                            <p>Salary: {selectedOffer.salary} {selectedOffer.currency}</p>
                            <p>Added By: {`${selectedOffer.recruiter.name} ${selectedOffer.recruiter.surname}`}</p>
                            <p>Email: {selectedOffer.recruiter.email}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            {(userRole === 'ADMIN' || userEmail === selectedOffer.recruiter.email) && (
                                <>
                                    <Button variant="danger" onClick={() => this.handleDeleteOffer(selectedOffer.offerId, selectedOffer.recruiter.email)}>
                                        <i className="fas fa-trash"></i> Delete
                                    </Button>
                                    <Button variant="warning" onClick={this.handleShowEditModal}>
                                        <i className="fas fa-edit"></i> Edit
                                    </Button>
                                </>
                            )}
                            {userRole === 'REGISTERED_USER' && (
                                <Button variant={isFavorite ? 'danger' : 'outline-danger'} onClick={() => this.handleToggleFavorite()}>
                                    <i className={`fas fa-heart${isFavorite ? '' : '-beat'}`}></i> {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                </Button>
                            )}

                            <Button variant="secondary" onClick={this.handleModalClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

                {showEditModal && (
                    <OfferEditModal
                        show={showEditModal}
                        handleClose={this.handleModalClose}
                        selectedOffer={selectedOffer}
                        handleUpdateOffer={this.handleUpdateOffer}
                    />
                )}

                <div className="d-flex justify-content-center mt-3">
                    <nav>
                        <ul className="pagination">
                            {[...Array(totalPages).keys()].map((index) => (
                                <li key={index} className={`page-item ${index === currentPage ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => this.handlePageChange(index)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default AdminOffers;
