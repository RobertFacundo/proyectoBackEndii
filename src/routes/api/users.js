import { Router } from 'express';
import * as UserController from '../../controllers/userController.js';

const router = Router();

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);


export default router;