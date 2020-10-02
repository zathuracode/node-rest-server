const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _=require('underscore');
const Usuario =require('../models/usuario');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

//Configuracion de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    
    const payload = ticket.getPayload();

    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }

}


app.post('/google', async (req, res)=> {
    let token=req.body.idtoken;
    console.log(token);
    let googleUser= await verify(token)
    .catch(e=>{
                return res.status(403).json( {
                            ok:false,
                            error:e
                        });
                }
            );
    
    //Buscar si existe un usuario con ese email
    Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{
        if(err) {
            return res.status(500).json({
                ok:false,
                error:err,
            });
        }

        if(usuarioDB){
            if(usuarioDB.google===false)
            return res.status(400).json({
                ok:false,
                error:{
                    message:'*Usuario o contraseña incorrectos no es de google debe usar us autenticación normal'
                }
            });
        }

        if(usuarioDB===null){
            let usuario=new Usuario();
            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img=googleUser.img;
            usuario.google=true;
            usuario.password=':)';

            usuario.save((err,usuarioDB)=>{
                if(err) {
                    return res.status(500).json({
                        ok:false,
                        error:err,
                    });
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

    // res.json({
    //     usuario:googleUser
    // });
});

module.exports=app;