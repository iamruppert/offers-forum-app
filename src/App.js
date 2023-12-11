// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import AdminDashboard from './admin/AdminDashboard';
import UserDashboard from "./UserDashboard"; // Import AdminDashboard
import Settings from './admin/Settings';
import RegisterRecruiterForm from './admin/RegisterRecruiterForm.js'; // Import the form

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/userDashboard" element={<UserDashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/registerRecruiter" element={<RegisterRecruiterForm />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
