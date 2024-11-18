// src/routes/api/products.js
import { Router } from 'express';

import {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} from '../../controllers/productController.js';

const router = Router();

// Definir las rutas para productos
router.get('/', getProducts); // Obtener todos los productos
router.post('/', createProduct); // Crear un nuevo producto
router.get('/:id', getProductById); // Obtener un producto por ID
router.put('/:id', updateProduct); // Actualizar un producto por ID
router.delete('/:id', deleteProduct); // Eliminar un producto por ID

export default router;