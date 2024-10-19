import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Profile = () => {
    const [userData, setUserData] = useState({ name: '', email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Fetch user data from backend on component mount
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUserData(response.data); // Set user data (name, email)
            } catch (error) {
                setErrorMessage('Error fetching user data.');
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send update request to the backend
            await axios.put('http://localhost:3000/api/user/update', userData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccessMessage('Profile updated successfully!');
            setErrorMessage(''); // Clear any error message
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Error updating profile.');
        }
    };

    return (
        <Container>
            <h2>Mi Perfil</h2>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
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
                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Nueva Contraseña (opcional)</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Dejar en blanco si no deseas cambiarla"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Actualizar Perfil
                </Button>
            </Form>
        </Container>
    );
};

export default Profile;
