const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _=require('underscore');
const Usuario =require('../models/usuario');
const { verificaToken,verificaAdminRol } =require('../middlewares/autenticacion');

//Recibe el middlewares verificaToken
app.get('/usuario',verificaToken,function (req, res) {

    const estado=true;

    //Obtengo la informacion del usuario que se puso en el request en el middleware
    let usuario=req.usuario;
    let desde=Number(req.query.desde) || 0;
    let limite=Number(req.query.limite) || 5;

    //Se pueden enviar condiciones en {}
    //El segundo es para filtrar lo que queremos regresar
    Usuario.find({estado:estado},'nombre role estado email google img').
    skip(desde).
    limit(limite).
    exec((err,usuarios)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

        Usuario.countDocuments({estado:estado},(err,conteo)=>{
            return res.json({ 
                ok:true,
                usuario:usuarios,
                cuantos:conteo
            })
        })
    });
});

app.get('/usuario/:id',verificaToken, function (req, res) {
    let id=req.params.id;
    Usuario.findById(id,(err,usuarioDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

         //Para que no retorne el password retorna ****
         usuarioDB.password='****';

        return res.json({ 
            ok:true,
            usuario:usuarioDB
        })
    });
})

app.post('/usuario',[verificaToken,verificaAdminRol], function (req, res) {

    let body=req.body;

    let usuario=new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        role:body.role
    });

    usuario.save((err,usuarioDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

        //Para que no retorne el password retorna ****
        usuarioDB.password='****';

        return res.json({ 
            ok:true,
            usuario:usuarioDB
        })
    });
})

app.put('/usuario/:id',[verificaToken,verificaAdminRol], function (req, res) {

    let id=req.params.id;
    //let body=req.body;
    //Para sacar las propiedades que deseo modificar se envia el arreglo con las permitidas
    let arreglo=['nombre','email','img','role','estado'];
    let body=_.pick(req.body,arreglo);

    Usuario.findByIdAndUpdate(id,body,{new:true},(err,usuarioDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

        return res.json({ 
            ok:true,
            usuario:usuarioDB
        })
    })
})

// app.delete('/usuario/:id', function (req, res) {
//     let id=req.params.id;
//     Usuario.findByIdAndDelete(id,(err,  usuarioBorrado)=>{
//         if(err) {
//             return res.status(400).json({
//                 ok:false,
//                 error:err,
//             });
//         }
//         if(usuarioBorrado===null){
//             return res.json({ 
//                 ok:true,
//                 error:{
//                     message:'Usuario no existe'
//                 }
//             })
//         }

//         return res.json({ 
//             ok:true,
//             usuario:usuarioBorrado
//         })
//     });
// })


app.delete('/usuario/:id',[verificaToken,verificaAdminRol], function (req, res) {
    let id=req.params.id;
   
    // let arreglo=['estado'];
    // let body=_.pick(req.body,arreglo);

    // body.estado=false;


    Usuario.findByIdAndUpdate(id,{estado:false},{},(err,usuarioDB)=>{
        if(err) {
            return res.status(400).json({
                ok:false,
                error:err,
            });
        }

        if(usuarioDB===null){
            return res.json({ 
                ok:true,
                error:{
                    message:'Usuario no existe'
                }
            })
        }

        return res.json({ 
            ok:true,
            usuario:usuarioDB
        })
    })
   
})


module.exports=app;