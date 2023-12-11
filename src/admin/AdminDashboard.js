import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import AdminOffers from './AdminOffers';
import './AdminDashboard.css'; // Dodaj import pliku ze stylami

const AdminDashboard = () => {
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

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="text-center flex-grow-1">
                    <h2 className="mx-auto">NoFluffCareers</h2>
                </div>

                <div className="d-flex gap-2 align-items-center">
                    <div className="d-flex flex-column align-items-start">
                        <h2 className="mb-0" style={{ borderBottom: '2px solid #000' }}>Admin Dashboard</h2>
                        <div className="d-flex gap-2">
                            <Link to="/settings" className="link">
                                <span className="icon-text">
                                    <FaCog style={{ fontSize: '24px' }} />
                                    Settings
                                </span>
                            </Link>
                            <span onClick={handleLogout} className="link logout">
                                <span className="icon-text">
                                    <FaSignOutAlt style={{ fontSize: '24px' }} />
                                    Logout
                                </span>
                            </span>
                            <Link to="/users" className="link">
                                <span className="icon-text">
                                    <FaUsers style={{ fontSize: '24px' }} />
                                    Users
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <AdminOffers />
        </div>
    );
};

export default AdminDashboard;
