// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import UserDashboard from "./UserDashboard"; // Import AdminDashboard

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/userDashboard" element={<UserDashboard />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
