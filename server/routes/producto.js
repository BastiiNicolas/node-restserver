const express = require('express');
const _ = require('underscore');
const app = express();
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');


// ============================
// Mostrar todos los productos
// ============================
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) return res.status(400).json({ ok: false, err });
            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    productos
                });
            });
        });
});

// ============================
// Obtener un producto por ID
// ============================
app.get('/productos/:id', verificaToken, (req, res) => {

    let productoId = req.params.id;
    Producto.findById(productoId, {})
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {

            if (err) return res.status(400).json({ ok: false, err });
            res.json({
                ok: true,
                producto
            });
        });
});

// ============================
// Buscar un producto
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) return res.status(400).json({ ok: false, err });
            res.json({
                ok: true,
                productos
            });
        });
});

// ============================
// Crear un producto
// ============================
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) return res.status(400).json({ ok: false, err });

        res.json({ ok: true, producto: productoDB });

    });

});

// ============================
// Actualizar un producto
// ============================
app.put('/productos/:id', verificaToken, (req, res) => {

    let productoId = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    Producto.findByIdAndUpdate(productoId, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ============================
// Eliminar un producto
// ============================
app.delete('/productos/:id', verificaToken, (req, res) => {

    let productoId = req.params.id;
    Producto.findByIdAndUpdate(productoId, { disponible: false }, { new: true }, (err, productoBorrado) => {

        if (err) return res.status(400).json({ ok: false, err });
        if (!productoBorrado) return res.status(400).json({ ok: false, err: { message: 'Producto no encontrado.' } });
        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});

module.exports = app;