import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import Header from '../components/Header'; // Import the Header component

const Profile = () => {
    const [userData, setUserData] = useState({ 
        name: '', 
        email: '', 
        phone: '',  // New optional field
        address: '' // New optional field
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUserData(response.data);
            } catch (error) {
                setErrorMessage('Error al obtener los datos del usuario.');
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = { ...userData };
            if (newPassword) {
                updatedData.password = newPassword; // Only update password if provided
            }

            // Send updated data to the server
            const response = await axios.put('http://localhost:3000/api/user/update', updatedData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setUserData(response.data); // Update local userData with response data
            setSuccessMessage('¡Perfil actualizado con éxito!');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Error al actualizar el perfil.');
        }
    };

    return (
        <Container>
            {/* Include the Header component */}
            <Header 
                isLoggedIn={!!localStorage.getItem('token')} 
                userName={userData.name} 
                onShowModal={() => {}} // Replace with actual modal handling if needed
            />
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
                <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>Teléfono (opcional)</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formAddress" className="mb-3">
                    <Form.Label>Dirección (opcional)</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Contraseña (Si quieres cambiarla)</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={handlePasswordChange} 
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
