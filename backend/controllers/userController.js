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
        const newUser = await User.create({ name, email, password }); // Create user with only name, email, and password
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
    const { email, name, phone, address, password } = req.body; // Allow optional fields
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Update the fields that are provided
        user.email = email || user.email; // Update only if a new email is provided
        user.name = name || user.name; // Update name if provided
        user.phone = phone || user.phone; // Update phone if provided
        user.address = address || user.address; // Update address if provided
        if (password) {
            user.password = password; // Update password if provided
        }

        // Save changes
        await user.save();

        // Return updated user data without password
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
