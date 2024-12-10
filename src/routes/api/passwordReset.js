import express from 'express';
import crypto from 'crypto';
import { passwordResetToken } from '../../dao/models/passwordResetToken.js';
import User from '../../dao/models/userModel.js';
import { sendEmail } from '../../config/mailerConfig.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/send-reset', (req, res) => {
    res.render('send-reset'); 
});

router.post('/send-reset', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) res.status(401).json({ message: 'Usuario no encontrado' });

    const plainToken = crypto.randomBytes(32).toString('hex');
    console.log('Token generado:', plainToken);
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    await passwordResetToken.create({ userId: user._id, token: plainToken, expiresAt });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${plainToken}`;

    await sendEmail({
        to: email,
        subject: 'Restablecer contraseña',
        html: `<p>Haz clic en el enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer contraseña</a></p>`
    });

    res.json({ message: 'Correo enviado' })
});

router.get('/reset-password', async (req, res) => {
    const { token } = req.query;
    console.log("Token recibido en la URL:", token);
   
    try {
        const resetToken = await passwordResetToken.findOne({ token });
        if (!resetToken) {
            console.log("No se encontró el token en la base de datos.");
            return res.redirect('/send-reset'); 
        }

        if (resetToken.expiresAt < new Date()) {
            console.log("Token expirado:", resetToken.expiresAt);
            console.log('Redirigiendo a plantilla de send-reset')
            return res.redirect('/password-reset/send-reset');
        }

        res.render('reset-password', { token }); 
    } catch (error) {
        console.error("Error en el proceso de validación del token:", error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    console.log("Token recibido en el body:", token); 
    console.log("Nueva contraseña:", newPassword);

    const resetToken = await passwordResetToken.findOne({ token });
    if (!resetToken || resetToken.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Token invalido o expirado' });
    };

    const user = await User.findById(resetToken.userId);
    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
        return res.status(400).json({ message: 'No puedes usar la misma contraseña' });
    }

    user.password = newPassword;
    await user.save();

    await passwordResetToken.deleteOne({ token });

    res.json({ message: 'Contraseña establecida con éxito' });
});

router.post('/resend-reset', async (req, res) => {
    const { email } = req.body;

    const user = User.findOne({ email });
    if (!user) return res.status(401), json({ message: 'Uusario no encontrado' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    await passwordResetToken.deleteMany({ userId: user._id });
    await passwordResetToken.create({ userId: user._id, token, expiresAt });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail({
        to: email,
        subject: 'Nuevo enlace para restablecer contraseña',
        html: `<p>Haz clic en el enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer contraseña</a></p>`,
    });

    res.json({ message: 'Correo enviado' });
});

export default router;
