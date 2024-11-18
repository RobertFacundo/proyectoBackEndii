import multer from "multer";
import path from 'path';

//Configuracion de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('public', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploader = multer({ storage });

export default uploader;