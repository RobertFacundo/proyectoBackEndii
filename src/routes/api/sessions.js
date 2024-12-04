// src/routes/api/sessions.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../../dao/models/userModel.js';
import UserDTO from '../../dto/UserDTO.js';

const router = Router();

// Ruta de login, se utilizará Passport para la estrategia de autenticación local
router.post('/login', (req, res, next) => {
    console.log('Login request received');
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('Passport authentication result:', { err, user, info });
        if (err) {
            console.error('Error interno del servidor:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (!user) {
            console.log('Usuario no encontrado o contraseña incorrecta');
            return res.status(401).json({ message: info.message || 'Usuario o contraseña incorrectos' });
        }

        // Si la autenticación es exitosa, generamos el token
        try {
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log('Token generado:', token);
            return res.json({
                message: 'Login exitoso',
                token: token
            });
        } catch (error) {
            console.error('Error al generar el token:', error);
            return res.status(500).json({ message: 'Error interno al generar el token' });
        }
    })(req, res, next);
});
// Ruta "current" para obtener los datos del usuario asociado al JWT
router.get('/current', (req, res) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' })
        }

        try {
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User Not Found' });
            }
            // Transformar el usuario con el DTO antes de enviarlo
            const userDTO = new UserDTO(user);
            res.json(userDTO);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
});

export default router;