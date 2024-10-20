import React from 'react';
import ProductItem from './ProductItem';
import { Row, Col } from 'react-bootstrap';

const ProductList = ({ products, onAddToCart, onDecreaseQuantity }) => {
    return (
        <Row>
            {products.map(product => (
                <Col key={product._id} md={4} className="mb-4">
                    <ProductItem 
                        product={product} 
                        onAddToCart={onAddToCart} 
                        onDecreaseQuantity={onDecreaseQuantity} 
                    />
                </Col>
            ))}
        </Row>
    );
};

export default ProductList;
