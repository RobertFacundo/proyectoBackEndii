import User from '../dao/models/userModel.js';
import Product from '../dao/models/productModel.js';
import Cart from '../dao/models/cartModel.js';

export const addProductToCart = async (req, res) => {
    console.log('Producto ID:', req.params.productid);
    console.log('Usuario:', req.user);

    const productId = req.params.productid;
    const userId = req.user._id;

    try {
        // Verifica que el producto exista
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Encuentra al usuario
        const user = await User.findById(userId).populate('cart');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si el usuario no tiene un carrito, crea uno nuevo
        if (!user.cart) {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            user.cart = newCart._id;
            await user.save();
        }

        // Agrega el producto al carrito
        const cart = await Cart.findById(user.cart);
        const existingProduct = cart.products.find(
            (item) => item.product.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += 1; // Incrementa la cantidad si ya existe el producto
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('products.product');

        return res.json({ message: 'Producto agregado al carrito', cart: populatedCart});
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error.message);
        return res.status(500).json({ message: 'Error interno al agregar al carrito', error: error.message });
    }
};