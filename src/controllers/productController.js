import Product from '../dao/models/productModel.js';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products: products.map(product => product.toObject()) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('ID recibido:', id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('ID inválido');
            return res.status(400).json({ message: 'Invalid Product ID' });
        }

        const product = await Product.findById(id);
        console.log('Producto encontrado:', product);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.render('productDetail', product.toObject());
    } catch (error) {
        console.error('Error en getProductById:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};