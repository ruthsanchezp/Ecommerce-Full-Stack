import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Container, Form, Alert } from 'react-bootstrap'; 
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
    const location = useLocation();
    const { cart } = location.state || { cart: [] }; 

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userData, setUserData] = useState({ name: '', email: '', phone: '', address: '' });
    const [showForm, setShowForm] = useState(false); 
    const [showPayment, setShowPayment] = useState(false); 
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(''); 
    const [showTransferDetails, setShowTransferDetails] = useState(false); 

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

    // Verificar si hay productos en el carrito
    if (cart.length === 0) {
        return <div>No tienes productos en tu carrito.</div>;
    }

    const handleContinue = () => {
        if (isLoggedIn) {
            setShowForm(true); // Show the form if logged in
        } else {
            alert('Debes iniciar sesión para continuar.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value })); // Update user data
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Handle form submission, e.g., save the user data
            await axios.put('http://localhost:3000/api/user/update', userData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccessMessage('¡Datos actualizados correctamente!');
            setErrorMessage('');
            setShowPayment(true); // Show payment options after successful update
            
            // Scroll down to payment options
            const paymentSection = document.getElementById('paymentSection');
            paymentSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Error al actualizar los datos.');
            setSuccessMessage('');
        }
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value); // Update the selected payment method
        setShowTransferDetails(e.target.value === 'bank'); // Show transfer details if bank transfer is selected
    };

    const handlePayment = () => {
        // Handle the payment process here (Stripe integration or bank transfer)
        alert(`Payment method: ${paymentMethod}\nTotal Amount: $${totalAmount.toFixed(2)}`);
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <h1>Checkout</h1>
            {isLoggedIn ? (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h4>{`Hola, ${userName}!`}</h4> {/* Saludo para el usuario logueado */}
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h4>No estás registrado.</h4>
                    <Link to="/signup">Registrate aquí</Link>
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
                <Form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
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
                    <Form>
                        <Form.Group>
                            <Form.Label>Selecciona tu método de pago:</Form.Label>
                            <Form.Check
                                type="radio"
                                label="Stripe"
                                name="paymentMethod"
                                value="stripe"
                                onChange={handlePaymentMethodChange}
                            />
                            <Form.Check
                                type="radio"
                                label="Transferencia Bancaria"
                                name="paymentMethod"
                                value="bank"
                                onChange={handlePaymentMethodChange}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handlePayment}>
                            Proceder al Pago
                        </Button>
                    </Form>
                    {showTransferDetails && (
                        <div style={{ marginTop: '20px' }}>
                            <h5>Detalles de Transferencia:</h5>
                            <p>Banco: Banco Santander</p>
                            <p>Cuenta: 123456789</p>
                            <p>Nombre: Nombre</p>
                        </div>
                    )}
                </div>
            )}

            {/* espacio para que no se vea tan abajo */}
            <div style={{ height: '200px' }}></div>
        </Container>
    );
};

export default Checkout;
