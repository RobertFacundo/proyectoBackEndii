import User from './models/userModel.js';

export const userDAO = {
    getAllUsers: () => User.find(),
    getUserById: (id) => User.findById(id),
    createUser: (userData) => new User(userData).save(),
    updateUser: (id, updateData) => User.findByIdAndUpdate(id, updateData, { new: true }),
    deleteUser: (id) => User.findByIdAndDelete(id),
};