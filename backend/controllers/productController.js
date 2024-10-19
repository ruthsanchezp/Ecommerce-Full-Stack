const Product = require('../models/productModel');


// Crear producto
exports.createProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const userId = req.userId; // Obtener el ID del usuario de la verificación del token

    try {
        const newProduct = await Product.create({
            name,
            description,
            price,
            user: userId // Puedes mantener el usuario si deseas asociar el producto al usuario
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Leer todos los productos
exports.readAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('user'); // Si no utilizas user, puedes eliminar el populate
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Leer un producto específico
exports.readOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
