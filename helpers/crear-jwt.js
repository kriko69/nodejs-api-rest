const jwt = require('jsonwebtoken');
require('dotenv').config();

const generarJWT=(id='')=>{
    return new Promise((resolve,reject)=>{
        const payload={uid:id};
        jwt.sign(payload,process.env.SECRETORPRIVATEKEY,{
            expiresIn   :'4h'
        },(err,token)=>{
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }
        });
    });

};

module.exports={
    generarJWT
}