


// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else {
    urlDB = 'mongodb+srv://admin_node:trini1023@cluster0.b6kqb.mongodb.net/cafe'
}

process.env.URLDB = urlDB;
