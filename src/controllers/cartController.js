import User from '../dao/models/userModel.js';
import Product from '../dao/models/productModel.js';
import Cart from '../dao/models/cartModel.js';
import Ticket from '../dao/models/ticketsModel.js';
import crypto from 'crypto';

export const addProductToCart = async (req, res) => {
    console.log('Producto ID:', req.params.productid);
    console.log('Usuario:', req.user);

    const productId = req.params.productid;
    const userId = req.user._id;

    try {

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const user = await User.findById(userId).populate('cart');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (!user.cart) {
            const newCart = new Cart({ user: userId, products: [] });
            await newCart.save();
            user.cart = newCart._id;
            await user.save();
        }

        const cart = await Cart.findById(user.cart);
        const existingProduct = cart.products.find(
            (item) => item.product.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('products.product');

        return res.json({ message: 'Producto agregado al carrito', cart: populatedCart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error.message);
        return res.status(500).json({ message: 'Error interno al agregar al carrito', error: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    const { cid } = req.params;
    console.log('id del carrito del user', cid)
    try {
        const cart = await Cart.findById(cid).populate('products.product');
        console.log('Carrito encontrado:', cart);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        let totalAmount = 0;
        const notPurchased = [];

        console.log('Productos en el carrito:', cart.products);
        // Procesar cada producto en el carrito
        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                totalAmount += product.price * item.quantity;
                await product.save();
            } else {
                notPurchased.push(product._id); // Guardar productos sin suficiente stock
            }
        }

        // Generar ticket si hay productos comprados
        if (totalAmount > 0) {
            const ticket = new Ticket({
                code: crypto.randomBytes(16).toString('hex'),
                amount: totalAmount,
                purchaser: req.user.email // Suponiendo que tienes el email del usuario en el JWT
            });
            console.log('Ticket generado:', ticket);
            await ticket.save();
        }

        // Actualizar el carrito con productos no comprados
        cart.products = cart.products.filter(item => notPurchased.includes(item.product._id));
        await cart.save();

        res.status(200).json({
            message: 'Compra procesada',
            notPurchased,
            totalAmount
        });
    } catch (error) {
        console.error('Error al procesar la compra:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};