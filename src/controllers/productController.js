// src/controllers/productController.js
import Product from '../models/productModel.js';

// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products: products.map(product => product.toObject()) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.render('productDetail', product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un producto por ID
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un producto por ID
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};