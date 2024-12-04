import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const homePage = async (req, res) => {
    try {
        const users = await User.find();
        const products = await Product.find();
        res.render('home', { users, products })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};