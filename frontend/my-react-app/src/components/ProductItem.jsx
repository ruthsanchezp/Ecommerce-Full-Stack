import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';

const ProductItem = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(0); // Estado para la cantidad del producto

    const handleAdd = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onAddToCart(product, newQuantity); // Agrega el producto al carrito
    };

    const handleRemove = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onAddToCart(product, newQuantity); // Actualiza la cantidad en el carrito
        }
    };

    return (
        <Card className="text-center">
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>${product.price}</Card.Text>
                <div className="d-flex justify-content-center align-items-center mb-2">
                    <Button variant="secondary" onClick={handleRemove}>-</Button>
                    <span className="mx-2">{quantity}</span>
                    <Button variant="secondary" onClick={handleAdd}>+</Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductItem;
