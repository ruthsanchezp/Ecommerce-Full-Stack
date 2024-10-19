const express = require('express');
const { registerUser, loginUser, verifyToken, updateUser, getUserProfile } = require('../controllers/userController');
const verifyTokenMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas de usuario
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifytoken', verifyTokenMiddleware, verifyToken);

// Nueva ruta para obtener el perfil del usuario
router.get('/profile', verifyTokenMiddleware, getUserProfile);  // <- Aquí agregamos la nueva ruta

router.put('/update', verifyTokenMiddleware, (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios para actualizar" });
    }
    next();
}, updateUser);

module.exports = router;
