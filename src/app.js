import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import { config } from './config/config.js';

import cookieParser from 'cookie-parser';

import passport from 'passport';
import './config/passportConfig.js';

//importa modulos para trabajar con ruta de archivos
import path from 'path';
import { fileURLToPath } from 'url';

//importa ruta de vistas y de api
import apiRouter from './routes/api/index.js';
import router from './routes/views.js';
import cartRoutes from './routes/api/cart.js';
import passwordResetRoutes from './routes/api/passwordReset.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Uso de passport como middleware global para que se ejecute en todas las rutas
app.use(passport.initialize());

// ---------------------------
// Configuracion de handlebars
// ---------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//==============
// Middleware
//==============

//Middleware para procesar datos JSON
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.use(cookieParser());

//======================
// Rutas de API y vistas
//======================

//Configura las rutas para las vistas y la API
app.use('/api/cart', cartRoutes);
app.use('/api', apiRouter);
app.use('/', router);
app.use('/password-reset', passwordResetRoutes);

//------------------
// Rutas estaticas
//------------------

app.use(express.static(path.join(__dirname, '../public')));

//-----------------------------
// Conexion a Mongo DB
//-----------------------------

mongoose.connect(config.mongodbUri)
    .then(() => console.log('Conexion exitosa a MONGO Db'))
    .catch(err => console.log(err, 'Error al conectarse a MONGO DB'));

//--------------------------
// Iniciar el servidor
//--------------------------

app.listen(config.port, () => {
    console.log(`Servidor running at port ${config.port}`)
});