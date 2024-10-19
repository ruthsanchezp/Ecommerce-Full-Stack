import React from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';

const FixedCart = ({ cart, onClearCart }) => {
    // Si el carrito está vacío, no renderizar nada
    if (cart.length === 0) return null;

    return (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 999 }}>
            <Card className="bg-light">
                <Card.Body>
                    <Card.Title>Carrito de Compras</Card.Title>
                    <ListGroup variant="flush">
                        {cart.map(item => (
                            <ListGroup.Item key={item.product._id}>
                                {item.product.name} - Cantidad: {item.quantity}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Button variant="danger" onClick={onClearCart} className="mt-2" size="sm">
                        Vaciar Carrito
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default FixedCart;
