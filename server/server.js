require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const path = require('path');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Para injecte los metodos GET POST, etc de routes
app.use(require('./routes/index'));

console.log(path.resolve(__dirname,'../'));

//Habilitar la carpeta public
const publicPath=path.resolve(__dirname,'../public');
app.use(express.static(publicPath));

const port=process.env.PORT;

mongoose.connect(process.env.URLDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify: false 
  }, (err,res)=>{

    if(err) throw err;

    console.log('Base de datos online');
});

app.listen(port,()=>{
    console.log(`Escuchando puerto:${port}`);
})