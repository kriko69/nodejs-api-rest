const { request ,response } = require("express");
const { User, Categoria, Producto } = require("../models");
const {ObjectId} = require("mongoose").Types;

const coleccionesPermitidas=[
    'categorias',
    'productos',
    'users',
    'roles'
];

const buscarUsuario=async (termino='',res=response)=>{
    const esMongoId=ObjectId.isValid(termino)
    if(esMongoId)
    {
        const usuarioDB = await User.findById(termino);
        return res.status(200).json({
            results: (usuarioDB)? [usuarioDB] : [] //si existe devuelvo un arreglo con el usuario, sino un arreglo vacio
        });
    }

    //termino no case sensitive
    const regex=new RegExp(termino,'i');
    
    const nombreUsuarios = await User.find({
        $or: [{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    });

    return res.status(200).json({
        results:nombreUsuarios
    });
    
};

const buscarCategoria=async (termino='',res=response)=>{
    const esMongoId=ObjectId.isValid(termino)
    if(esMongoId)
    {
        const categoriaDB = await Categoria.findById(termino);
        return res.status(200).json({
            results: (categoriaDB)? [categoriaDB] : [] //si existe devuelvo un arreglo con el usuario, sino un arreglo vacio
        });
    }

    //termino no case sensitive
    const regex=new RegExp(termino,'i');
    
    const categorias = await Categoria.find({
        $or: [{nombre:regex}],
        $and:[{estado:true}]
    });

    return res.status(200).json({
        results:categorias
    });
    
};

const buscarProducto=async (termino='',res=response)=>{
    const esMongoId=ObjectId.isValid(termino)
    if(esMongoId)
    {
        const productoDB = await Producto.findById(termino).populate('categoria','nombre');
        return res.status(200).json({
            results: (productoDB)? [productoDB] : [] //si existe devuelvo un arreglo con el usuario, sino un arreglo vacio
        });
    }

    //termino no case sensitive
    const regex=new RegExp(termino,'i');
    
    const productos = await Producto.find({
        $or: [{nombre:regex}],
        $and:[{estado:true}]
    }).populate('categoria','nombre');

    return res.status(200).json({
        results:productos
    });
    
};

const buscar= async (req=request,res=response)=>{
    const {coleccion,termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion))
    {
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch(coleccion){
        case 'categorias':
            buscarCategoria(termino,res);
            break;
        case 'productos':
            buscarProducto(termino,res);
            break;
        case 'users':
            buscarUsuario(termino,res);
            break;
        default:
            return res.status(500).json({
                msg:"se me olvido hacer esta busqueda"
            });
    }

}

module.exports={
    buscar
}