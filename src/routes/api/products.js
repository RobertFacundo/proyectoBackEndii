// src/routes/api/products.js
import { Router } from 'express';
import passport from 'passport';
import authorizeRole from '../../middlewares/authorizeRole.js';

import {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} from '../../controllers/productController.js';

const router = Router();


// Obtener todos los productos
router.get('/',
    passport.authenticate('jwt', { session: false }),
    getProducts);

// Crear un nuevo producto
router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Token validado', req.user); // Aquí puedes ver si el token es válido y el usuario es correcto
        next(); // Esto pasa al siguiente middleware (authorizeRole)
    },
    authorizeRole(['admin']),
    (req, res, next) => {
        console.log('Usuario tiene acceso adecuado:', req.user); // Verifica que el rol sea 'admin'
        next(); // Pasa a la creación del producto
    },
    createProduct);

// Obtener un producto por ID
router.get('/:id', passport.authenticate('jwt', { session: false }), getProductById);

// Actualizar un producto por ID
router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeRole(['admin']),
    updateProduct);

// Eliminar un producto por ID
router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeRole(['admin']),
    deleteProduct);

export default router;