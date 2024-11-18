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

export const addUserOrProduct = async (req, res) => {
    try {
        if (req.body.password) {
            const user = new User(req.body);
            await user.save();
        } else {
            const product = new Product(req.body);
            await product.save();
        }

        return homePage(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}