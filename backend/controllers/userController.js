const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
        const newUser = await User.create({ name, email, password }); // Se crea el usuario sin hashing
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        // Comparar la contraseña directamente
        if (!user || password !== user.password) { // Comparación sin hashing
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Verificar token
exports.verifyToken = (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No se proporcionó token' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
        res.status(200).json({ message: 'Token válido', userId: decoded.id });
    });
};
exports.updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualiza los campos proporcionados
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;

        // Guarda los cambios
        await user.save();

        // Devuelve el usuario actualizado sin la contraseña
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Obtener perfil de usuario autenticado
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); // Excluir la contraseña
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user); // Devolver los datos del usuario sin contraseña
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
