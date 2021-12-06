const {Router} = require('express');
const {check} = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRol } = require('../middlewares/validar-rol');

const { getTodasCategorias, crearCategoria, getUnaCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categoria');
const { nombreCategoriaExiste, existeCategoria } = require('../helpers/db-validators');


const router = Router();

//todos
router.get('/', getTodasCategorias);

//todos
router.get('/:id', [
    check('id','No es un ID valido').isMongoId(), //valido si es un ID valido para mongo NECESARIO
    check('id').custom(async (id)=>{
        await existeCategoria(id);
    }),
    validarCampos
],getUnaCategoria);

//con token
router.post('/', [
    validarJWT,
    tieneRol('ADMIN_ROL'),
    check('nombre','El nombre es obligatorio').not().isEmpty(), //si no es vacio
    check('nombre','El nombre es obligatorio').custom(async (nombre)=>{
        await nombreCategoriaExiste(nombre); 
    }),
    validarCampos
],crearCategoria);

//con token
router.put('/:id',[
    validarJWT,
    tieneRol('ADMIN_ROL'),
    check('id','No es un ID valido').isMongoId(), 
    check('id').custom(async (id)=>{
        await existeCategoria(id);
    }),
    check('nombre','El nombre es obligatorio').custom(async (nombre)=>{
        await nombreCategoriaExiste(nombre); 
    }),
    validarCampos
], actualizarCategoria);

//con token
router.delete('/:id',[
    validarJWT,
    // esAdminRol,
    tieneRol('ADMIN_ROL'),
    check('id','No es un ID valido').isMongoId(), //valido si es un ID valido para mongo NECESARIO
    check('id').custom(async (id)=>{
        await existeCategoria(id);
    }),
    validarCampos
], eliminarCategoria);



module.exports= router;