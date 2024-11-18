import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';

import cookieParser from 'cookie-parser';

import passport from 'passport';
import './config/passportConfig.js';

//importa modulos para trabajar con ruta de archivos
import path from 'path';
import { fileURLToPath } from 'url';

//importa ruta de vistas y de api
import router from './routes/views.js';
import apiRouter from './routes/api/index.js';

//Carga las variables de entorno!!
dotenv.config();

//inicializa la aplicacion de express
const app = express();
//define el puerto en el que se ejecturá la aplicaicon
const PORT = process.env.PORT || 3000;

// Uso de passport como middleware global para que se ejecute en todas las rutas
app.use(passport.initialize());

// ---------------------------
// Configuracion de handlebars
// ---------------------------

//obtiene el nombre del archivo actual y su directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); //define el directorio del archivo actual

//Configuracion del motor de plantillas handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//==============
// Middleware
//==============

//Middleware para procesar datos JSON
app.use(express.json()); //Permite a la aplicacion recibir datos en forma de JSON
app.use(express.urlencoded({ extended: true })); //Permite a la aplicacion recibir datos de formularios URL-encoded

//middleware cookie-parser para manejar las cookies en las rutas donde se verifican los JWTs.
app.use(cookieParser());
//------------------
// Rutas estaticas
//------------------

//Configura la carpeta publica para servir archivos estaticos
app.use(express.static(path.join(__dirname, '../public')));


//======================
// Rutas de API y vistas
//======================

//Configura las rutas para las vistas y la API

app.use('/api', apiRouter);
app.use('/', router);

//-----------------------------
// Conexion a Mongo DB
//-----------------------------

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conexion exitosa a MONGO Db'))
    .catch(err => console.log(err, 'Error al conectarse a MONGO DB'));

//--------------------------
// Iniciar el servidor
//--------------------------

app.listen(PORT, () => {
    console.log(`Servidor running at port ${PORT}`)
});