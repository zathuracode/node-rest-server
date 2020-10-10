const express= require('express');
const fs=require('fs');
const path=require('path');

const { verificaTokenUrl } =require('../middlewares/autenticacion');

let app=express();

app.get('/imagen/:tipo/:img',verificaTokenUrl,(req,res)=>{

    let tipo=req.params.tipo;
    let img=req.params.img;

    let notImagePath=path.resolve(__dirname,`../assets/no-image.jpg`);
    let pathImagen=path.resolve(__dirname,`../../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen)
    }else{
        res.sendFile(notImagePath);
    }

    

});

module.exports=app;