const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo.'
            }
        });
    }

    // Validar tipos
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son .' + tiposValidos.join(', '),
                tipo
            }
        });
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensiones permitidas son .' + extensionesValidas.join(', '),
                extension
            }
        });
    }

    // Cambiar nombre al archivo.
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case 'productos':
                imagenProducto(id, res, nombreArchivo)
                break;

            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
        }
    });
});


function imagenUsuario(usuarioId, res, nombreArchivo) {

    Usuario.findById(usuarioId, (err, usuarioDB) => {

        if (err) {
            borraArchivo(unombreArchivo, 'usuarios');
            return res.status(500).json({ ok: false, err });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({ ok: false, err: { message: 'Usuario no existe.' } });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioguardado) => {

            res.json({
                ok: true,
                usuario: usuarioguardado,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(productoId, res, nombreArchivo) {

    Producto.findById(productoId, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({ ok: false, err: { message: 'Producto no existe.' } });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}


function borraArchivo(nombreImg, tipo) {

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImg }`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}
module.exports = app;