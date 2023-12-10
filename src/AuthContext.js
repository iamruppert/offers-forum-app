// AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const getUserData = () => {
        return user;
    };

    const setUserData = (userData) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, getUserData, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
