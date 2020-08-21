require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const port=process.env.PORT;

app.get('/usuario/:id', function (req, res) {
    let id=req.params.id;
  res.json({id:id});
})

app.post('/usuario', function (req, res) {
    let body=req.body;

    if(body.nombre===undefined){
        res.status(400).json({
            ok:false,
            error:'El nombre no esta completo',
        });
        return;
    }

    res.json({body:body})
})

app.put('/usuario', function (req, res) {
    res.json('PUT Usuario')
})

app.delete('/usuario', function (req, res) {
    res.json('DELETE Usuario')
})
 
app.listen(port,()=>{
    console.log(`Escuchando puerto:${port}`);
})