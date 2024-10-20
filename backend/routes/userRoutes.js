const express = require('express');
const { registerUser, loginUser, verifyToken, updateUser,getUserProfile} = require('../controllers/userController');
const verifyTokenMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas de usuario
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifytoken', verifyTokenMiddleware, verifyToken);

// Nueva ruta para obtener el perfil del usuario
router.get('/profile', verifyTokenMiddleware, getUserProfile); 

// Ruta para actualizar el usuario
router.put('/update', verifyTokenMiddleware, (req, res, next) => {
    const { name, email } = req.body; // Solo verifica nombre y correo
    if (!name && !email) {  // Verifica que al menos uno esté presente
        return res.status(400).json({ message: "Se requiere al menos un campo (nombre o email) para actualizar" });
    }
    next(); // Procede a la función updateUser
}, updateUser);
module.exports = router;
