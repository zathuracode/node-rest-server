const express = require('express');
const app = express();
const _=require('underscore');
const { verificaToken,verificaAdminRol } =require('../middlewares/autenticacion');
const Categoria =require('../models/categoria');

app.get('/categoria/:id',(req,res)=>{
    let id=req.params.id;
    console.log(id);
    Categoria.findById(id,(err,categoriaDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

        return res.json({ 
            ok:true,
            categoria:categoriaDB
        })
    }).populate('usuario');
});

app.get('/categoria',(req,res)=>{
    Categoria.find({}).sort('descripcion').populate('usuario').exec((err,categoriaDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

        return res.json({ 
            ok:true,
            categoria:categoriaDB
        })
    });
});

app.post('/categoria',verificaToken,(req,res)=>{
    let body=req.body;

    let categoria=new Categoria({
        descripcion:body.descripcion,
        usuario:req.usuario._id
    });

    categoria.save((err,categoriaDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

        return res.json({ 
            ok:true,
            categoria:categoriaDB
        })
    });
});

app.put('/categoria/:id',verificaToken,(req,res)=>{

    let id=req.params.id;
    let body=req.body;

    let categoria={
        descripcion:body.descripcion,
        usuario:req.usuario._id
    };

    console.log(categoria)

    Categoria.findByIdAndUpdate(id,categoria,{new:true},(err,categoriaDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

        return res.json({ 
            ok:true,
            categoria:categoriaDB
        })
    });
});

app.delete('/categoria/:id',[verificaToken,verificaAdminRol],(req,res)=>{
    // Solo el administrador puede borrar categorias
    let id=req.params.id;
    Categoria.findByIdAndDelete(id,(err,categoriaDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

        return res.json({ 
            ok:true,
            categoria:categoriaDB
        })
    });

});


module.exports=app;