import { Router } from "express";
import userRoutes from './users.js';
import productRoutes from './products.js';
import sessionRoutes from './sessions.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/sessions', sessionRoutes);

export default router;