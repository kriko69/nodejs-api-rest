const {Producto,Categoria} = require('../models');
const { request, response } = require("express");


const getTodosProductos = async (req=request,res=response)=>{
    
    //cuantos registros quiero ver y desde donde
    const {limite=5,desde=0} = req.query;
    if(!isNaN(Number(limite)) && !isNaN(Number(desde)))
    {
        //casteamos a number porque llega como string
        const productos = await Producto.find({estado:true})
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario','nombre')
            .populate('categoria','nombre');
        
        res.json({
            productos,
            total:productos.length
        });
    }else{
        res.json({
            msg:"El limite o el desde deben ser valores numericos"
        });
    }

};

const getUnProducto=async (req,res) => {
    //obtengo el parametro que viene en la url
    const {id} = req.params;
    
    const producto = await Producto.findById(id).limit().populate('usuario','nombre').populate('categoria','nombre');
    if(!producto.estado)
    {
        return res.status(400).json({
            msg:`El producto producto ${producto.nombre} esta eliminada en la BD.`
        });
    }
    //console.log('nombrecito',producto.usuario.nombre);
    return res.status(200).json({
        producto
    });

}

const crearProducto = async (req=request,res=response)=>{
    
    const {precio,descripcion,categoria}=req.body;
    const nombre =req.body.nombre.toUpperCase();
    const userAuth=req.user;

    const existe = await Producto.findOne({nombre});
    if(existe)
    {
        return res.status(400).json({
            msg:`El producto ${nombre} ya existe.`
        });
    }

    const producto = new Producto({
        nombre,
        usuario:userAuth._id,
        precio,
        descripcion,
        categoria
    });

    try {
        await producto.save();
        return res.json({
            msg:"Se creo el producto exitosamente",
            producto
        });
    } catch (error) {
        console.log(error);
        return res.json({
            msg:'Error al intentar guardar el registro.'
        });
    } 

};

const actualizarProducto=async (req,res) => {
    //solo obtengo el ID 
    const {id} = req.params;
    //no quiero que modifique el _id, password, google, correo
    const nombre = req.body.nombre.toUpperCase(); 
    const {precio,descripcion,categoria}=req.body;
    const data={
        nombre,
        precio,
        descripcion,
        categoria
    }
    const productoDB = await Producto.findByIdAndUpdate(id, data,{new:true});
    //console.log('productoDB',productoDB);
    return res.status(200).json({
        msg:'producto actualizado',
        producto:productoDB
    })
}

const eliminarProducto=async (req,res) => {
    const {id} = req.params;

    const query={estado:false};
    const productoDB = await Producto.findByIdAndUpdate(id,query,{new:true});
    res.json({
        msg:'Producto eliminado',
        producto:productoDB
    });
    

    
}

module.exports={
    getTodosProductos,
    getUnProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}