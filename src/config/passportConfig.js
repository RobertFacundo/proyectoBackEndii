import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../dao/models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        console.log('Autenticando:', email, password);
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });

            const isMatch = user.comparePassword(password);
            if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    console.log('JWT Payload recibido:', jwt_payload);  
    try {
        const user = await User.findById(jwt_payload.userId);
        if (!user) {
            console.log('Usuario no encontrado');
            return done(null, false);
        }
        console.log('Usuario autenticado:', user);
        return done(null, user);
    } catch (error) {
        console.log('Error en la estrategia JWT:', error);
        return done(error, false);
    }
}));