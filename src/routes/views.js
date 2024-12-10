import { Router } from "express";
import User from '../dao/models/userModel.js';
import Products from '../dao/models/productModel.js';


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
    try {
        const { first_name, last_name, age, email, password } = req.body;
        const user = new User({ first_name, last_name, age, email, password });
        await user.save();

        console.log('Nuevo usuario creado:', {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email
        });


        res.status(201).json({ message: 'Usuario creado con éxito', user });
    } catch (error) {
        res.status(400).json({
            message: 'Error al crear el usuario',
            error: error.message,
            fields: Object.keys(error.errors || {})
        });
    }
});

// Ruta para eliminar un usuario desde postman
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido' });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
});

// Ruta para agregar un nuevo producto
router.post('/products', async (req, res) => {
    const { name, price, description } = req.body;
    const product = new Products({ name, price, description });

    try {
        await product.save();
        res.json(product.toObject()); 
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
});

export default router;