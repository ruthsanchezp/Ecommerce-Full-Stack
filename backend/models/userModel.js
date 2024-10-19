const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// No se necesita hash ni comparación de contraseñas
module.exports = mongoose.model('User', userSchema);
