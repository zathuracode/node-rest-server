//=====================
// PORT
//=====================
process.env.PORT=process.env.PORT || 3000

//=====================
// ENTORNO DEV o PROD
//=====================
process.env.NODE_ENV=process.env.NODE_ENV || 'dev'

//=========================
// VENCIMIENTO DEL TOKEN
//=========================

process.env.CADUCIDAD_TOKEN='48h'

//=========================
// SING AUTH
//=========================

process.env.SEED=process.env.SEED || 'S33d-D3s4rr0ll02020'

//=====================
// MongoDB
//=====================
let urlDB;

if(process.env.NODE_ENV==='dev'){
    console.log('Modo DEV');
    urlDB='mongodb://localhost:27017/cafe'
}else{
    console.log('Modo PROD');
    urlDB=process.env.MONGO
    //urlDB='mongodb+srv://dgomez:ugV4tqCo7VOPfNVH@cluster0.y2f2p.mongodb.net/cafe';
}

process.env.URLDB=urlDB;


//=====================
// Google Client ID
//=====================

process.env.CLIENT_ID=process.env.CLIENT_ID || '469415205253-6p9qm24gd7s6lca4eabkojout0bl40ce.apps.googleusercontent.com'