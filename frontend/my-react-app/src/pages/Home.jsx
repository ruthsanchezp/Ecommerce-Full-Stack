import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import { Container, Modal, Button, Form } from 'react-bootstrap';
import FixedCart from '../components/FixedCart';
import Header from '../components/Header';
import axios from 'axios';

const Home = () => {
    const [cart, setCart] = useState([]); // Estado para el carrito
    const [products, setProducts] = useState([]); // Estado para los productos
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de autenticación
    const [userName, setUserName] = useState(''); // Estado para el nombre del usuario
    const [showModal, setShowModal] = useState(false); // Estado para la visibilidad del modal
    const [modalType, setModalType] = useState(''); // Tipo de modal (Sign Up / Log In)
    const [formData, setFormData] = useState({ email: '', password: '', name: '' }); // Datos del formulario
    const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error

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

        fetchProducts(); // Llamar a la función para obtener productos
    }, []); // Ejecutar solo una vez cuando el componente se monta

    const handleAddToCart = (product) => {
        const existingProduct = cart.find(item => item.product._id === product._id);

        if (existingProduct) {
            setCart(cart.map(item =>
                item.product._id === product._id
                    ? { ...existingProduct, quantity: existingProduct.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]); // Agregar nuevo producto al carrito
        }
    };

    const handleDecreaseQuantity = (product) => {
        const existingProduct = cart.find(item => item.product._id === product._id);

        if (existingProduct) {
            if (existingProduct.quantity > 1) {
                setCart(cart.map(item =>
                    item.product._id === product._id
                        ? { ...existingProduct, quantity: existingProduct.quantity - 1 }
                        : item
                ));
            } else {
                setCart(cart.filter(item => item.product._id !== product._id)); // Eliminar producto si la cantidad es 0
            }
        }
    };

    const handleClearCart = () => {
        setCart([]); // Vaciar el carrito
    };


const handleCheckout = () => {
    navigate('/checkout', { 
        state: { 
            cart, 
            isLoggedIn, 
            userName 
        } 
    });
};


    // Funciones para manejar la visibilidad del modal
    const handleShowModal = (type) => {
        setModalType(type);
        setShowModal(true);
        setFormData({ email: '', password: '', name: '' }); // Resetear datos del formulario
        setErrorMessage(''); // Resetear mensaje de error
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
                alert(response.data.message); // Mensaje de éxito
            } else if (modalType === 'login') {
                const response = await axios.post('http://localhost:3000/api/user/login', { email, password });
                alert('Inicio de sesión exitoso!'); // Mensaje de éxito
                setIsLoggedIn(true); // Establecer al usuario como autenticado
                setUserName(response.data.name); // Establecer el nombre del usuario tras el inicio de sesión
                localStorage.setItem('token', response.data.token); // Almacenar token en localStorage
            }
            handleCloseModal();
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Ocurrió un error.'); // Mostrar mensaje de error
        }
    };

    // Calcular el total del carrito
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <Container style={{ marginBottom: '100px' }}>
            <Header 
                isLoggedIn={isLoggedIn} 
                userName={userName} 
                total={total} // Pasar el total al Header
                onCheckout={handleCheckout} // Pasar la función de checkout
                onShowModal={handleShowModal} 
            />
            <h1 className="mt-4" style={{ fontSize: '1.5em', marginBottom: '20px' }}>Catálogo de Productos</h1>
            <ProductList products={products} onAddToCart={handleAddToCart} onDecreaseQuantity={handleDecreaseQuantity} />
            <FixedCart cart={cart} onClearCart={handleClearCart} onCheckout={handleCheckout} />
            
            {}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'signup' ? 'Sign Up' : 'Log In'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Mostrar mensaje de error */}
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
