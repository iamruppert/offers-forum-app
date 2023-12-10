// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
