import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaUsers, FaHeart } from 'react-icons/fa'; // Dodaj ikonę serca
import { jwtDecode } from 'jwt-decode';
import OfferViewAdminRecruiter from '../offer/OfferViewAdminRecruiter';

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSettings = () => {
        navigate('/recruiterSettings');
    };

    // Dodaj funkcję do nawigacji do ulubionych ofert
    const handleFavorites = () => {
        navigate('/favorites');
    };

    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userEmail = decodedToken.sub;
                setUserEmail(userEmail);
            } catch (error) {
                console.error('Error decoding token', error);
            }
        }
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="text-center flex-grow-1">
                    <h2 className="mx-auto">NoFluffCareers</h2>
                </div>

                <div className="d-flex gap-2 align-items-center">
                    <div className="d-flex flex-column align-items-start">
                        <p>
                            <strong>Logged in as:</strong> {userEmail}
                        </p>
                        <div className="d-flex gap-2">
                            <Link to="/user/favorites" className="link">
                                <span className="icon-text">
                                    <FaHeart style={{ fontSize: '24px' }} />
                                    Favorites
                                </span>
                            </Link>
                            <span onClick={handleLogout} className="link logout">
                                <span className="icon-text">
                                    <FaSignOutAlt style={{ fontSize: '24px' }} />
                                    Logout
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <OfferViewAdminRecruiter />
        </div>
    );
};

export default UserDashboard;
