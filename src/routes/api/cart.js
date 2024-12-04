import { Router } from 'express';
import passport from 'passport';
import authorizeUser from '../../middlewares/authorizeUser.js';
import { addProductToCart } from '../../controllers/cartController.js';

const router = Router();

//Ruta para agregar producto al carrito

router.post('/add-to-cart/:productid',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Token validado:', req.user); // Aquí debes ver los datos del usuario autenticado
        next();
    },
    authorizeUser,
    addProductToCart,
)

export default router;