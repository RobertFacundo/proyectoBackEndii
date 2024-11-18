import { Router } from "express";
import User from '../models/userModel.js';
import Products from '../models/productModel.js';


const router = Router();

//Ruta principal

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        const products = await Products.find();
        res.render('home', { title: 'Home', users: users.map(user => user.toObject()), products: products.map(product => product.toObject()) });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
});

// Ruta para agregar un nuevo usuario
router.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    try {
        await user.save();
        res.json(user.toObject()); // Devuelve el usuario recién creado
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
});

// Ruta para agregar un nuevo producto
router.post('/products', async (req, res) => {
    const { name, price, description } = req.body;
    const product = new Products({ name, price, description });

    try {
        await product.save();
        res.json(product.toObject()); // Devuelve el producto recién creado
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
});

export default router;