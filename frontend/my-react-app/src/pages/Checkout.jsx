import React, { useState, useEffect, useRef } from 'react';
import { Card, ListGroup, Button, Container, Form, Alert, Modal } from 'react-bootstrap'; 
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = () => {
    const location = useLocation();
    const savedCart = JSON.parse(localStorage.getItem('cart')) || []; // Obtener carrito guardado
    const { cart: initialCart } = location.state || { cart: savedCart }; // Obtener el carrito o el guardado

    const [cart, setCart] = useState(initialCart); // Estado del carrito
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userData, setUserData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [showForm, setShowForm] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Fetch user data when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            axios.get('http://localhost:3000/api/user/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    setUserName(response.data.name);
                    setUserData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    setIsLoggedIn(false);
                });
        }
    }, []);

    const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    if (cart.length === 0) {
        return <div>No tienes productos en tu carrito.</div>;
    }

    const handleContinue = () => {
        if (isLoggedIn) {
            setShowForm(true);
            scrollToForm();  // Scroll to form when user is logged in and clicks "Continuar"
        } else {
            alert('Debes iniciar sesión para continuar.');
            setShowLoginModal(true);  // Open the login modal if not logged in
        }
    };

    // Scroll to form function for better UX
    const scrollToForm = () => {
        window.scrollTo({
            top: document.getElementById("formSection").offsetTop, // Scroll to form
            behavior: 'smooth',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { name, email, password } = userData;
            await axios.post('http://localhost:3000/api/user/register', { name, email, password });
            setShowRegisterModal(false);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        } catch (error) {
            alert(error.response?.data.message || 'Error al registrar el usuario.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { email, password } = userData;
            const response = await axios.post('http://localhost:3000/api/user/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setUserName(response.data.name);
            setIsLoggedIn(true);
            setShowLoginModal(false);
            alert('¡Inicio de sesión exitoso!');
        } catch (error) {
            alert(error.response?.data.message || 'Error al iniciar sesión.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:3000/api/user/update', userData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccessMessage('¡Datos actualizados correctamente!');
            setErrorMessage('');
            setShowPayment(true);
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Error al actualizar los datos.');
            setSuccessMessage('');
        }
    };

    return (
        <PayPalScriptProvider options={{ "client-id": "AX3BGAhaCRVfeDHNhRBTD2p6LAKrVZmfY_1JOzx3tyMF7RX3aPb61FFPUZk-0UK0WO69aGb5uSiR-PUQ" }}>
            <Container style={{ marginTop: '20px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                <h1 style={{ textAlign: 'center' }}>Checkout</h1>
                {isLoggedIn ? (
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h4>{`Hola, ${userName}!`}</h4>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h4>No estás registrado.</h4>
                        <a href="#" onClick={() => setShowRegisterModal(true)}>Registrate aquí</a>
                        <br />
                        <a href="#" onClick={() => setShowLoginModal(true)}>Iniciar Sesión</a>
                    </div>
                )}
                <Card>
                    <Card.Body>
                        <ListGroup variant="flush">
                            {cart.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    {item.product.name} - Cantidad: {item.quantity} - Precio: ${item.product.price * item.quantity}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <h3>Total: ${totalAmount.toFixed(2)}</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Button variant="success" style={{ padding: '5px 15px' }} onClick={handleContinue}>Continuar</Button>
                        </div>
                    </Card.Body>
                </Card>

                {showForm && (
                    <Form onSubmit={handleSubmit} style={{ marginTop: '20px' }} id="formSection">
                        <h3>Detalles del Cliente</h3>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone" className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={userData.phone}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress" className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={userData.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Confirmar datos
                        </Button>
                    </Form>
                )}

                {showPayment && (
                    <div id="paymentSection" style={{ marginTop: '20px' }}>
                        <h3>Método de Pago</h3>
                        <PayPalButtons
                            style={{ layout: 'vertical' }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: totalAmount.toFixed(2),
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then(() => {
                                    alert('Pago realizado con éxito!');
                                });
                            }}
                        />
                    </div>
                )}

                <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registro de Usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleRegister}>
                            <Form.Group controlId="registerName" className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="registerEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="registerPassword" className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={userData.password || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Registrarse
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Inicio de Sesión</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId="loginEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="loginPassword" className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={userData.password || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Iniciar Sesión
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <div style={{ height: '200px' }}></div>
            </Container>
        </PayPalScriptProvider>
    );
};

export default Checkout;
