// Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        // Fetch the list of offers from your API
        const fetchOffers = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/listAllOffers');
                if (response.ok) {
                    const data = await response.json();
                    setOffers(data);
                } else {
                    console.error('Failed to fetch offers:', response.statusText);
                }
            } catch (error) {
                console.error('Error during offer fetch:', error.message);
            }
        };

        fetchOffers();
    }, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>NoFluffCareers</h2>
                <div style={styles.buttonContainer}>
                    <Link to="/register" style={styles.button}>
                        Register
                    </Link>
                    <Link to="/login" style={styles.button}>
                        Login
                    </Link>
                </div>
            </div>

            <div style={styles.offerContainer}>
                {offers.map((offer, index) => (
                    <div key={index} style={styles.offer}>
                        <img
                            src="https://placekitten.com/100/100" // Placeholder image URL, replace it with your actual image URL
                            alt={`Offer ${index}`}
                            style={styles.offerImage}
                        />
                        <div style={styles.offerDetails}>
                            <h3>{offer.name}</h3>
                            <p>
                                {offer.salary} {offer.currency}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
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
    buttonContainer: {
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
        textDecoration: 'none',
        textAlign: 'center',
    },
    offerContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    offer: {
        width: '48%', // Adjust as needed
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
    },
    offerImage: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginRight: '10px',
    },
    offerDetails: {
        flex: 1,
    },
};

export default Home;
