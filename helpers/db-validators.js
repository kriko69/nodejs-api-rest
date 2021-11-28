/**
 * este archivo contiene las funciones de las validaciones personalizadas (custom)
 * de los middleware de las rutas
 */

const Rol = require('../models/rol');
const User = require('../models/user');

//funcion para validar un rol, nos pasa el rol que llega en la request
const esRolValido = async (rol='')=>{
    //buscamos en la base de datos ese rol
    const existeRol = await Rol.findOne({rol});
    //si no existe
    if(!existeRol)
    {
        //error personalizado
        throw new Error(`El rol ${rol} no esta registrado en la DB`);
    }
}

//funcion para vslidar que el correo existe, nos para el correo
const correoExiste = async (correo)=>{

    //buscamos en la base de datos ese correo
    const existeCorreo = await User.findOne({
        correo:correo //o solo correo
    });

    //si existe el correo
    // no debe exiseir otro ya que queremos que sea unico
    if(existeCorreo)
    {
        //error personalizado
        throw new Error(`El correo ${correo} ya esta registrado en la DB`);
    }
};

//funcion para validar un ID de usuario, nos pasa el ID
const existeUsuario = async (id='')=>{
    //hacemos una busqueda por ID, pasandole el ID
    const existeUser = await User.findById(id);
    //si no existe el usuario con el ID
    if(!existeUser)
    {
        //error personalizado de que el ID (usuario) no existe
        throw new Error(`El usuario con el id ${id} no esta registrado en la DB`);
    }
}

//exportacion de funciones
module.exports={
    esRolValido,
    correoExiste,
    existeUsuario
}