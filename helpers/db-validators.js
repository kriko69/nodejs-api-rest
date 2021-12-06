/**
 * este archivo contiene las funciones de las validaciones personalizadas (custom)
 * de los middleware de las rutas
 */

const Rol = require('../models/rol');
const User = require('../models/user');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const { collection } = require('../models/categoria');

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

const existeCategoria = async (id='')=>{
    //hacemos una busqueda por ID, pasandole el ID
    const existeCategoria = await Categoria.findById(id);
    //si no existe el usuario con el ID
    if(!existeCategoria)
    {
        //error personalizado de que el ID (usuario) no existe
        throw new Error(`La categoria con el id ${id} no esta registrado en la DB`);
    }

    if(!existeCategoria.estado)
    {
        //error personalizado de que el ID (usuario) no existe
        throw new Error(`La categoria con el id ${id}  esta eliminada en la DB`);
    }
}

const existeProducto = async (id='')=>{
    //hacemos una busqueda por ID, pasandole el ID
    const existeProducto = await Producto.findById(id);
    //si no existe el usuario con el ID
    if(!existeProducto)
    {
        //error personalizado de que el ID (usuario) no existe
        throw new Error(`El producto con el id ${id} no esta registrado en la DB`);
    }

    if(!existeProducto.estado)
    {
        //error personalizado de que el ID (usuario) no existe
        throw new Error(`El producto con el id ${id} esta eliminado en la DB`);
    }
}

//funcion para validar que el nombre de una categoria existe, nos para el nombre
const nombreCategoriaExiste = async (nombre)=>{

    const mayuscula=nombre.toUpperCase();

    //buscamos en la base de datos ese correo
    const existe = await Categoria.findOne({nombre:mayuscula});
    //console.log('middleware',existe);
    // no debe exiseir otro ya que queremos que sea unico
    if(existe)
    {
        //error personalizado
        throw new Error(`El nombre de la categoria ${mayuscula} ya esta registrado en la DB`);
    }
};

const nombreProductoExiste = async (nombre)=>{

    const mayuscula=nombre.toUpperCase();

    //buscamos en la base de datos ese correo
    const existe = await Producto.findOne({nombre:mayuscula});
    //console.log('middleware',existe);
    // no debe exiseir otro ya que queremos que sea unico
    if(existe)
    {
        //error personalizado
        throw new Error(`El nombre del producto ${mayuscula} ya esta registrado en la DB`);
    }
};

const coleccionesPermitidas=(coleccion='',colecciones=[])=>{
    const incluidas=colecciones.includes(coleccion);
    if(!incluidas)
    {
        throw new Error(`La coleccion ${coleccion} no es valida. Las validas son ${colecciones}`);
    }
};

//exportacion de funciones
module.exports={
    esRolValido,
    correoExiste,
    existeUsuario,
    nombreCategoriaExiste,
    existeCategoria,
    nombreProductoExiste,
    existeProducto,
    coleccionesPermitidas
}