import React from 'react';
import './Header.css';

function Header() {
    return (
        <div>
            <header className="header">
                <a href="#" className="logo">Interactive Ski Maps</a>
                <nav className="navigation">
                    <a className="#">Home</a>
                    <a className="#">About Us</a>
                    <a className="#">Contact</a>
                </nav>
            </header>
        </div>


    );
}

export default Header;