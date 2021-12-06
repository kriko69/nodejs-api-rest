const { request,response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const validarJWT=async(req=request,res=response,next)=>{
    //obtener el token
    const token = req.body.token || req.query.token || req.header('x-access-token');
    //si no hay token
    if(!token){ 
        return res.status(403).json({
            msg:"El token es obligatorio."
        });
    }
    //si hay
    try {
        //obtendo el uid que se encuentra dentro del token
        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        //obtengo el usuario de la DB
        const user=await User.findById(uid);

        //si el usuario del token no existe
        if(!user)
        {
            return res.status(400).json({
                msg:"Token incorrecto, usuario no existe en DB."
            });
        }

        //si no esta eliminado
        if(!user.estado){
            return res.status(400).json({
                msg:"Token incorrecto, usuario  eliminado."
            });
        }

        //pasamos parametros a otros middleware
        req.uid=uid;
        req.user=user;

    }catch (error) {
        if(error.name==='TokenExpiredError')
        {
            return res.status(403).json({
                msg:"El token ha expirado. Inicie sesion nuevamente.    "
            });
        }else{
            console.log(error);
            return res.status(403).json({
                msg:"Token invalido."
            });
        }
    }
    return next();
};


module.exports={
    validarJWT
}