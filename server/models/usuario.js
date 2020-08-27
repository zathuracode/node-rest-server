const mongoose=require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema= mongoose.Schema;

let rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
}

let usuarioSchema= new Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El email es obligatorio']
    },
    password:{
        type:String,
        required:[true,'El password es obligatorio']
    },
    img:{
        type:String,
        required:[false]
    },
    role:{
        type:String,
        required:[true],
        default:'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type:Boolean,
        required:[true,'El estado es obligatorio'],
        default:true
    },
    google:{
        type:Boolean,
        required:[true,'El google es obligatorio'],
        default:false
    }

});

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'});

module.exports=mongoose.model('Usuario',usuarioSchema);

