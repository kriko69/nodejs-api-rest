/**
 * Este archivo contiene la funcion que permite mostrar los mensajes de error al momento
 *de validar los campos con middlewares, esto se lo llama SIEMPRE, en la parte de los 
  middleware en las rutas siempre y cuando exista una validacion 
 * 
 */

const { validationResult } = require("express-validator");

const validarCampos=(req,res,next)=>{
    //obtenemos los errors de todos los "check" de las rutas
    const errors = validationResult(req);
    //si hay errores y no esta vacio
    if(!errors.isEmpty()) 
    {
        //retornamos los errores
        //esto se podria desestructurar
        return res.json(errors);
    }
    //si no hay errores con next le indicamos que continue el flujo de la aplicacion 
    next();
};

//exportamos funcion
module.exports={
    validarCampos
}