require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose= require('mongoose');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Para injecte los metodos GET POST, etc de routes
app.use(require('./routes/usuario'));

const port=process.env.PORT;

mongoose.connect(process.env.URLDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
  }, (err,res)=>{

    if(err) throw err;

    console.log('Base de datos online');
});

app.listen(port,()=>{
    console.log(`Escuchando puerto:${port}`);
})