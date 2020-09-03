const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _=require('underscore');
const Usuario =require('../models/usuario');

app.post('/login', function (req, res) {

    let body=req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err) {
            return res.status(500).json({
                ok:false,
                error:err,
            });
        }

        if(usuarioDB===null){
            return res.status(400).json({
                ok:false,
                error:{
                    message:'*Usuario o contraseña incorrectos'
                }
            });
        }

        if(bcrypt.compareSync(body.password,usuarioDB.password)==false){
            return res.status(400).json({
                ok:false,
                error:{
                    message:'Usuario o *contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
          }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({ 
            ok:true,
            usuario:usuarioDB,
            token:token
        })
        
    })


    
})

module.exports=app;