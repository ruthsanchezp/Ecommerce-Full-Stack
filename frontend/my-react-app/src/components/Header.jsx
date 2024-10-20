import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../index.css';

const Header = ({ isLoggedIn, userName, onShowModal }) => {
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/'); // Redirect to home
        window.location.reload(); // Reload to reset the authentication state (optional)
    };

    return (
        <div className="header-container">
            {/* Barra de navegación para el saludo del usuario */}
            {isLoggedIn && (
                <Navbar bg="light" style={{ marginBottom: '10px' }} expand="lg">
                    <Navbar.Brand>
                        <span style={{ fontSize: '1.2em' }}>{`Hola, ${userName}!`}</span>
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Button className="logout-button" onClick={handleLogout}> {/* Use the handleLogout function */}
                            Logout
                        </Button>
                    </Navbar.Collapse>
                </Navbar>
            )}

            {/* Barra de navegación principal */}
            <Navbar bg="light" expand="lg">
                <Navbar.Brand as={Link} to="/">Mi Tienda</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-between">
                    <Nav>
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {isLoggedIn && (
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                        )}
                    </Nav>
                    {!isLoggedIn ? (
                        <Nav>
                            <Nav.Link onClick={() => onShowModal('login')}>Log In</Nav.Link>
                            <Nav.Link onClick={() => onShowModal('signup')}>Sign Up</Nav.Link>
                        </Nav>
                    ) : null}
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default Header;
