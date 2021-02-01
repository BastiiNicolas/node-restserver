const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categorias', verificaToken, (req, res) => {

    Categoria.find({}, 'descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) return res.status(400).json({ ok: false, err });
            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    categorias
                });
            });
        });

});

// ============================
// Mostrar categoría por ID
// ============================
app.get('/categorias/:id', verificaToken, (req, res) => {

    let categoriaId = req.params.id;
    Categoria.findById(categoriaId, {})
        .exec((err, categoria) => {

            if (err) return res.status(400).json({ ok: false, err });
            res.json({
                ok: true,
                categoria
            });
        });

});

// ============================
// Crear categoría
// ============================
app.post('/categorias', [verificaToken, verificaRole], (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) return res.status(400).json({ ok: false, err });

        res.json({ ok: true, categoria: categoriaDB });

    });
});

// ============================
// Actualizar categoría
// ============================
app.put('/categorias/:id', [verificaToken, verificaRole], (req, res) => {

    let categoriaId = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(categoriaId, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Eliminar categoría
// ============================
app.delete('/categorias/:id', [verificaToken, verificaRole], (req, res) => {

    let categoriaId = req.params.id;

    Categoria.findByIdAndRemove(categoriaId, {}, (err, categoriaDB) => {
        if (err) return res.status(400).json({ ok: false, err });

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


module.exports = app;