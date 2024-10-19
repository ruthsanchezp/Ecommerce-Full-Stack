import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = ({ isLoggedIn, userName, onShowModal }) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">Mi Tienda</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    {!isLoggedIn ? (
                        <>
                            <Nav.Link onClick={() => onShowModal('login')}>Log In</Nav.Link>
                            <Nav.Link onClick={() => onShowModal('signup')}>Sign Up</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                            <Nav.Item style={{ marginLeft: 'auto', marginRight: '15px' }}>
                                {`Hola, ${userName}!`} {/* Aquí mostramos el nombre del usuario */}
                            </Nav.Item>
                            <Button onClick={() => { 
                                localStorage.removeItem('token');
                                window.location.reload(); // Reload to reset logged-in state
                            }}>
                                Logout
                            </Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
