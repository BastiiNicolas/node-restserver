


// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// Vencimiento del token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// Secret
process.env.SECRET = process.env.SECRET || 'este-es-el-seed-desarrollo'

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '142519397680-g5cp6teombbltm8t2ncdnr8l5amub62v.apps.googleusercontent.com';
