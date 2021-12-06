
/**
 * modelo de usuario para mongo
 */

 const {Schema,model} = require('mongoose');

 //definimos el esquema (la estructura de la "tabla" usuario)
 const productoSchema= Schema({
 
     nombre:{
         type:String,
         required:[true,'El nombre es obligatorio'] //este mensaje es opcional porque igual validamos con middleware
     },
     usuario:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
     estado:{
         type:Boolean,
         default:true,
         required:true
     },
     precio:{
         type:Number,
         default:0
     },
     categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true
    },
    descripcion:{
        type:String
    },
    disponible:{
        type:Boolean,
        default:true
    },
    image:{
        type:String,
    }
 
 });
 
 //ocultar parametros, hacemos como oculto
 productoSchema.methods.toJSON=function(){
     const {__v,estado,...producto} = this.toObject(); //...user tiene todos los demas campos menos __v y password
     return producto;
 };
 
 //mongoose agrega la 's' al final = Users
 module.exports=model('Producto',productoSchema); 