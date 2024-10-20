import React from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const FixedCart = ({ cart, onClearCart }) => {
    const navigate = useNavigate();

    // Calculate the total amount in the cart
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    // Redirect user to the checkout page
    const handleCheckout = () => {
        navigate('/checkout', { state: { cart } }); // Pass the cart to checkout
    };

    return (
        <div className="fixed-bottom-cart">
            <Card className="bg-light">
                <Card.Body>
                    <Card.Title>Carrito de Compras</Card.Title>
                    {cart.length > 0 ? (
                        <>
                            <ListGroup variant="flush">
                                {cart.map((item, index) => (
                                    <ListGroup.Item key={index} className="small-item">
                                        {item.product.name} - Cant: {item.quantity}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <h5>Total: ${total.toFixed(2)}</h5> {/* Display total amount */}
                            <Button variant="success" onClick={handleCheckout} className="mt-2" size="sm">
                                Checkout
                            </Button>
                            <Button variant="danger" onClick={onClearCart} className="mt-2" size="sm">
                                Vaciar Carrito
                            </Button>
                        </>
                    ) : (
                        <p>No tienes productos en el carrito.</p>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default FixedCart;
