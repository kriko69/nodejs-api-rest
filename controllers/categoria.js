const {Categoria} = require('../models');
const { request, response } = require("express");


const getTodasCategorias = async (req=request,res=response)=>{
    
    //cuantos registros quiero ver y desde donde
    const {limite=5,desde=0} = req.query;
    if(!isNaN(Number(limite)) && !isNaN(Number(desde)))
    {
        //casteamos a number porque llega como string
        const categorias = await Categoria.find({estado:true}).skip(Number(desde)).limit(Number(limite)).populate('usuario','nombre');
        res.json({
            categorias,
            total:categorias.length
        });
    }else{
        res.json({
            msg:"El limite o el desde deben ser valores numericos"
        });
    }

};

const getUnaCategoria=async (req,res) => {
    //obtengo el parametro que viene en la url
    const {id} = req.params;
    
    const categoria = await Categoria.findById(id).limit().populate('usuario','nombre');
    if(!categoria.estado)
    {
        return res.status(400).json({
            msg:`La categoria ${categoria.nombre} esta eliminada en la BD.`
        });
    }
    //console.log('nombrecito',categoria.usuario.nombre);
    return res.status(200).json({
        categoria
    });

}

const crearCategoria = async (req=request,res=response)=>{
    
    const nombre=req.body.nombre.toUpperCase();
    const userAuth=req.user;

    const existe = await Categoria.findOne({nombre});
    if(existe)
    {
        return res.status(400).json({
            msg:`La categoria ${nombre} ya existe.`
        });
    }

    const categoria = new Categoria({
        nombre,
        usuario:userAuth._id
    });

    try {
        await categoria.save();
        return res.json({
            categoria
        });
    } catch (error) {
        console.log(error);
        return res.json({
            msg:'Error al intentar guardar el registro.'
        });
    } 

};

const actualizarCategoria=async (req,res) => {
    //solo obtengo el ID 
    const {id} = req.params;
    //no quiero que modifique el _id, password, google, correo
    const nombre = req.body.nombre.toUpperCase(); 

    //console.log('uid',req.uid);
    //const usuario=req.uid;
    /*const data={
        nombre,
        usuario
    };*/

    //actualizo el usuario buscando por ID
    //el {new:true} nos devolvera el contenido del objeto con los valores actualizados
    //asi podemos mostrar
    const categoriaDB = await Categoria.findByIdAndUpdate(id, {nombre},{new:true});
    //console.log('categoriaDB',categoriaDB);
    return res.status(200).json({
        msg:'categoria actualizada',
        categoria:categoriaDB
    })
}

const eliminarCategoria=async (req,res) => {
    const {id} = req.params;

    const query={estado:false};
    const categoriaDB = await Categoria.findByIdAndUpdate(id,query,{new:true});
    res.json({
        msg:'Categoria eliminada',
        categoria:categoriaDB
    });
    

    
}

module.exports={
    getTodasCategorias,
    getUnaCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}