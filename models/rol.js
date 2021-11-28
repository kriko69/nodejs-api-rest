
const {Schema,model} = require('mongoose');

const rolSchema= Schema({

    rol:{
        type:String,
        required:[true,'El rol es obligatorio']
    },
});
//mongoose agrega la 's' al final = roles
module.exports=model('role',rolSchema); 