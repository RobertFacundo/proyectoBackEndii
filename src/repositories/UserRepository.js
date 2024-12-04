import { userDAO } from "../dao/userDAO.js";

export const UserRepository = {
    getAll: async () => {
        return await userDAO.getAllUsers();
    },
    getById: async (id) => {
        return await userDAO.getUserById(id);
    },
    create: async (userData) => {
        return await userDAO.createUser(userData);
    },
    update: async (id, updateData) => {
        return await userDAO.updateUser(id, updateData);
    },
    delete: async (id) => {
        return await userDAO.deleteUser(id);
    },
};