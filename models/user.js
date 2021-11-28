
/**
 * modelo de usuario para mongo
 */

const {Schema,model} = require('mongoose');

//definimos el esquema (la estructura de la "tabla" usuario)
const userSchema= Schema({

    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio'] //este mensaje es opcional porque igual validamos con middleware
    },
    correo:{
        type:String,
        required:[true,'El correo es obligatorio'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'La contrasena es obligatoria']
    },
    image:{
        type:String,
    },
    rol:{
        type:String,
        required:true,
        enum:['ADMIN_ROL','USER_ROL']
    },
    estado:{
        type:Boolean,
        default:true,
    },
    google:{
        type:Boolean,
        default:false
    },

});

//ocultar parametros, hacemos como oculto
userSchema.methods.toJSON=function(){
    const {__v,password,...user} = this.toObject(); //...user tiene todos los demas campos menos __v y password
    return user;
};

//mongoose agrega la 's' al final = Users
module.exports=model('User',userSchema); 