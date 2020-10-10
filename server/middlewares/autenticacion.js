const jwt = require('jsonwebtoken');

//=========================
// verificar token
//=========================
let verificaToken=(req,res,next)=>{

    let token=req.get('token');

    jwt.verify(token,process.env.SEED,(err,decoded)=>{
       if(err){
        return res.status(401).json({
            ok:false,
            error:{
                message:'Token invalido'
            }
        });
       }

       //console.log(decoded.usuario);
       req.usuario=decoded.usuario;
       next();

    })
}

let verificaTokenUrl=(req,res,next)=>{

    let token=req.query.token;

    jwt.verify(token,process.env.SEED,(err,decoded)=>{
       if(err){
        return res.status(401).json({
            ok:false,
            error:{
                message:'Token invalido'
            }
        });
       }
       
       req.usuario=decoded.usuario;
       next();

    })
}
//=========================
// verificar admin rol
//=========================
let verificaAdminRol=(req,res,next)=>{

    let usuario=req.usuario;
    //console.log(usuario);
    if(usuario==null || usuario.role!=='ADMIN_ROLE'){
        return res.status(401).json({
            ok:false,
            error:{
                message:'No es un administrador'
            }
        });
    }else{
        next();
    }
    
    
}

module.exports={
    verificaToken,verificaAdminRol,verificaTokenUrl
}