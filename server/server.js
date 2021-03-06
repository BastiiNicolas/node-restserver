const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('./config/config');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//Habilitar web
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,
    {
                useNewUrlParser: true,
                useCreateIndex: true
            },
    (err, res) => {

    if (err) throw new Error();
    console.log('Base de datos online.');
});
app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto ${process.env.PORT}`));
