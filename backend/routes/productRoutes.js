const express = require('express');
const { registerUser, loginUser, updateUser } = require('../controllers/userController'); // Controladores del usuario
const { readAllProducts } = require('../controllers/productController'); // Controlador de productos
const verifyTokenMiddleware = require('../middleware/authMiddleware'); // Middleware de autenticación

const router = express.Router();

// Rutas de usuario
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifytoken', verifyTokenMiddleware, (req, res) => res.status(200).json({ message: 'Token is valid' })); // Ruta para verificar el token
router.put('/profile', verifyTokenMiddleware, updateUser); // Ruta para actualizar el perfil del usuario

// Ruta para obtener todos los productos
router.get('/readall', readAllProducts); // Añadir la ruta para leer todos los productos

module.exports = router;
