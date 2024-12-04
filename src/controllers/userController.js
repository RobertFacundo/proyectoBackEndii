import { userService } from '../services/userService.js';

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.render('users', { users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const savedUser = await userService.createUser(req.body);
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.render('userDetail', { user: user.toObject() });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};