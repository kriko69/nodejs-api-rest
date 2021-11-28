/**
 * aqui estan las funciones de cada ruta, una vez que pasan las validaciones los datos
 * que envia el cliente, pasan a esta funcion
 */

const {res,req} = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { validationResult } = require('express-validator');

const usuariosGet=async (req,res) => {
    //obtengo el parametro que viene en la url
    const id = req.params.id;
    //obtengo querys de la url "_apikey=123&lang=ES"
    //al desestructurar puedes poner un valor por defecto como en lang
    /*const {apikey,lang='ES'} = req.query;
    res.json({
        msg:'hola put - controller',
        id:id_usuario,
        api:apikey,
        language:lang
    });*/
    const usuario = await User.findById(id).limit();
    res.json({
        usuario
    });

}

const usuariosGetTodos=async (req,res) => {
    //cuantos registros quiero ver y desde donde
    const {limite=5,desde=0} = req.query;
    if(!isNaN(Number(limite)) && !isNaN(Number(desde)))
    {
        //casteamos a number porque llega como string
        const usuarios = await User.find({estado:true},{"rol":0}).skip(Number(desde)).limit(Number(limite));
        res.json({
            usuarios,
            total:usuarios.length
        });
    }else{
        res.json({
            msg:"El limite o el desde deben ser valores numericos"
        });
    }
    
}

const usuariosPost=async (req,res) => {

    //puedes desestructurar para obtener solo lo que te importa del body del request
    //si te envian otro valor no lo tomas encuenta, solo se toma en cuenta lo desestructurado
    const {nombre,correo,password,rol}=req.body;
    //creo un usuario con el Modelo
    const user= new User({nombre,correo,password,rol});

    //encriptar password
    const salt = bcryptjs.genSaltSync();
    user.password=bcryptjs.hashSync(password,salt);

    //guardar usuario en la DB
    await user.save();
    res.json({
        user
    });
    
}

const usuariosPut=async (req,res) => {
    //solo obtengo el ID 
    const {id} = req.params;
    //no quiero que modifique el _id, password, google, correo
    const {_id, password, google, correo, ...resto} = req.body; 

    //si tiene password la request
    if(password)
    {
        const salt = bcryptjs.genSaltSync();
        //lo actualizo
        resto.password=bcryptjs.hashSync(password,salt);
    }
    //actualizo el usuario buscando por ID
    const userDB = await User.findByIdAndUpdate(id, resto);

    res.json({
        msg:'usuario actualizado',
        usuario:userDB
    })
}

const usuariosDelete=async (req,res) => {
    const {id} = req.params;
    const query={estado:false};
    const userDB = await User.findByIdAndUpdate(id,query);
    res.json({
        msg:'Usuario eliminado',
        user:userDB
    })
}

//exporto modulos
module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosGetTodos
}