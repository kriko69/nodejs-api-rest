const {Router} = require('express');
const {check} = require('express-validator');
const { cargarImage, ActualizarImagen, mostrarImagen, ActualizarImagenCloudinary } = require('../controllers/upload');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarArchivo } = require('../middlewares/validar-archivo');
const { validarCampos } = require('../middlewares/validar-campos');

//constante necesario para la creacion de las rutas
const router = Router();

router.post('/',[
    validarArchivo
], cargarImage); //middleware como 2do parametro

router.put('/:coleccion/:id',[
    validarArchivo,
    check('id','No es un ID valido').isMongoId(), 
    check('coleccion').custom(async (coleccion)=>{
        coleccionesPermitidas(coleccion,['users','productos']);
    }),
    validarCampos
],ActualizarImagenCloudinary);
//],ActualizarImagen);

router.get('/:coleccion/:id',[
    check('id','No es un ID valido').isMongoId(), 
    check('coleccion').custom(async (coleccion)=>{
        coleccionesPermitidas(coleccion,['users','productos']);
    }),
    validarCampos
],mostrarImagen);



module.exports=router;