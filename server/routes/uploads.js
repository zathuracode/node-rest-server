const express = require('express');
const fileUpload = require('express-fileupload');

const fs=require('fs');
const path=require('path');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());
//app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', function(req, res) {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
          ok:false,
          err:{
              message:'No se ha seleccionado ningun archivo'
          }
      });
    }

    let tipo=req.params.tipo;
    let id=req.params.id;

    let tiposValidos=['productos','usuarios'];

    if(tiposValidos.indexOf(tipo)<0){
      return res.status(500).json({
        ok:false,
        err:{
          message:'No es una tipo valido los tipos validos son '+tiposValidos.join(', ')
        }
      });
    }
  
    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    //Validar extenciones
    let extensionesValidas=['png','jpg','gif','jpeg'];
    let nombreArchivo=archivo.name.split('.');
    let extension=nombreArchivo[nombreArchivo.length-1];

    if(extensionesValidas.indexOf(extension)<0){
      return res.status(500).json({
        ok:false,
        err:{
          message:'No es una extension valida puedes cargar extenciones '+extensionesValidas.join(', '),
          ext:extension
        }
      });
    }


    //Cambiar el nombre del archivo
    let nombreArchivoGenerado=`${id}-${new Date().getMilliseconds()}.${extension}`;
  
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivoGenerado}`, (err)=> {
      if (err){
        return res.status(500).json({
          ok:false,
          err:err
        });
      }

      //Aqui imagen cargada
      if(tipo==='usuarios'){
        imagenUsuario(id,res,nombreArchivoGenerado);
      }else if(tipo==='productos'){
        imagenProducto(id,res,nombreArchivoGenerado);
      }
      
  
        // res.json({
        //     ok:true,
        //     message:'Archivo subido con exito'
        // });
    });
  });


  function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id,(err,usuarioDB)=>{
      if(err) {
        borrarArchivo(nombreArchivo,'usuarios');
        return res.status(500).json({
            ok:false,
            error:err,
        });
      }
      
      if(!usuarioDB){
        borrarArchivo(nombreArchivo,'usuarios');
        return res.status(400).json({
          ok:false,
          err:{
              message:'Usuario no exito'
          }
        });
      }

      //Borra la imagen anterior
      borrarArchivo(usuarioDB.img,'usuarios');

      usuarioDB.img=nombreArchivo;

      usuarioDB.save((err,usuarioGuardado)=>{

        if(err) {
          return res.status(500).json({
              ok:false,
              error:err,
          });
        }

        res.json({
          ok:true,
          usuario:usuarioGuardado,
          img:nombreArchivo
        });

      });

    });
  }

  function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id,(err,productoDB)=>{
      if(err) {
        borrarArchivo(nombreArchivo,'productos');
        return res.status(500).json({
            ok:false,
            error:err,
        });
      }
      
      if(!productoDB){
        borrarArchivo(nombreArchivo,'productos');
        return res.status(400).json({
          ok:false,
          err:{
              message:'Producto no exito'
          }
        });
      }

      //Borra la imagen anterior
      console.log(productoDB.img);
      borrarArchivo(productoDB.img,'productos');

      productoDB.img=nombreArchivo;

      productoDB.save((err,productoGuardado)=>{

        if(err) {
          return res.status(500).json({
              ok:false,
              error:err,
          });
        }

        res.json({
          ok:true,
          producto:productoGuardado,
          img:nombreArchivo
        });

      });

    });
  }

  function borrarArchivo(nombreArchivo,tipo){
     let pathImagen=path.resolve(__dirname,`../../uploads/${tipo}/${nombreArchivo}`);
      if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
        console.log(`Borro Imagen Anterior:${pathImagen}`);
      }
  }

  module.exports = app;