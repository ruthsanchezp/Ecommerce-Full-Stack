import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const Profile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch user data from the backend when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store the JWT token in localStorage
                    },
                });
                setUserData(response.data); // Set the fetched user data
            } catch (error) {
                setErrorMessage('Error fetching user data');
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:3000/api/user/profile', userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store the JWT token in localStorage
                },
            });
            setSuccessMessage(response.data.message);
        } catch (error) {
            setErrorMessage(error.response.data.message || 'Error updating user data');
        }
    };

    return (
        <Container>
            <h1 className="mt-4">Profile</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep the current password"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update Profile
                </Button>
            </Form>
        </Container>
    );
};

export default Profile;
