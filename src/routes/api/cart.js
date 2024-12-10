import { Router } from 'express';
import passport from 'passport';
import authorizeUser from '../../middlewares/authorizeUser.js';
import { addProductToCart, purchaseCart } from '../../controllers/cartController.js';

const router = Router();

router.post('/add-to-cart/:productid',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Token validado:', req.user);
        next();
    },
    authorizeUser,
    addProductToCart,
)

router.post('/:cid/purchase',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Token validado:', req.user);
        next();
    },
    authorizeUser,
    purchaseCart
);

export default router;