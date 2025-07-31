import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="user-profile">
            <div className="user-info" onClick={toggleMenu}>
                <div className="user-avatar">
                    {user?.username?.charAt(0).toUpperCase() || '👤'}
                </div>
                <div className="user-details">
                    <span className="username">{user?.username}</span>
                    <span className="user-status">Online</span>
                </div>
                <span className="dropdown-arrow">{isMenuOpen ? '▲' : '▼'}</span>
            </div>

            {isMenuOpen && (
                <div className="user-menu">
                    <div className="menu-item logout-item" onClick={handleLogout}>
                        <span className="menu-icon">🚪</span>
                        <span>Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
