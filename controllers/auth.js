const { req,res, response, request } = require("express")
const User = require('../models/user');

const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/crear-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login =async (req ,res )=>{
    const {correo,password} = req.body;

    try {
        //verificar que el usuario existe a traves del correo
        const user=await User.findOne({correo});
        if (!user) {
            return res.status(401).json({
                msg:"Usuario o password incorrectos. El usuario no existe."
            });
        }
        //verificar que el usuario no este eliminado
        if(!user.estado)
        {
            return res.status(401).json({
                msg:"Usuario o password incorrectos. El usuario se encuentra eliminado."
            });
        }

        //verificar que el password sea la misma
        const validPass = bcryptjs.compareSync(password,user.password);
        if(!validPass)
        {
            return res.status(401).json({
                msg:"Usuario o password incorrectos. El password es incorrecto."
            });
        }

        //generar JWT
        const token=await generarJWT(user.id);
        
        return res.status(200).json({
            user:user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:"Error hable con su administrador."
        });
    }

};

const google = async(req=request,res=response)=>{

    //obtenemos el token de google
    const {id_token} = req.body;
    
    try {
        //verificamos el token y obtenemos los atributos
        const {nombre,image,correo}=await googleVerify(id_token);
        
        //vemos si el usuario ya existe
        let usuario = await User.findOne({correo,google:true});
        //si no lo creamos
        if(!usuario)
        {
            //creamos lo atributos del nuevo usuario
            const data={
                nombre,
                correo,
                password:':)', //da igual el password ya que no coindira nunca
                image,
                google:true,
                rol:'USER_ROL' //le damos un rol, podemos modificar el modelo para que tenga uno por defecto y ya no seria necesario esto
            }

            //creamos usuario
            usuario = new User(data);
            //guardamos
            await usuario.save();
        }

        //si el usuario estaria eliminado
        if(!usuario.estado)
        {
            return res.status(400).json({
                msg:'El usuario se encuentra en la DB como eliminado.'
            });
        }

        //generar JWT con el id del nuevo usuario
        const token=await generarJWT(usuario.id);
        
        return res.status(200).json({
            user:usuario,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg:"Error al decodificar el token.",
        });
    }

};

module.exports={
    login,
    google
}