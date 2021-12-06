const {Router} = require('express');
const {check} = require('express-validator');
const { crearProducto, getTodosProductos, getUnProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { nombreProductoExiste, existeCategoria, existeProducto } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRol } = require('../middlewares/validar-rol');


const router = Router();

router.get('/', getTodosProductos);

router.get('/:id', [
    check('id','No es un ID valido').isMongoId(), //valido si es un ID valido para mongo NECESARIO
    check('id').custom(async (id)=>{
        await existeProducto(id);
    }),
    validarCampos
],getUnProducto);

//con token
router.post('/', [
    validarJWT,
    tieneRol('ADMIN_ROL'),
    check('nombre','El nombre es obligatorio').not().isEmpty(), //si no es vacio
    check('nombre','El nombre es obligatorio').custom(async (nombre)=>{
        await nombreProductoExiste(nombre); 
    }),
    check('precio','El precio es obligatorio').not().isEmpty(),
    check('precio','El precio debe ser un valor numerico').isNumeric(),
    check('categoria','la categoria no es valida').isMongoId(), 
    check('categoria').custom(async (id)=>{
        await existeCategoria(id);
    }),
    //check('descripcion','La descripcion es obligatoria').not().isEmpty(), //si no es vacio
    validarCampos
],crearProducto);

router.put('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROL'),
    check('id','No es un ID valido').isMongoId(), //valido si es un ID valido para mongo NECESARIO
    check('id').custom(async (id)=>{
        await existeProducto(id);
    }),
    check('nombre','El nombre es obligatorio').not().isEmpty(), //si no es vacio
    check('nombre','El nombre es obligatorio').custom(async (nombre)=>{
        await nombreProductoExiste(nombre); 
    }),
    check('precio','El precio es obligatorio').not().isEmpty(),
    check('precio','El precio debe ser un valor numerico').isNumeric(),
    check('categoria','la categoria no es valida').isMongoId(), 
    check('categoria').custom(async (id)=>{
        await existeCategoria(id);
    }),
    //check('descripcion','La descripcion es obligatoria').not().isEmpty(), //si no es vacio
    validarCampos
],actualizarProducto);

router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROL'),
    check('id','No es un ID valido').isMongoId(), //valido si es un ID valido para mongo NECESARIO
    check('id').custom(async (id)=>{
        await existeProducto(id);
    }),
    validarCampos
],eliminarProducto);







module.exports= router;