import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import { Container, Modal, Button, Form } from 'react-bootstrap'; // Import Modal and Form from react-bootstrap
import FixedCart from '../components/FixedCart';
import Header from '../components/Header';
import axios from 'axios';

const Home = () => {
    const [cart, setCart] = useState([]); // State for cart
    const [products, setProducts] = useState([]); // State for products
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Update based on actual auth state
    const [userName, setUserName] = useState(''); // State for storing logged-in user's name
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [modalType, setModalType] = useState(''); // State to determine the type of modal (Sign Up / Log In)
    const [formData, setFormData] = useState({ email: '', password: '', name: '' }); // State for form data
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/product/readall');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error.response ? error.response.data : error.message);
            }
        };
        
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        if (token) {
            axios
                .get('http://localhost:3000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setIsLoggedIn(true);
                    setUserName(response.data.name); // Asigna el nombre del usuario
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error);
                });
        }
        
        fetchProducts(); // Llamar también a los productos
    }, []); // Correr solo una vez cuando el componente se monta

    const handleAddToCart = (product, quantity) => {
        const existingProduct = cart.find(item => item.product._id === product._id);

        if (existingProduct) {
            if (quantity <= 0) {
                setCart(cart.filter(item => item.product._id !== product._id)); // Remove product if quantity is zero
            } else {
                setCart(cart.map(item => 
                    item.product._id === product._id
                    ? { ...existingProduct, quantity: quantity }
                    : item
                ));
            }
        } else {
            if (quantity > 0) {
                setCart([...cart, { product, quantity }]); // Add new product to cart
            }
        }
    };

    const handleClearCart = () => {
        setCart([]); // Empty the cart
    };

    // Functions to handle modal visibility
    const handleShowModal = (type) => {
        setModalType(type);
        setShowModal(true);
        setFormData({ email: '', password: '', name: '' }); // Reset form data
        setErrorMessage(''); // Reset error message
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, name } = formData;

        try {
            if (modalType === 'signup') {
                const response = await axios.post('http://localhost:3000/api/user/register', { name, email, password });
                alert(response.data.message); // Show success message
            } else if (modalType === 'login') {
                const response = await axios.post('http://localhost:3000/api/user/login', { email, password });
                alert('Login successful!'); // Show success message
                setIsLoggedIn(true); // Set user as logged in
                setUserName(response.data.name); // Set the user's name after login
                localStorage.setItem('token', response.data.token); // Store token in localStorage
            }
            handleCloseModal();
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'An error occurred.'); // Show error message
        }
    };

    return (
        <Container style={{ marginBottom: '100px' }}>
            {/* Pasa el userName y el estado de autenticación al Header */}
            <Header isLoggedIn={isLoggedIn} userName={userName} onShowModal={handleShowModal} />
            <h1 className="mt-4" style={{ fontSize: '1.5em', marginBottom: '20px' }}>Catálogo de Productos</h1>
            <ProductList products={products} onAddToCart={handleAddToCart} />
            <FixedCart cart={cart} onClearCart={handleClearCart} />
            
            {/* Modal for Sign Up / Log In */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'signup' ? 'Sign Up' : 'Log In'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Show error message */}
                    <Form onSubmit={handleSubmit}>
                        {modalType === 'signup' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Remember Password"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {modalType === 'signup' ? 'Sign Up' : 'Log In'}
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Home;
