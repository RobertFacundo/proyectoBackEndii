import UserDTO from '../dto/UserDTO.js';
import { UserRepository } from '../repositories/UserRepository.js';

export const userService = {
    getUsers: async () => {
        const users = await UserRepository.getAll();
        return users.map(user => new UserDTO(user));
    },

    createUser: async (userData) => {
        const newUser = await UserRepository.create(userData);
        return new UserDTO(newUser);
    },

    getUserById: async (id) => {
        const user = await UserRepository.getById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return new UserDTO(user);
    },

    updateUser: async (id, updateData) => {
        const updatedUser = await UserRepository.update(id, updateData);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return new UserDTO(updatedUser);
    },

    deleteUser: async (id) => {
        const deletedUser = await UserRepository.delete(id);
        if (!deletedUser) {
            throw new Error('User not found');
        }
        return deletedUser;
    },
};