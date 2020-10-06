const express = require("express");
const app = express();
const { verificaToken } = require("../middlewares/autenticacion");
const Producto = require("../models/producto");

app.get("/producto/:id", (req, res) => {
  let id = req.params.id;
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    }

    return res.json({
      ok: true,
      producto: productoDB,
    });
  })
    .populate("usuario")
    .populate("categoria");
});

app.get("/producto", (req, res) => {
  Producto.find({})
    .sort("descripcion")
    .populate("usuario")
    .populate("categoria")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err,
        });
      }

      return res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

app.post("/producto", verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    }

    return res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

app.put("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let producto = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id,
  };

  Producto.findByIdAndUpdate(id, producto, { new: true }, (err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    }

    return res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

app.delete("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  let producto = {
    disponible: false,
  };

  console.log(producto);

  Producto.findByIdAndUpdate(id, producto, { new: true }, (err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err,
      });
    }

    return res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

module.exports = app;
