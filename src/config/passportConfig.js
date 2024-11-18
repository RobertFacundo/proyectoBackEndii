import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/userModel.js';
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
    try {
        const user = await User.findById(jwt_payload.id);
        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        return done(error, false)
    }
}));