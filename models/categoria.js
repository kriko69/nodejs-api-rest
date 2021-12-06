const {Schema,model} = require('mongoose');

const categoriaSchema= Schema({

    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type:Boolean,
        default:true,
        require: true
    },
    //quien lo creo
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
    

});

//ocultar parametros, hacemos como oculto
categoriaSchema.methods.toJSON=function(){
    const {__v,estado,...categoria} = this.toObject(); //...user tiene todos los demas campos menos __v y password
    return categoria;
};

//mongoose agrega la 's' al final = Users
module.exports=model('Categoria',categoriaSchema); 