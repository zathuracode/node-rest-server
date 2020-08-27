//=====================
// PORT
//=====================
process.env.PORT=process.env.PORT || 3000

//=====================
// ENTORNO DEV o PROD
//=====================
process.env.NODE_ENV=process.env.NODE_ENV || 'dev'

//=====================
// MongoDB
//=====================
let urlDB;

if(!process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/cafe'
}else{
    urlDB=process.env.MONGO
}

process.env.URLDB=urlDB;