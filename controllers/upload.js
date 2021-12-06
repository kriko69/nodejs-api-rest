const { response, request } = require('express');



const { subirArchivo } = require('../helpers/subir-archivo');
const { User, Producto } = require('../models');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);  

const cargarImage=async (req,res=response) => {

        
   try{
    const subir=await subirArchivo(req.files,['png','jpg','jpeg','gif'],'usuarios');
    return res.json(subir);
   }catch(msg){
    res.status(400).json({
        msg
    });
   }

}

const ActualizarImagenCloudinary=async (req=request,res=response)=>{
    const {coleccion,id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un usuario con el ID: ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un producto con el ID: ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg:"Se me olvide validar esto"
            });
            break;
    }


    //limpiar imagenes previas
    //verificar si tiene valor el campo imagen
    if(modelo.image)
    {
        //eliminar fisicamente si existe
        const nombre = modelo.image.split('/');
        const imagen = nombre[nombre.length-1];
        const id_imagen= imagen.split('.')[0];

        cloudinary.uploader.destroy(id_imagen);
    }

    const {tempFilePath} = req.files.archivo;
    const resp = await cloudinary.uploader.upload(tempFilePath);
    //const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.image=resp.secure_url;

    await modelo.save();

    res.status(200).json({
        msg:'se cargo la imagen correctamente.',
        data:modelo
    });

};

const ActualizarImagen=async (req=request,res=response)=>{
    const {coleccion,id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un usuario con el ID: ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un producto con el ID: ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg:"Se me olvide validar esto"
            });
            break;
    }


    //limpiar imagenes previas
    //verificar si tiene valor el campo imagen
    if(modelo.image)
    {
        //eliminar fisicamente si existe
        const imagenPath=path.join(__dirname,'../uploads/',coleccion,modelo.image);
        if(fs.existsSync(imagenPath))
        {
            fs.unlinkSync(imagenPath);
        }

    }

    const subir=await subirArchivo(req.files,['png','jpg','jpeg','gif'],coleccion);

    

    modelo.image=subir.nombre;

    await modelo.save();

    res.status(200).json({
        msg:'se cargo la imagen correctamente.',
        data:modelo
    });

};

const mostrarImagen=async (req=request,res=response)=>{
    const {coleccion,id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un usuario con el ID: ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg:`No existe un producto con el ID: ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg:"Se me olvide validar esto"
            });
            break;
    }
    const foto=modelo.image;
    if(!foto)
    {
        const defaultImagenPath=path.join(__dirname,'../assets/no-image.jpg');
        return res.sendFile(defaultImagenPath);
    }
    const imagenPath=path.join(__dirname,'../uploads/',coleccion,foto);
    if(fs.existsSync(imagenPath))
    {
        //mandamos la imagen como tal y si se llama desde el frontend se lo ve directamente
        return res.sendFile(imagenPath);
    }
    

};

module.exports={
    cargarImage,
    ActualizarImagen,
    mostrarImagen,
    ActualizarImagenCloudinary
}